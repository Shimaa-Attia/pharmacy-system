<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\CustomerReource;
use App\Models\CustomField;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    public function all(){
        $customers = Customer::all();
        return
         CustomerReource::collection($customers);
    }

    public function show($id){
        $customer =  Customer::find($id);
        if($customer == null){
             return response()->json([
                 "message"=>"هذا العميل غير موجود",404
             ]);
         }
         return new CustomerReource($customer);
    }

    public function store(Request $request){

        $validator =  Validator::make($request->all(),[
            'name' => 'required',
            'code' => 'required|unique:customers,code',
            "phones.*"=>'required|min:11|max:11|unique:custom_fields,value',
            "addresses.*"=>'required|min:5',

          ]);
        if($validator->fails()){
           return response()->json([
             "msg"=>$validator->errors()
           ,409]);
        }

        //dd($request->all());
        //create

        DB::transaction(function () use($request) {
            $customer = Customer::create([
                "code" => $request->code,
                "name" => $request->name,
            ]);

            foreach($request->phones as $phone){
                CustomField::create([
                    "name"=>"phone",
                    "value"=> $phone,
                    "customer_id" => $customer->id
                ]);

            }
            foreach($request->addresses as $address){
                CustomField::create([
                    "name"=>"address",
                    "value"=> $address,
                    "customer_id" => $customer->id
                ]);

            }



        });
        return response()->json([
                "message"=>"تم إضافة عميل",
           ] ,201 );

   }

   public function update(Request $request, $id){
    $customer =  customer::find($id);
    if($customer == null){
       return response()->json([
           "message"=>"هذا العميل غير موجود",404
       ]);
    }
    return response()->json([
        "message"=>$customer->customFields
    ]);
    dd($customer->customFields());
    $validator =  Validator::make($request->all(),[
        'name' => 'required',
        'code' => 'required|unique:customers,code,'.$customer->id,
        "phones.*"=>'required|min:11|max:11',   //|unique:custom_fields,value,'.$customer->customFields()->id
        "addresses.*"=>'required|min:5',

      ]);
    if($validator->fails()){
       return response()->json([
         "msg"=>$validator->errors()
       ,409]);
    }

    // dd($request->all());

    DB::transaction(function () use($request) {
        $customer = Customer::create([
            "code" => $request->code,
            "name" => $request->name,
        ]);

        foreach($request->phones as $phone){
            CustomField::create([
                "name"=>"phone",
                "value"=> $phone,
                "customer_id" => $customer->id
            ]);

        }
        // foreach($request->addresses as $address){
        //     CustomField::create([
        //         "name"=>"address",
        //         "value"=> $address,
        //         "customer_id" => $customer->id
        //     ]);

        // }



    });


}






}
