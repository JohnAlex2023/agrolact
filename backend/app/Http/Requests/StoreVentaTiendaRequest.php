<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVentaTiendaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'socio_id' => ['required', 'uuid', 'exists:socios,id'],
            'producto_id' => ['required', 'uuid', 'exists:productos,id'],
            'tipo' => ['required', 'in:CONTADO,FIADO'],
            'cantidad' => ['required', 'numeric', 'min:0.01'],
            'precio_unitario' => ['required', 'numeric', 'min:0.01'],
        ];
    }
}
