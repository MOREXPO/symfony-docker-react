<?php

namespace App\Dto;

use JMS\Serializer\Annotation as Serialization;

class UserDto {
    /**
     * @Serialization\Type("int")
     */
    public $id;

    /**
     * @Serialization\Type("string")
     */
    public $username;
    
    /**
     * @Serialization\Type("string[]")
     */
    public $roles;

    /**
     * @Serialization\Type("boolean")
     */
    public $borrado;
}
