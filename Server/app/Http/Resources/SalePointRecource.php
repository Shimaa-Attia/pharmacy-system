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
        $todayDate = date("Y-m-d");
        // $todayDate = Carbon::now();;
          $orders =  Order::where('sale_point_id', $this->id)
         ->where('created_at', 'like', "$todayDate%")
          ->get();
          $total =0;
          foreach ($orders as $order){
            $total += $order->cost;
          }


        return [
            'id'=>$this->id,
            'name'=>$this->name,
            'today_sales'=>$total,
            'created_at'=>$this->created_at,
            'orders'=>$this->orders,
        ];
    }
}
