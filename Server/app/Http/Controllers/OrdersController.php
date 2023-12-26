<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Customer;
use App\Models\Order;
use http\Env\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use PhpParser\Node\Stmt\Return_;

class OrdersController extends Controller
{
    public function all()
    {
        $orders = Order::all();
        // return $orders;
        return
            OrderResource::collection($orders);
    }

    public function show($id)
    {
        $order = order::find($id);
        if ($order == null) {
            return response()->json([
                "message" => "هذا الطلب غير موجود", 404
            ]);
        }
        return new OrderResource($order);

    }

    public function store(Request $request)
    {

        if (Auth::user()->role == 'delivery' && Auth::check()) {
            $request->request->add(['user_id' => Auth::user()->id]);
        }

        $validator = Validator::make($request->all(), [
            'cost' => 'numeric|required',
            'total_ammount' => 'numeric|required',
            'customer_code' => 'required',
        //    'customer_phone'=>'required|regex:/^01[0125][0-9]{8}$/|exists:custom_fields,value',
        //    'customer_address'=>'required|exists:custom_fields,value',
            'user_id' => 'required|exists:users,id',
            'sale_point_id' => 'required|exists:sale_points,id'
        ]);
        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors(),409]);
        }


        $customer = Customer::where('code', $request->customer_code)->first('id');

        // create customer if not exist
        if (!$customer) {
            $customer = Customer::create([
                "code" => $request->customer_code,
                "name" => 'غير محدد',
            ]);
        }
        //create
        $order = Order::create([
            "cost" => $request->cost,
            "totalAmmount" => $request->total_ammount,
            "notes" => $request->notes,
            "customer_id" => $customer->id,
            // "customer_phone" => $request->customer_phone,
            // "customer_address" => $request->customer_address,
            "user_id" => $request->user_id,
            "sale_point_id"=>$request->sale_point_id
        ]);

        return response()->json([
            "message" => "تم إضافة الطلب",
            'order' => $order
        ]);

    }

    public function update(Request $request, $id)
    {
        /** @var \App\Models\User $user * */
        if (Auth::user()->role == 'delivery' && Auth::check()) {
            $request->request->add(['user_id' => Auth::user()->id]);
        }

        //check
        $order = Order::find($id);
        if ($order == null) {
            return response()->json([
                "message" => "هذا الطلب غير موجود"
            ], 404);
        }
        //validation
        $validator = Validator::make($request->all(), [
            'cost' => 'numeric|required',
            'total_ammount' => 'numeric|required',
            'paid' => 'numeric|required',
            'customer_code' => 'required',
            // 'customer_id' => 'required|exists:customers,id',
            // 'customer_phone' => 'required|regex:/(01)[0-9]{9}/|exists:custom_fields,value',
            // 'customer_address' => 'required|exists:custom_fields,value',
            'user_id' => 'required|exists:users,id',
            'sale_point_id' => 'required|exists:sale_points,id'
        ]);
        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
            ], 409);
        }
        $customer = Customer::where('code', $request->customer_code)->first('id');

        // create customer if not exist
        if (!$customer) {
            $customer = Customer::create([
                "code" => $request->customer_code,
                "name" => 'غير محدد',
            ]);
        }
        //update
          
        $order->update([
            "cost" => $request->cost,
            "totalAmmount" => $request->total_ammount,
            "paid" => $request->paid,
            "notes" => $request->notes,
            "customer_id" => $customer->id,
            // "customer_phone" => $request->customer_phone,
            // "customer_address" => $request->customer_address,
            "user_id" => $request->user_id,
            "sale_point_id"=>$request->sale_point_id

        ]);
        //response
        return response()->json([
            "message" => "تم تعديل  الطلب بنجاح", "order " => $order
        ], 200);


    }


    public function destroy($id)
    {
        $order = Order::find($id);
        if ($order == null) {
            return response()->json([
                "message" => "هذا الطلب غير موجود"
            ], 404);
        }
        $order->delete();
        return response()->json([
            "message" => "تم أرشفة الطلب"], 200);
    }


    public function archive()
    {

        $orders = Order::onlyTrashed()->get();

        return response()->json([
            'orders' => OrderResource::collection($orders),
        ]);


    }

    public function restore($id)
    {
        $order = Order::onlyTrashed()->find($id);
        if ($order == null) {
            return response()->json([
                "message" => "هذا الطلب غير موجود بالأرشيف"
            ], 404);
        }
        $order->restore();
        return response()->json([
                "message" => "تم إستعادة الطلب",
                "order" => new OrderResource($order)]
            , 200);
    }

    public function deleteArchive($id)
    {
        $order = Order::onlyTrashed()->find($id);
        if ($order == null) {
            return response()->json([
                "message" => " هذا الطلب غير موجود بالأرشيف"
            ], 404);
        }
        $order->forceDelete();
        return response()->json([
            "message" => "تم الحذف"], 200);
    }

    public function search($key)
    {
        $orders = Order::where('cost', 'like', "%$key%")
            ->orWhereHas('customer', function ($query) use ($key) {
                $query->where('name', 'like', "%$key%")
                    ->OrWhere('code', 'like', "%$key%");
            })
            ->orWhereHas('user', function ($query) use ($key) {
                $query->where('name', 'like', "%$key%")
                    ->OrWhere('code', 'like', "%$key%");
            })
            ->get();
        return OrderResource::collection($orders);

    }

    public function myUser(Request $request, $id)
    {

        if ($request->key) {
            $key = $request->key;
            $orders = Order::where('user_id', $id)
                ->where(function ($query) use ($key) {
                    $query->where('cost', 'like', "%$key%")
                        ->orWhereHas('customer', function ($query) use ($key) {
                            $query->where('name', 'like', "%$key%")
                                ->OrWhere('code', 'like', "%$key%");
                        });
                })->get();
            return OrderResource::collection($orders);

        } else {
            $orders = Order::where('user_id', $id)
                ->get();
            return OrderResource::collection($orders);

        }

    }

    public function pay(Request $request, $id){
        $order = Order::find($id);
        if ($order == null) {
            return response()->json([
                "message" => "هذا الطلب غير موجود"
            ], 404);
        }
        $validator = Validator::make($request->all(), [
            'paid_value' => 'numeric|required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
                , 409]);
        }

        $unpaid =$order->totalAmmount - $order->paid;
        $newPaid= $request->paid_value + $order->paid;
        if($unpaid == 0 ){
            return response()->json([
            "message" => "كامل المبلغ مُسدد بالفعل"
            ]);
        }elseif ($newPaid > $order->totalAmmount){
            return response()->json([
                "message" => "مبلغ اكبر من المطلوب"
            ]);
        }else{
           Order::where('id', $id)->update(array('paid' => $newPaid));
           $order = Order::find($id);
            $unpaid =$order->totalAmmount - $order->paid;
            return response()->json([
                "message" => "تم تسديد المبلغ المطلوب، متبقي من اجمالي المبلغ $unpaid جنيهًا"
            ]);
        }

    }


    public function ordersInSpecificTime(Request $request){

        $validator = Validator::make($request->all(), [
               'start_date' => 'required|date_format:Y-m-d',
               'end_date' => 'required|date_format:Y-m-d',
           ]);
           if ($validator->fails()) {
               return response()->json([
                   "message" => $validator->errors()
               ], 409);
           }

           $orders = Order::whereBetween('created_at',[$request->start_date, $request->end_date])
                   ->get();  //->orderBy('created_at', 'DESC')

              $numOfOrders = count($orders);
              return response()->json([
               "numOfOrders" => $numOfOrders,
           ]);
       }
}
