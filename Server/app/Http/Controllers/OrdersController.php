<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Customer;
use App\Models\Order;
use App\Models\User;
use DateTime;
use http\Env\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use PhpParser\Node\Stmt\Return_;
use Symfony\Component\HttpFoundation\Test\Constraint\ResponseIsRedirected;

class OrdersController extends Controller
{
    public function all()
    {
        $orders = Order::all()->sortByDesc("created_at");
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

        if ((Auth::user()->role == 'delivery' || Auth::user()->role == 'doctor') && Auth::check()) {
            $request->request->add(['user_code' => Auth::user()->code]);
        }

        if ((Auth::user()->role == 'delivery') && Auth::check()) {
            $validator = Validator::make($request->all(), [
                'total_ammount' => 'numeric|required|gt:0',
                'customer_code' => 'required',
                'user_code' => 'required|exists:users,code',
                'sale_point_id' => 'required|exists:sale_points,id'
            ]);
        }else{
        $validator = Validator::make($request->all(), [
            'cost' => 'numeric|required|gt:0',
            'total_ammount' => 'numeric|required|gte:cost',
            'customer_code' => 'required',
            //    'customer_phone'=>'required|regex:/^01[0125][0-9]{8}$/|exists:custom_fields,value',
            //    'customer_address'=>'required|exists:custom_fields,value',
            'user_code' => 'required|exists:users,code',
            'sale_point_id' => 'required|exists:sale_points,id'
        ]);
        }
        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()], 409);
        }


        $user = User::where('code', $request->user_code)->first('id');
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
            "user_id" => $user->id,
            "sale_point_id" => $request->sale_point_id
        ]);

        return response()->json([
            "message" => "تم إضافة الطلب",
            'order' => $order
        ]);

    }

    public function update(Request $request, $id)
    {
        //check
        $order = Order::find($id);
        if ($order == null) {
            return response()->json([
                "message" => "هذا الطلب غير موجود"
            ], 404);
        }
        //validation
        if($order->user->role =='delivery' && $order->cost == null){
            $validator = Validator::make($request->all(), [
                'total_ammount' => 'numeric|required|gt:0',
                'paid' => 'numeric|required|lte:total_ammount',
                'customer_code' => 'required',
                'user_code' => 'required|exists:users,code',
                'sale_point_id' => 'required|exists:sale_points,id'
            ]);
        }else{
            $validator = Validator::make($request->all(), [
                'cost' => 'numeric|required|gt:0',
                'total_ammount' => 'numeric|required|gte:cost',
                'paid' => 'numeric|required|lte:total_ammount',
                'customer_code' => 'required',
                'user_code' => 'required|exists:users,code',
                'sale_point_id' => 'required|exists:sale_points,id'
            ]);
        }
        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
            ], 409);
        }

        $user = User::where('code', $request->user_code)->first('id');
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
            "user_id" => $user->id,
            "sale_point_id" => $request->sale_point_id

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

        $orders = Order::onlyTrashed()->orderBy('created_at', 'DESC')->get();

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
    { // $query->where(DB::raw('emb_quota - emb_units_sold'), '>=', $embroidery);
        $orders = Order::where('totalAmmount', 'like', "$key.%")
            ->orWhereHas('customer', function ($query) use ($key) {
                $query->where('code', $key);
            })
            ->orWhereHas('user', function ($query) use ($key) {
                $query->where('name', 'like', "%$key%")
                    ->OrWhere('code', $key);
            })
            ->orderBy('created_at', 'DESC')->get();
        return OrderResource::collection($orders);

    }

    public function myUser(Request $request, $id)
    {

        if ($request->key) {
            $key = $request->key;
            $orders = Order::where('user_id', $id)
                ->where(function ($query) use ($key) {
                    $query->where('totalAmmount', 'like', "$key.%")
                        ->orWhereHas('customer', function ($query) use ($key) {
                            $query->where('code', 'like', "%$key%");
                        });
                })->orderBy('created_at', 'DESC')->get();
            return OrderResource::collection($orders);

        } else {
            $orders = Order::where('user_id', $id)
                ->orderBy('created_at', 'DESC')->get();
            return OrderResource::collection($orders);

        }

    }

    public function pay(Request $request, $id)
    {
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
            ], 409);
        }

        $unpaid = $order->totalAmmount - $order->paid;
        $newPaid = $request->paid_value + $order->paid;
        if ($unpaid == 0) {
            return response()->json([
                "message" => "كامل المبلغ مُسدد بالفعل"
            ]);
        } elseif ($newPaid > $order->totalAmmount) {
            return response()->json([
                "message" => "مبلغ اكبر من المطلوب"
            ]);
        } else {
            $payed_at =null;
            if($newPaid = $order->totalAmmount){
              $payed_at = now();
            }
            $order->update([
                "paid" =>$newPaid,
                "payed_at"=>$payed_at
            ]);
            $unpaid = $order->totalAmmount - $order->paid;
            return response()->json([
                "message" => "تم تسديد المبلغ المطلوب، متبقي من اجمالي المبلغ $unpaid جنيهًا"
            ]);
        }

    }

    public function filter(Request $request)
    {
        $order_query = Order::with(['user', 'customer', 'sale_point']);
        if ($request->is_paid == "paid") {
            $order_query->whereColumn('paid', 'totalAmmount');
        } elseif ($request->is_paid == "unpaid") {
            $order_query->whereColumn('paid', "!=", 'totalAmmount');
        }
        if ($request->point_id) {
            $order_query->where('sale_point_id', $request->point_id);
        }
        if ($request->user_id) {
            $order_query->where('user_id', $request->user_id);
        }
        if($request->fromDate){
            $order_query->whereDate('created_at','>=', $request->fromDate);
        }
        if ($request->key) {
            $key = $request->key;
            $order_query->where(function ($query) use ($key) {
             $query->where('totalAmmount', 'like', "$key.%")
                ->orWhereHas('customer', function ($query) use ($key) {
                    $query->where('code', $key);
                })
                ->orWhereHas('user', function ($query) use ($key) {
                    $query->where('name', 'like', "%$key%")
                        ->OrWhere('code', $key);
                });
            });
        }
        $orders = $order_query->orderBy('created_at', 'DESC')->get();

        return  OrderResource::collection($orders);



    }


    public function ordersInSpecificTime(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'start_date' => 'required|date_format:Y-m-d',
            'end_date' => 'required|date_format:Y-m-d',
        ]);
        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
            ], 409);
        }

        $users = User::all();
        $result = [];
        $totalNumOfOrders = 0;
        $end_date = new DateTime($request->end_date);
        foreach ($users as $user) {
            $orders = Order::where('user_id', $user->id)
                ->where(function ($query) use ($request, $end_date) {
                    $query->whereBetween('created_at', [$request->start_date, $end_date->modify("+1 day")]);

                })->get();

            $numOfOrders = count($orders);
            $totalNumOfOrders += $numOfOrders;
            if ($numOfOrders > 0) {
                $result [] =
                    [
                        "user_id" => $user->id,
                        "user_code" => $user->code,
                        "user_name" => $user->name,
                        "user_role" => $user->role,
                        "numOfOrders" => $numOfOrders
                    ];
            }
        }
        $count = count($result);
        for($j=0;$j<$count;$j++){
            for($i = 0; $i <$count-1; $i ++){
                if($result[$i]['numOfOrders'] > $result[$i+1]['numOfOrders']) {
                    $temp = $result[$i+1];
                    $result[$i+1]=$result[$i];
                    $result[$i]=$temp;
                }
            }
        }

        $result=array_reverse($result);
        return response()->json([
            "totalNumOfOrders" => $totalNumOfOrders,
            "users" => $result
        ]);

    }

     public function deliveryOrderPay($id){



            if ((Auth::user()->role == 'delivery') && Auth::check()) {
                $user_id = Auth::user()->id;
                $order= Order::where('id',$id)
                ->where('user_id',$user_id)->first();
                if($order==null){
                    return response()->json([
                        "message" => "هذا الطلب غير موجود"
                    ], 404);
                }
                if($order->paid == $order->totalAmmount){
                    return response()->json([
                        "message" => "كامل المبلغ مُسدد بالفعل"
                    ]);
                };
            // return now()->format('Y/m/d h:i A');
                $update = $order->update([
                    "paid" => $order->totalAmmount,
                    "payed_at"=>now()
                ]);
            // $pay_time= $order->updated_at->formate('Y-m-d H:i');
            if ($update) {
                return response()->json([
                    "message" => "تم تسديد إجمالي المبلغ"
                ]);
            } else {
                return response()->json([
                    "message" => "حدث خطأ ما"
                ], 409);
            }
        }

    }
    public function isPaid_theOtherSystem(Request $request, $id)
    {

        $order = Order::find($id);
        if ($order == null) {
            return response()->json([
                "message" => "هذا الطلب غير موجود"
            ], 404);
        }


        $update = $order->update([
            "isPaid_theOtherSystem" => !$order->isPaid_theOtherSystem

        ]);
        if ($update) {
            return response()->json([
                "message" => "تم تغيير حالة الطلب"
            ]);
        } else {
            return response()->json([
                "message" => "حدث خطأ ما"
            ], 409);
        }


    }

}
