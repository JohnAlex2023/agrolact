<?php

namespace App\Enums;

enum AccionAuditoria: string
{
    case INSERT = 'INSERT';
    case UPDATE = 'UPDATE';
    case DELETE = 'DELETE';
}
