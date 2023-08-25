<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use App\ApiResource\ApiResponse;
use App\Dto\Transformer\UserDtoTransformer;
use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Persona;
use App\Repository\UserRepository;
use App\Repository\PersonaRepository;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\Handler\PdoSessionHandler;
use Symfony\Component\HttpFoundation\Session\Storage\NativeSessionStorage;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use App\Dto\Transformer\RolDtoTransformer;
use App\Entity\Rol;
use Doctrine\DBAL\Driver\PDO\PDOException;

class UserController extends AbstractController
{

    private $validator;

    public function __construct(private ManagerRegistry $doctrine, ValidatorInterface $validator)
    {
        $this->validator = $validator;
    }

    #[Route('/user/create', name: 'register', methods: ["POST", "HEAD"])]
    public function create(Request $request, UserPasswordHasherInterface $encoder, MailerInterface $mailer): JsonResponse
    {
        $user = new User();

        try {
            $entityManager = $this->doctrine->getManager();
            $requestContent = json_decode($request->getContent(), true);

            $user->setUsername($requestContent['email']);
            $encoded = $encoder->hashPassword($user, $requestContent['password']);
            $user->setPassword($encoded);
            $user->setVerificado(false);
            $verifToken = bin2hex(random_bytes(20));
            $user->setTokenVerificacion($verifToken);

            $user->setRoles(["ROLE_USER"]);

            /*
            if ($request->get('personaId') && $request->get('personaId') !== "") {
                $repository = $this->getDoctrine()->getRepository(Persona::class);
                $persona = $repository->find($request->get('personaId'));
                if ($persona) $user->setPersona($persona);
            }
            */
            $validationErrors = $this->validar($user);
            if (count($validationErrors))
                return new ApiResponse("Error al crear user", null, $validationErrors, 400);

            $email = (new Email())
                ->from('iagomoredaexpositotrabajo@gmail.com')
                ->to($requestContent['email'])
                //->cc('cc@example.com')
                //->bcc('bcc@example.com')
                //->replyTo('fabien@example.com')
                //->priority(Email::PRIORITY_HIGH)
                ->subject('Verificacion de correo electrónico para PLANTILLA')
                ->html('<p>Por favor, para verificar su dirección email, visite el siguiente enlace: <a href="http://' . $request->server->get('HTTP_HOST') . '/verificarUsuario/' . $requestContent['email'] . '/' . $verifToken . '">haga click aquí</a></p>');

            $mailer->send($email);

            $entityManager->persist($user);
            $entityManager->flush();

            $userDtoTransformer = new UserDtoTransformer();
            $dto = $userDtoTransformer->transformFromObject($user);

            $response = new JsonResponse($dto);
        } catch (\Exception $e) {
            $response = new ApiResponse("Error interno al crear usuario", null, [$e->getMessage()], 400);
        }

        return $response;
    }

    #[Route('/verificarUsuario/{mail}/{token}', name: 'verificar_usuario_email', methods: ["GET", "HEAD"])]
    public function verificarUsuario(Request $request, $mail, $token)
    {
        try {
            $entityManager = $this->doctrine->getManager();
            $repository = $this->doctrine->getRepository(User::class);
            if (!$user = $repository->findOneBy(array("username" => $mail))) throw new \Exception("Usuario no existe.");
            if ($token !== $user->getTokenVerificacion()) throw new \Exception("Petición incorrecta.");

            $user->setVerificado(true);
            $user->setTokenVerificacion(null);
            $entityManager->persist($user);
            $entityManager->flush();
            return new ApiResponse("Ha verificado su cuenta correctamente. ya puede acceder al sistema visitando : <a href='http://" . $request->server->get('HTTP_HOST') . "'>" . $request->server->get('HTTP_HOST') . "</a>", 200);
        } catch (\Exception $e) {
            //$response = new ApiResponse("Error interno al crear usuario", null, [$e->getMessage()], 400);
            return new ApiResponse("Ha ocurrido un error interno al intentar verificar su email. Disculpe las molestias. Por favor contacte con el administrador: " . $e->getMessage(), 400);
        }
    }

    #[Route('/api/user/list', name: 'lista_usuarios')]
    public function list(#[CurrentUser] ?User $user): JsonResponse
    {
        $response = new JsonResponse();
        if (!$user) {
            return new JsonResponse([
                'error' => 'Invalid login request: check that the Content-Type header is "application/json".',
            ], 401);
        }
        if (!in_array("ROLE_ADMIN", $user?->getRoles())) throw new \Exception("No está autorizado.");
        try {
            $repository = $this->doctrine->getRepository(User::class);
            $usuarios = $repository->findAll();
            $userDtoTransformer = new UserDtoTransformer();
            $dto = $userDtoTransformer->transformFromObjects($usuarios);
            $response = new JsonResponse($dto);
        } catch (\Exception $e) {
            $response = new ApiResponse("There was an Exception", null, [$e->getMessage()], 400);
        }

        return $response;
    }

    #[Route('/api/user/update', name: 'actualizar_usuario', methods: ["POST", "HEAD"])]
    public function updateRoles(Request $request): JsonResponse
    {
        $response = new JsonResponse();
        if (!in_array("ROLE_ADMIN", $this->getUser()->getRoles())) throw new \Exception("No está autorizado.");
        try {
            $entityManager = $this->doctrine->getManager();
            $repository = $this->doctrine->getRepository(User::class);

            $data = json_decode($request->getContent(), true);
            $user = $repository->find($data['id']);
            if (!$user) throw new \Exception("No existe el usuario");


            $user->setRoles($data['roles']);
            $user->setUsername($data['username']);
            $entityManager->flush();
        } catch (\Exception $e) {
            $response = new ApiResponse("Error interno al modificar roles de usuario", null, [$e->getMessage()], 400);
        }

        return $response;
    }

    #[Route('/api/user/listRoles', name: 'lista_personas_roles')]
    public function listRoles(): JsonResponse
    {
        $response = new JsonResponse();
        
        try 
        {
            $repository = $this->doctrine->getRepository(Rol::class);
           
            $roles = $repository->findAll();
                
            $rolesDtoTransformer = new RolDtoTransformer();
            $dto = $rolesDtoTransformer->transformFromObjects($roles);
            $response = new JsonResponse($dto);
        } 
        catch(PDOException $e) {
            $response = new ApiResponse("Error al listar roles ", null, [$e->getMessage()], 400);
        }    
        catch (\Exception $e) {
            $response = new ApiResponse("Error al listar roles ", null, [$e->getMessage()], 400);
        }

        return $response;
    }



    #[Route('/api/login', name: 'api_login', methods: ["POST", "HEAD"])]
    public function login(Request $request, UserPasswordHasherInterface $encoder): JsonResponse
    {
        try {
            $entityManager = $this->doctrine->getManager();
            /** @var UserRepository $repository */
            $repository = $this->doctrine->getRepository(User::class);
            $requestContent = json_decode($request->getContent(), true);
            $user = $repository->findOneBy(array('username' => $requestContent['username']));

            if (!$user)
                return new ApiResponse("Error en inicio de sesión, no se encuentra email", null, ['user' => 'invalid email'], 400);
            if (!$encoder->isPasswordValid($user, $requestContent['password']))
                return new ApiResponse("Error en inicio de sesión", null, ['password' => 'invalid password'], 400);

            $userDtoTransformer = new UserDtoTransformer();
            $dto = $userDtoTransformer->transformFromObject($user);

            $response = new JsonResponse($dto);
        } catch (\Exception $e) {
            $response = new ApiResponse("Error interno al iniciar sesion", null, [$e->getMessage()], 400);
        }

        return $response;
    }

    #[Route('/api/user/details', name: 'user_details', methods: ["POST", "HEAD"])]
    public function details(Request $request): JsonResponse {

        $entityManager = $this->doctrine->getManager();
        /** @var UserRepository $repository */
        $repository = $this->doctrine->getRepository(User::class);
        $user = $repository->findOneBy(['username' => $request->request->get('username')]);
        $userDtoTransformer = new UserDtoTransformer();
        $dto = $userDtoTransformer->transformFromObject($user);
        $response = new ApiResponse("OK", $dto);
        return $response;
    }


    #[Route('/api/logout', name: 'app_logout', methods: ["POST", "HEAD"])]
    public function logout(Request $request): JsonResponse
    {
        return new JsonResponse();
    }

    private function validar($usuario)
    {
        $validationErrors = $this->validator->validate($usuario);

        if (count($validationErrors)) {
            $errors = [];
            foreach ($validationErrors as $error) {
                $errors[] = [$error->getPropertyPath() => $error->getMessage()];
            }
            return $errors;
        } else return [];
    }

    #[Route('/api/user/estado', name: 'updateEstado', methods: ["POST", "HEAD"])]
    public function estado(Request $request): JsonResponse
    {
        $response = new JsonResponse();
        if (!in_array("ROLE_ADMIN", $this->getUser()->getRoles())) throw new \Exception("No está autorizado.");
        try {
            $entityManager = $this->doctrine->getManager();
            $repository = $this->doctrine->getRepository(User::class);
            $usuarioId = $request->getContent();
            if (isset($usuarioId))
                $entidad = $repository->find($usuarioId);
            else
                throw new \Exception("La ID no puede estar vacía.");
            if (!$entidad)
                throw new \Exception("No existe el usuario.");

            $entidad->setBorrado(!$entidad->getBorrado());
            $entityManager->persist($entidad);
            $entityManager->flush();
            $entidadDtoTransformer = new UserDtoTransformer();
            $dto = $entidadDtoTransformer->transformFromObject($entidad);
            $response = new JsonResponse($dto);
        } catch (\Exception $e) {
            $response = new ApiResponse("Error interno al actualizar persona", null, [$e->getMessage()], 400);
        }

        return $response;
    }


    #[Route('/api/user/updatePassword', name: 'actualizar_usuario_password', methods: ["POST", "HEAD"])]
    public function updatePassword(Request $request, UserPasswordHasherInterface $encoder): JsonResponse
    {
        $response = new JsonResponse();
        try {
            $entityManager = $this->doctrine->getManager();
            $repository = $this->doctrine->getRepository(User::class);

            $data = json_decode($request->getContent(), true);
            /** @var User $user */
            $user = $this->getUser();

            if (!$user) throw new \Exception("No existe el usuario");
            if (!$encoder->isPasswordValid($user, $data['password']))
                return new ApiResponse("Contraseña actual incorrecta", null, ['password' => 'Contraseña actual incorrecta'], 400);

            $encoded = $encoder->hashPassword($user, $data['newPassword']);
            $user->setPassword($encoded);
            $entityManager->flush();
        } catch (\Exception $e) {
            $response = new ApiResponse("Error interno al modificar contraseña de usuario", null, [$e->getMessage()], 400);
        }

        return $response;
    }
}
