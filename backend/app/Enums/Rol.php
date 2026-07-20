<?php

namespace App\Enums;

enum Rol: string
{
    case ADMINISTRADOR = 'ADMINISTRADOR';
    case PRESIDENTE = 'PRESIDENTE';
    case RECEPCIONISTA = 'RECEPCIONISTA';
    case ENCARGADO_TIENDA = 'ENCARGADO_TIENDA';
}
