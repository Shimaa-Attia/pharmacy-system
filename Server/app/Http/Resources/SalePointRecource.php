<?php

namespace App\Http\Resources;

use App\Models\Order;
use Carbon\Carbon;
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
          $orders =  Order::where('sale_point_id', $this->id)
          ->get();

          $unpaid_balance=0;
          foreach ($orders as $order){
           $unpaid = $order->totalAmmount - $order->paid;
           $unpaid_balance +=$unpaid;
          }


        return [
            'id'=>$this->id,
            'name'=>$this->name,
            'unpaid_balance'=>$unpaid_balance,
            'created_at'=>$this->created_at->format('Y-m-d H:i'),
            'orders'=>$this->orders,
        ];
    }
}
