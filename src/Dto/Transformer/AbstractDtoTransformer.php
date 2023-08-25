<?php

namespace App\Dto\Transformer;
use App\Dto\ComunidadAutonomaDto;

class AbstractDtoTransformer implements DtoTransformerInterface
{
    public function transformFromObjects(iterable $objects): iterable
    {
        $dto = [];

        foreach ($objects as $object) {
            $dto[] = $this->transformFromObject($object);
        }

        return $dto;
    }

    public function transformFromObject($object)
    {
        return $this->transformFromObject($object);
    }

}
