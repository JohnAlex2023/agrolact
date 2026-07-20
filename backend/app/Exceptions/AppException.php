<?php

namespace App\Exceptions;

use Exception;

class AppException extends Exception
{
    public function __construct(string $message, protected int $statusCode = 400)
    {
        parent::__construct($message);
    }

    public function statusCode(): int
    {
        return $this->statusCode;
    }
}
