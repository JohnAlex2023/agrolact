<?php

namespace App\Http\Requests;

use App\Enums\Rol;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class UpdateUsuarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', Rule::unique('usuarios', 'email')->ignore($this->route('usuario'))],
            'password' => ['sometimes', 'nullable', 'string', 'min:6'],
            'rol' => ['sometimes', 'required', new Enum(Rol::class)],
            'activo' => ['sometimes', 'boolean'],
        ];
    }
}
