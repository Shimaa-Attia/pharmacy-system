<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class CustomerReource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        return [
            'id'=>$this->id,
            'code'=>$this->code,
            'name'=>$this->name,
            'notes'=>$this->notes,
            'created_at'=>$this->created_at->format('Y-m-d H:i'),
            'contactInfo'=>$this->customFields,

        ];
    }
}
