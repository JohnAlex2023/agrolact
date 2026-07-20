<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSocioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombres' => ['sometimes', 'required', 'string', 'max:255'],
            'cedula' => ['sometimes', 'required', 'string', 'max:50', Rule::unique('socios', 'cedula')->ignore($this->route('socio'))],
            'celular' => ['sometimes', 'required', 'string', 'max:20'],
            'activo' => ['sometimes', 'boolean'],
        ];
    }
}
