<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAdelantoRequest extends FormRequest
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
            'valor' => ['required', 'numeric', 'min:0.01'],
            'abono_acordado' => ['nullable', 'numeric', 'min:0.01'],
            'observacion' => ['nullable', 'string'],
        ];
    }
}
