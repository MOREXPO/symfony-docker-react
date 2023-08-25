<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Metadata\ApiResource;

#[ApiResource]
#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: "string", length:254, unique:true)]
    #[Assert\Length(max: 254, maxMessage:"El email debe tener como máximo 254 caracteres")]
    #[Assert\Email(
        message: 'The email {{ value }} is not a valid email.',
    )]
    private $username;


    #[ORM\Column]
    private array $roles = [];

    #[ORM\Column(type: "boolean")]
    private $borrado = false;

    #[ORM\Column(type: "boolean")]
    private $verificado;

    #[ORM\Column(type: "string", length:255, nullable:true)]
    private $tokenVerificacion;




    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    public function getId(): ?string
    {
        return $this->id;
    }

    public function setId(string $id): static
    {
        $this->id = $id;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }


    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getBorrado(): ?bool
    {
        return $this->borrado;
    }

    public function setBorrado(bool $borrado): self
    {
        $this->borrado = $borrado;

        return $this;
    }

    public function getVerificado(): ?bool
    {
        return $this->verificado;
    }

    public function setVerificado(bool $verificado): self
    {
        $this->verificado = $verificado;

        return $this;
    }

    public function getTokenVerificacion(): ?string
    {
        return $this->tokenVerificacion;
    }

    public function setTokenVerificacion(?string $tokenVerificacion): self
    {
        $this->tokenVerificacion = $tokenVerificacion;

        return $this;
    }



    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }
}
