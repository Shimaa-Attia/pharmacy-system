<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'cost'=>$this->cost,
            'total_ammount'=>$this->totalAmmount,
            'customer'=>$this->customer,
            'customer_phone'=>$this->customer_phone,
            'customer_address'=>$this->customer_address,
            'delivery_man'=>$this->user,
            'notes'=>$this->notes,
            'created_at'=>$this->created_at
        ];
    }
}
