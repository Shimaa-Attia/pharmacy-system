<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\CustomerReource;
use App\Models\CustomField;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    public function all()
    {
        $customers = Customer::all();
        return
            CustomerReource::collection($customers);
    }

    public function show($id)
    {
        $customer = Customer::find($id);
        if ($customer == null) {
            return response()->json([
                "message" => "هذا العميل غير موجود"
            ], 404);
        }
        return new CustomerReource($customer);
    }


    public function contactInfo($id){

        $phones = DB::table('custom_fields')
                    ->select('id','value')
                    ->where('name', '=', 'phone')
                    ->where('customer_id', '=', $id)
                    ->get();

        $adresses = DB::table('custom_fields')
                    ->select('id','value')
                    ->where('name', '=', 'address')
                    ->where('customer_id', '=', $id)
                    ->get();

        return response()->json([
                "phones"=>$phones,
                "addresses"=>$adresses
                ]);
    }



    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'code' => 'required',  //|unique:customers,code
            "phones.*"=>'required|regex:/^01[0125][0-9]{8}$/',//|unique:custom_fields,value
            "addresses.*"=>'required|min:5',


        ]);
        if ($validator->fails()) {
            return response()->json([
                "msg" => $validator->errors()
            ], 409);
        }



        // $checkUser = User::where("phone", $request->phone);

                $checkCustomer = Customer::where("code", $request->code)
                ->orWhere(function (Builder $query) {
                    foreach ($request->phones as $phone){
                    $query->join('custom_fields', 'customers.id', '=', 'custom_fields.customer_id')
                        ->where('value', $phone);
                    }
               });

                if ($checkCustomer->where('deleted_at', null)->exists()) {
                    return response()->json([
                        "message" => "هذا العميل مسجل بالفعل",
                    ]);
                }


        //  $num=0;
        // foreach($request->phones as $phone){

        //   $checCustomerPones = Customer::join('custom_fields', 'custom_fields.customer_id', '=', 'customers.id')
        //   ->where('custom_fields.value', $phone);
        //   if ($checCustomerPones->where('deleted_at', null)->exists()) {
        //   $message [] =" the phones.$num has already been taken";
        //   $num++;

        //   }
        // }
        // if(!empty($message)){
        // return response()->json([
        //     "message"=>$message,
        //  ]);
        // }




        $checkCustomer = $checkCustomer->withTrashed()
            ->first();
            dd($checkCustomer);

        // $checCustomerPones = $checCustomerPones->withTrashed()
        //     ->first();

        if ($checkCustomer) {

            try {
                $this->restore($checkCustomer->id);
            } catch (Exception $e) {
                return response()->json([
                    "message" => "هناك مشكلة في الإضافة",

                ]);
            }

            try {
                $this->update($request, $checkCustomer->id);
            } catch (Exception $e) {
                return response()->json([
                    "message" => "هناك مشكلة في الإضافة",
                ]);
            }

            return response()->json([
                "message" => "تم اضافة العميل قديم",
                'customer' => $checkCustomer,
            ], 200);

        // } elseif ($checCustomerPones) {

        // try {
        //     $this->restore($checCustomerPones->id);
        // } catch (Exception $e) {
        //     return response()->json([
        //         "message" => "هناك مشكلة في الإضافة",

        //     ]);
        // }

        // try {
        //     $this->update($request, $checCustomerPones->id);
        // } catch (Exception $e) {
        //     return response()->json([
        //         "message" => "هناك مشكلة في الإضافة",
        //     ]);
        // }

        return response()->json([
            "message" => "تم استرجاع عميل سابق",
            'customer' => $checkCustomer,
        ], 200);

    }





        DB::transaction(function () use ($request) {
            $customer = Customer::create([
                "code" => $request->code,
                "name" => $request->name,
                "notes" => $request->notes
            ]);

            foreach ($request->phones as $phone) {
                CustomField::create([
                    "name" => "phone",
                    "value" => $phone,
                    "customer_id" => $customer->id
                ]);

            }
            foreach ($request->addresses as $address) {
                CustomField::create([
                    "name" => "address",
                    "value" => $address,
                    "customer_id" => $customer->id
                ]);

            }


        });
        return response()->json([
            "message" => "تم إضافة عميل",
        ], 200);

    }

    public function update(Request $request, $id)
    {
        $customer = customer::find($id);
        if ($customer == null) {
            return response()->json([
                "message" => "هذا العميل غير موجود"
            ], 404);
        }


        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'code' => 'required|unique:customers,code,' . $customer->id,
            "phones.*" => 'required|regex:/^01[0125][0-9]{8}$/|unique:custom_fields,value,' . $customer->id . ',customer_id',
            "addresses.*" => 'required|min:5',

        ]);
        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
            ], 409);
        }

        DB::transaction(function () use ($request, $id) {
            $customer = customer::find($id);
            $customer->update([
                "code" => $request->code,
                "name" => $request->name,
                "notes" => $request->notes
            ]);


            CustomField::where('customer_id', $id)->delete();
            foreach ($request->phones as $phone) {

                CustomField::create([
                    "name" => "phone",
                    "value" => $phone,
                    "customer_id" => $customer->id
                ]);

            }
            foreach ($request->addresses as $address) {
                CustomField::create([
                    "name" => "address",
                    "value" => $address,
                    "customer_id" => $customer->id
                ]);

            }

        });

        return response()->json([
            "message" => "تم تحديث بيانات العميل",
        ], 200);


    }

    public function destroy($id)
    {
        $customer = Customer::find($id);
        if ($customer == null) {
            return response()->json([
                "message" => "هذا العميل غير موجود"
            ], 404);
        }
        $customer->delete();
        return response()->json([
            "message" => "تم أرشفة العميل"
        ], 200);
    }


    public function archive()
    {

        $customers = Customer::onlyTrashed()->get();
        return response()->json([
            'customers' => $customers,
        ]);
    }

    public function restore($id)
    {
        $customer = Customer::onlyTrashed()->find($id);
        if ($customer == null) {
            return response()->json([
                "message" => "هذا العميل غير موجود بالأرشيف"
            ], 404);
        }
        $customer->restore();
        return response()->json([
            "message" => "تم إستعادة العميل",
            "customer" => $customer
        ], 200);
    }

    public function deleteArchive($id)
    {
        $customer = Customer::onlyTrashed()->find($id);
        if ($customer == null) {
            return response()->json([
                "message" => " هذا العميل غير موجود بالأرشيف"
            ], 404);
        }
        $customer->forceDelete();
        return response()->json([
            "message" => "تم الحذف"
        ], 200);
    }


}
