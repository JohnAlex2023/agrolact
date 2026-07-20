<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DefinirPrecioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'precio_litro' => ['required', 'numeric', 'min:0.01'],
        ];
    }
}
