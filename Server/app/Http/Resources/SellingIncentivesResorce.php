<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SellingIncentivesResorce extends JsonResource
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
            'productName' => $this->productName,
            'usage'=>$this->usage,
            'composition'=>$this->composition,
            'incentiveReason'=>$this->incentiveReason,
            'notes'=>$this->notes,
            'incentivesPercentatge'=>$this->incentivesPercentatge,
            'created_at'=>$this->created_at
        ];
    }
}
