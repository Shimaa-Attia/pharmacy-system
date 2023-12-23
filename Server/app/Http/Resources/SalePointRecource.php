<?php

namespace App\Http\Resources;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SalePointRecource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        //   $orders =  Order::where('sale_point_id', $this->id)->get();
        //   $total = 0;
        //   foreach ($orders as $order){
        //     $total += $order->cost;
        //   }
        return [
            'id'=>$this->id,
            'name'=>$this->name,
            'orders'=>$this->orders,
            // 'total'=>$total,
            'created_at'=>$this->created_at
        ];
    }
}
