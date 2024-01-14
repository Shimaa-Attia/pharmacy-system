<?php

namespace App\Http\Resources;

use App\Models\CustomProperties;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShortcomingResource extends JsonResource
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
            'productName'=>$this->productName,
            'imageName'=>asset('storage')."/". $this->productImage,
            'clientInfo'=>$this->clientInfo,
            'branch'=>$this->creatorUser->branch,
            'isAvailable_inOtherBranch'=>$this->isAvailable_inOtherBranch,
            'productType'=>$this->productType,
            'created_at'=>$this->created_at->format('Y-m-d H:i'),
            'creatorUser'=>$this->creatorUser,
            'updaterUser'=>$this->updaterUser,
            'status'=>$this->status
        ];
    }
}
