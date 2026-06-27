<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'        => ['sometimes', 'required', 'string', 'max:255'],
            'description'  => ['sometimes', 'required', 'string'],
            'category'     => ['sometimes', 'required', 'string', 'max:100'],
            'priority'     => ['sometimes', 'required', 'in:Low,Medium,High,Critical'],
            'status'       => ['sometimes', 'required', 'in:Open,In Progress,Resolved,Closed'],
            'assigned_to'  => ['sometimes', 'nullable', 'exists:users,id'],
            'due_at'       => ['sometimes', 'nullable', 'date'],
            'resolved_at'  => ['sometimes', 'nullable', 'date'],
        ];
    }
}