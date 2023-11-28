<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResouce extends JsonResource
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
            'name'=>$this->name,
            'phone'=>$this->phone,
            'role'=>$this->role,
            'code'=>$this->code,
            'hourRate'=>$this->hourRate,
            'salary'=>$this->salary,
            'notes'=>$this->notes,
        ];
    }


}
