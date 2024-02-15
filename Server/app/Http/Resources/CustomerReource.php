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
            'onHim'=>$this->onHim,
            'forHim'=>$this->forHim,
            'customer_area'=>$this->customer_area,
            'created_at'=>$this->created_at->format('Y/m/d h:i A'),
            'contactInfo'=>$this->customFields,
            'areas'=>$this->areas


        ];
    }
}
