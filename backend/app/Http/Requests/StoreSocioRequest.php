<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSocioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombres' => ['required', 'string', 'max:255'],
            'cedula' => ['required', 'string', 'max:50', 'unique:socios,cedula'],
            'celular' => ['required', 'string', 'max:20'],
        ];
    }
}
