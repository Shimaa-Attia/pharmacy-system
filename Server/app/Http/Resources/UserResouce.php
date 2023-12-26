<?php

namespace App\Http\Resources;

use App\Models\Order;
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

        $orders =  $this->orders;
        $unpaidAmount = 0;
        foreach ($orders as $order){
            $unpaid = $order->totalAmmount -$order->paid;
            $unpaidAmount += $unpaid;
        }
        return [
            'id'=>$this->id,
            'name'=>$this->name,
            'phone'=>$this->phone,
            'role'=>$this->role,
            'code'=>$this->code,
            'hourRate'=>$this->hourRate,
            'salary'=>$this->salary,
            'notes'=>$this->notes,
            'unpaidAmount'=>$unpaidAmount,
            'created_at' =>$this->created_at->format('Y-m-d H:i')
        ];
    }


}
