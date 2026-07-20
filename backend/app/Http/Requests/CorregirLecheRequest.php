<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CorregirLecheRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'litros' => ['required', 'numeric', 'min:0'],
            'observacion' => ['required', 'string'],
        ];
    }
}
