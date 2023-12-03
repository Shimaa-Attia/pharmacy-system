<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

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

    public function store(Request $request){
        $validator =  Validator::make($request->all(),[
            'cost' => 'numeric|required',
            'totalAmmount' => 'numeric|required',
            'customer_id'=>'required|exists:customers,id',
            'customer_phone'=>'required|regex:/(01)[0-9]{9}/|exists:custom_fields,value',
            'customer_address'=>'required|exists:custom_fields,value',
            'user_id'=>'required|exists:users,id'

          ]);
        if($validator->fails()){
           return response()->json([
             "msg"=>$validator->errors()
           ,409]);
        }
        //create

      $order =  Order::create([
         "cost"=>$request->cost,
         "totalAmmount"=>$request->totalAmmount,
         "notes"=>$request->notes,
         "customer_id"=>$request->customer_id,
         "customer_phone"=>$request->customer_phone,
         "customer_address"=>$request->customer_address,
         "user_id"=>$request->user_id,
         ]) ;

        return response()->json([
         "message"=>"تم إضافة الطلب",
         'order'=>$order
        ],200);

    }

    public function update(Request $request, $id){
        //check
         $order =  Order::find($id);
         if($order == null){
            return response()->json([
                "message"=>"هذا الطلب غير موجود"
            ],404);
         }
       //validation
       $validator =  Validator::make($request->all(),[
        'cost' => 'numeric|required',
        'totalAmmount' => 'numeric|required',
        'customer_id'=>'required|exists:customers,id',
        'customer_phone'=>'required|regex:/(01)[0-9]{9}/|exists:custom_fields,value',
        'customer_address'=>'required|exists:custom_fields,value',
        'user_id'=>'required|exists:users,id'

     ]);
       if($validator->fails()){
         return response()->json([
                 "message"=>$validator->errors()
               ],409);
       }
      //update
    
      $order->update([
        "cost"=>$request->cost,
         "totalAmmount"=>$request->totalAmmount,
         "notes"=>$request->notes,
         "customer_id"=>$request->customer_id,
         "customer_phone"=>$request->customer_phone,
         "customer_address"=>$request->customer_address,
         "user_id"=>$request->user_id,

      ]);
      //response
     return response()->json([
        "message"=>"تم تعديل  الطلب بنجاح","order "=>$order
       ],200);


   }


    public function destroy($id)
    {
        $order=Order::find($id);
        if($order == null){
        return response()->json([
            "message"=>"هذا الطلب غير موجود"
        ],404);
    }
        $order->delete();
        return response()->json([
        "message"=>"تم أرشفة الطلب"],200);
    }


    public function archive(){

        $orders = Order::onlyTrashed()->get();

            return response()->json([
                'order' => $orders,
            ]  );


    }

    public function restore($id){
        $order=Order::onlyTrashed()->find($id);
        if($order == null){
        return response()->json([
            "message"=>"هذا الطلب غير موجود بالأرشيف"
        ],404);
    }
        $order->restore();
        return response()->json([
        "message"=>"تم إستعادة الطلب",
        "order"=>$order]
        ,200);
    }

    public function deleteArchive($id){
        $order=Order::onlyTrashed()->find($id);
        if($order == null){
        return response()->json([
            "message"=>" هذا الطلب غير موجود بالأرشيف"
        ],404);
    }
        $order->forceDelete();
        return response()->json([
        "message"=>"تم الحذف"],200);
    }

}
