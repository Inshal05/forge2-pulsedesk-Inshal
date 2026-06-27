<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class StoreTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'category'    => ['required', 'string', 'max:100'],
            'priority'    => ['required', 'in:Low,Medium,High,Critical'],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'due_at'      => ['nullable', 'date', 'after:now'],
        ];
    }
}