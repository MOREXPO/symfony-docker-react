<?php

namespace App\Dto\Transformer;

use App\Entity\User;
use App\Dto\UserDto;

class UserDtoTransformer extends AbstractDtoTransformer
{
    /**
     * @param User $user
     * 
     * @return UserDto
     */
    public function transformFromObject($user) {
        $dto = new UserDto();

        $dto->id = $user->getId();
        $dto->username = $user->getUsername();
        $dto->roles = $user->getRoles();
        $dto->borrado = $user->getBorrado();
        
        return $dto;
    }
}
