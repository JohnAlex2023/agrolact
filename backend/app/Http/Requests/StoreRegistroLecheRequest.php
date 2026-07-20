<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRegistroLecheRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'socio_id' => ['required', 'uuid', 'exists:socios,id'],
            'fecha' => ['required', 'date'],
            'jornada' => ['required', 'in:MANANA,TARDE'],
            'litros' => ['required', 'numeric', 'min:0'],
        ];
    }
}
