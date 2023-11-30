<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;

class OrdersController extends Controller
{
    public function all(){
        $orders = Order::all();
        return
         OrderResource::collection($orders);
    }

    public function show($id){
        $order =  order::find($id);
        if($order == null){
             return response()->json([
                 "message"=>"هذا الطلب غير موجود",404
             ]);
         }
         return new OrderResource($order);
    }

    public function destroy($id)
    {
        $order=Order::find($id);
        if($order == null){
        return response()->json([
            "message"=>"هذا الطلب غير موجود",404
        ]);
    }
        $order->delete();
        return response()->json([
        "message"=>"تم أرشفة الطلب",200]);
    }


    public function archive(){

        $orders = Order::onlyTrashed()->get();
        return response()->json([
        'orders' => $orders,
    ]  );
    }

    public function restore($id){
        $order=Order::onlyTrashed()->find($id);
        if($order == null){
        return response()->json([
            "message"=>"هذا الطلب غير موجود بالأرشيف",404
        ]);
    }
        $order->restore();
        return response()->json([
        "message"=>"تم إستعادة الطلب",
        "order"=>$order,
        200]);
    }

    public function deleteArchive($id){
        $order=Order::onlyTrashed()->find($id);
        if($order == null){
        return response()->json([
            "message"=>" هذا الطلب غير موجود بالأرشيف",404
        ]);
    }
        $order->forceDelete();
        return response()->json([
        "message"=>"تم الحذف",200]);
    }

}
