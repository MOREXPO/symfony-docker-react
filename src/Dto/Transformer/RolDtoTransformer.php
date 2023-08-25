<?php

namespace App\Dto\Transformer;

use App\Entity\Rol;
use App\Dto\RolDto;

class RolDtoTransformer extends AbstractDtoTransformer
{
    /**
     * @param Rol $rol
     * 
     * @return RolDto
     */
    public function transformFromObject($rol) {
        $dto = new RolDto();

        $dto->id = $rol->getId();
        $dto->nombre = $rol->getNombre();
        $dto->codigo = $rol->getCodigo();
        return $dto;
    }
}
