<?php

namespace App\Dto;

use JMS\Serializer\Annotation as Serialization;

class RolDto {
    /**
     * @Serialization\Type("int")
     */
    public $id;

    /**
     * @Serialization\Type("string")
     */
    public $nombre;
    /**
     * @Serialization\Type("string")
     */
    public $codigo;
}
