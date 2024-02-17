<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CustomProperties;
use App\Models\InventoryProduct;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class InventoryProductController extends Controller
{
    public function customAll($status){
        if($status =='notDone'){
            $status='لم يتم جرده';
        }
        elseif($status =='done'){
            $status='تم جرده';
        }else{
            return response()->json([
            "message"=>"incorrect route"
            ],404);
        }
        $inventoryProducts = InventoryProduct::with(['status','branch'])
        ->where('branch_id',Auth::user()->branch_id)
        ->WhereHas('status', function ($query) use ($status) {
            $query->where('name', $status);

        })->orderBy('created_at', 'DESC')->get();


        return $inventoryProducts;
    }

    public function show($id)
    {
        $inventoryProduct =InventoryProduct::find($id);
        if ($inventoryProduct == null) {
            return response()->json([
                "message" => "غير موجود"
            ], 404);
        }
        return $inventoryProduct;

    }
    public function create(Request $request){
        $validator = Validator::make($request->all(),[
            "productName" =>'required|string',
        ]);

        if($validator->fails()){
            return response()->json([
                "message"=>$validator->errors()
            ],409);
        }
        $status= CustomProperties::where('name','لم يتم جرده')->first('id');
        $request->request->add(['status_id' =>$status->id]);
        $branch_id = Auth::user()->branch_id;
        $request->request->add(['branch_id' =>$branch_id]);

        InventoryProduct::create($request->all());

        return response()->json([
            "message"=>"تمت إضافة المنتج"
        ]);
    }

    public function update(Request $request , $id){
        $inventoryProduct =InventoryProduct::find($id);
        if ($inventoryProduct == null) {
            return response()->json([
                "message" => "غير موجود"
            ], 404);
        }
        $validator = Validator::make($request->all(), [
            'productName'=>'nullable|string',
            'status_id'=>'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
            ], 409);
        }

        if($request->status_id =="change"){
            if($inventoryProduct->status->name =='لم يتم جرده'){
                $newStatus = CustomProperties::where('name','تم جرده')->first();
                $request->merge(['status_id' => $newStatus->id]);
            }elseif($inventoryProduct->status->name =='تم جرده'){
                $newStatus = CustomProperties::where('name','لم يتم جرده')->first();
                $request->merge(['status_id' => $newStatus->id]);
            }

        }else{
            $request->request->remove('status_id');
        }
        $inventoryProduct->update($request->all());

        return response()->json([
            "message"=>"تم التعديل"
        ]);
    }

    

}
