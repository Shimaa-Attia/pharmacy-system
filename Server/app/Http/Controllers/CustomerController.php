<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use App\Http\Resources\CustomerReource;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    public function all(){
        $customers = Customer::all();
        return CustomerReource::collection($customers);
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
            'name' => 'required|max:255',
            'code' => 'required|unique:users,code',

          ]);
        if($validator->fails()){
           return response()->json([
             "msg"=>$validator->errors()
           ,409]);
        }
        //create


   }


}
