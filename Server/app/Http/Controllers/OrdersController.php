<?php

namespace App\Http\Controllers;

use DateTime;
use App\Models\User;
use App\Models\Order;
use http\Env\Response;
use App\Models\Customer;
use App\Models\CustomField;
use Illuminate\Http\Request;
use PhpParser\Node\Stmt\Return_;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\OrderResource;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Test\Constraint\ResponseIsRedirected;

class OrdersController extends Controller
{
    public function all()
    {
        $orders = Order::where('user_id','!=' , null)
        ->orderBy("created_at","DESC")->paginate(20);
        return
            OrderResource::collection($orders);
    }
    public function unAcceptedOrders(){
        $orders = Order::where('user_id', null)
        ->orderBy("created_at","DESC")->paginate(20);
        return
            OrderResource::collection($orders);
    }

    public function show($id)
    {
        $order = order::find($id);
        if ($order == null) {
            return response()->json([
                "message" => "هذا الأوردر غير موجود", 404
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
                'sale_point_id' => 'required|exists:sale_points,id',
                'notes'=>'nullable|string',
                "area_id"=>'nullable|exists:areas,id'

            ]);
        }else{
            $validator = Validator::make($request->all(), [
                'cost' => 'numeric|required|gt:0',
                // 'total_ammount' => 'numeric|required|gte:cost',
                'customer_code' => 'required',
                //    'customer_phone'=>'required|regex:/^01[0125][0-9]{8}$/|exists:custom_fields,value',
                //    'customer_address'=>'required|exists:custom_fields,value',
                'user_code' => 'required|exists:users,code',
                'sale_point_id' => 'required|exists:sale_points,id',
                'notes'=>'nullable|string',
                "area_id"=>'nullable|exists:areas,id'

            ]);
        }
        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()], 409);
        }


        $user = User::where('code', $request->user_code)->first('id');
        $customer = Customer::where('code', $request->customer_code)->first();
        // create customer if not exist
        if (!$customer) {
                if($request->area_id==null){
                    return response()->json([
                        "message" => "اختر منطقة افتراضية للعميل الجديد"], 409);
                }
                $customer = Customer::create([
                    "code" => $request->customer_code,
                    "name" => 'غير محدد',
                    "defualtArea_id"=>$request->area_id,
                ]);
                $area_id= $customer->defualtArea_id;
        }else{
                $area_id= $customer->defualtArea_id;
                if($request->area_id){
                $customer->areas()->syncWithoutDetaching($request->area_id);
                $area_id = $request->area_id;
            }
        }

        //create
        // Find the nearest even hundreds greater than the given number
        $totalAmmount = ceil($request->cost / 200) * 200;



        $order = Order::create([
            "cost" => $request->cost,
            "totalAmmount" => $totalAmmount,
            "notes" => $request->notes,
            "customer_id" => $customer->id,
            "user_id" => $user->id,
            "sale_point_id" => $request->sale_point_id,
            "area_id"=>$area_id,
            "isAccepted"=>true
        ]);


        return response()->json([
            "message" => "تمت إضافة الأوردر",
        ]);

    }

    public function update(Request $request, $id)
    {
        //check
        $order = Order::find($id);
        if ($order == null) {
            return response()->json([
                "message" => "هذا الأوردر غير موجود"
            ], 404);
        }
        //validation
        if($order->user->role =='delivery' && $order->cost == null){
            $validator = Validator::make($request->all(), [
                'total_ammount' => 'numeric|nullable|gt:0',
                'paid' => 'numeric|nullable|lte:total_ammount',
                'customer_code' => 'nullable',
                'user_code' => 'nullable|exists:users,code',
                'customer_area'=>'nullable|string|min:5',
                'sale_point_id' => 'nullable|exists:sale_points,id',
                "area_id"=>'nullable|exists:areas,id'
            ]);
        }else{
            $validator = Validator::make($request->all(), [
                'cost' => 'numeric|nullable|gt:0',
                'total_ammount' => 'numeric|nullable|gte:cost',
                'paid' => 'numeric|nullable|lte:total_ammount',
                'customer_code' => 'nullable',
                'user_code' => 'nullable|exists:users,code',
                'customer_area'=>'nullable|string|min:5',
                'sale_point_id' => 'nullable|exists:sale_points,id',
                "area_id"=>'nullable|exists:areas,id'
            ]);
        }
        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
            ], 409);
        }
       if($request->user_code){
            $user = User::where('code', $request->user_code)->first('id');
            $request->request->add(['user_id'=>$user->id]);
        }
        $customer = $order->customer;
        if($request->customer_code){
            $customer = Customer::where('code', $request->customer_code)->first();
            // create customer if not exist
            if (!$customer) {
                if(empty($request->area_id)){
                    return response()->json([
                        "message" => "اختر منطقة افتراضية للعميل الجديد"], 409);
                }
                $customer = Customer::create([
                    "code" => $request->customer_code,
                    "name" => 'غير محدد',
                    "defualtArea_id"=>$request->area_id,
                ]);
                // $area_id= $customer->defualtArea_id;
            }else{
                if($request->area_id){
                    $customer->areas()->syncWithoutDetaching($request->area_id);
                }else{

                  $request->request->add(['area_id'=>$customer->defualtArea_id]);
                }
            }
            $request->request->add(['customer_id'=>$customer->id]);
        }
        if($request->cost){
            $totalAmmount = ceil($request->cost / 200) * 200;
            $request->request->add(['totalAmmount'=>$totalAmmount]);

        }
        //update

        // $order->update([
        //     "cost" => $request->cost,
        //     "totalAmmount" => $request->total_ammount,
        //     "paid" => $request->paid,
        //     "notes" => $request->notes,
        //     "customer_id" => $customer->id,

        //     "user_id" => $user->id,
        //     "sale_point_id" => $request->sale_point_id

        // ]);

        $order->update($request->all());
        //response
        return response()->json([
            "message" => "تم تعديل  الأوردر بنجاح", "order " => new OrderResource($order)
        ], 200);


    }

    public function popUpOrder(Request $request){

        $validator = Validator::make($request->all(), [
            'customer_code' => 'required',
            'sale_point_id' => 'required|exists:sale_points,id',
            "area_id"=>'nullable|exists:areas,id'
        ]);
        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()], 409);
        }


        $customer = Customer::where('code', $request->customer_code)->first();
        // create customer if not exist
        if (!$customer) {
                if($request->area_id==null){
                    return response()->json([
                        "message" => "اختر منطقة افتراضية للعميل الجديد"], 409);
                }
                $customer = Customer::create([
                    "code" => $request->customer_code,
                    "name" => 'غير محدد',
                    "defualtArea_id"=>$request->area_id,
                ]);
                $area_id= $customer->defualtArea_id;
        }else{
                $area_id= $customer->defualtArea_id;
                if($request->area_id){
                $customer->areas()->syncWithoutDetaching($request->area_id);
                $area_id = $request->area_id;
            }
        }

        $order = Order::create([
            "customer_id" => $customer->id,
            "sale_point_id" => $request->sale_point_id,
            "area_id"=>$area_id,
            "notes" => $request->notes,
        ]);


        return response()->json([
            "message" => "تمت إضافة الأوردر، في إنتظار قبوله من أحد الطيارين",
        ]);
    }

    public function acceptOrder(Request $request, $id){
        $order = Order::find($id);
        if ($order == null) {
            return response()->json([
                "message" => "هذا الأوردر غير موجود"
            ], 404);
        }
        $validator = Validator::make($request->all(), [
            'cost' => 'numeric|required|gt:0',
        ]);
        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()], 409);
        }
        $totalAmmount = ceil($request->cost / 200) * 200;
        // $request->request->add(['totalAmmount'=>$totalAmmount]);


        $update =   $order->update([
            "user_id"=>Auth::user()->id,
            "cost"=>$request->cost,
            "totalAmmount"=>$totalAmmount
        ]);
        if($update){
            return response()->json([
                "message" => "تم قبول الأوردر",
            ]);
        }else{
            return response()->json([
                "message" => "حدث خطأ ما..",
            ]);
        }

    }

    public function cancelOrder($id){
        $order = Order::find($id);
        if ($order == null) {
            return response()->json([
                "message" => "هذا الأوردر غير موجود"
            ], 404);
        }

        $update =   $order->update([
            "user_id"=>null,
            "cost"=>null,
            "totalAmmount"=>null
        ]);
        if($update){
            return response()->json([
                "message" => "تم التراجع عن  قبول هذا الأوردر",
            ]);
        }else{
            return response()->json([
                "message" => "حدث خطأ ما..",
            ]);
        }

    }

    public function destroy($id)
    {
        $order = Order::find($id);
        if ($order == null) {
            return response()->json([
                "message" => "هذا الأوردر غير موجود"
            ], 404);
        }
        $order->delete();
        return response()->json([
            "message" => "تم أرشفة الأوردر"], 200);
    }


    public function archive()
    {

        $orders = Order::onlyTrashed()->orderBy('created_at', 'DESC')->paginate(20);

        return response()->json([
            'orders' => OrderResource::collection($orders),
        ]);


    }

    public function restore($id)
    {
        $order = Order::onlyTrashed()->find($id);
        if ($order == null) {
            return response()->json([
                "message" => "هذا الأوردر غير موجود بالأرشيف"
            ], 404);
        }
        $order->restore();
        return response()->json([
                "message" => "تم إستعادة الأوردر",
                "order" => new OrderResource($order)]
            , 200);
    }

    public function deleteArchive($id)
    {
        $order = Order::onlyTrashed()->find($id);
        if ($order == null) {
            return response()->json([
                "message" => " هذا الأوردر غير موجود بالأرشيف"
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
            ->orderBy('created_at', 'DESC')->paginate(20);
        return OrderResource::collection($orders);

    }

    public function myUser(Request $request, $id)
    {
        if ($request->key) {
            $key = $request->key;
            $orders = Order::where('user_id', $id)
            ->whereColumn('paid', "!=", 'totalAmmount')
                ->where(function ($query) use ($key) {
                    $query->where('totalAmmount', 'like', "$key.%")
                        ->orWhereHas('customer', function ($query) use ($key) {
                            $query->where('code', 'like', "%$key%");
                        });
                })->orderBy('created_at', 'DESC')->paginate(20);
            return OrderResource::collection($orders);

        } else {
            $orders = Order::where('user_id', $id)
               ->whereColumn('paid', "!=", 'totalAmmount')
                ->orderBy('created_at', 'DESC')->paginate(20);
            return OrderResource::collection($orders);

        }

    }

    public function pay(Request $request, $id)
    {
        $order = Order::find($id);
        if ($order == null) {
            return response()->json([
                "message" => "هذا الأوردر غير موجود"
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
            if($newPaid == $order->totalAmmount){
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
        $orders = $order_query->orderBy('created_at', 'DESC')->paginate(20);

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
        $end_date = new DateTime($request->end_date);
        //edit formate
        $end_date = $end_date->modify("+1 day")->format('Y-m-d');
        $users = User::all();
        $result = [];
        $totalNumOfOrders = 0;
        foreach ($users as $user) {
            $orders = Order::where('user_id', $user->id)
                ->where(function ($query) use ($request,$end_date) {
                    $query->whereBetween('created_at', [$request->start_date, $end_date]);

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
                        "message" => "هذا الأوردر غير موجود"
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
                "message" => "هذا الأوردر غير موجود"
            ], 404);
        }

        $update = $order->update([
            "isPaid_theOtherSystem" => !$order->isPaid_theOtherSystem

        ]);
        if ($update) {
            return response()->json([
                "message" => "تم تغيير حالة الأوردر"
            ]);
        } else {
            return response()->json([
                "message" => "حدث خطأ ما"
            ], 409);
        }


    }

}
