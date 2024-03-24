<?php

namespace App\Http\Controllers;

use App\Models\WorkPolicie;
use Illuminate\Http\Request;
use App\Models\CustomProperties;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\WorkPolicieResource;

class WorkPolicieController extends Controller
{
    public function all($type)
    {
         $name = '';
        if($type == "sales"){
            $name = "المبيعات";
        } elseif($type == "clients"){
            $name = "التعامل مع العملاء";
        }elseif($type == "returns"){
            $name = "المرتجعات";
        }elseif($type == "pharmacists"){
            $name = "الصيادلة";
        }
        if($name !=null){
            $type = CustomProperties::where('name',$name)->first();
            $policies= $type->workPolicies;
            return WorkPolicieResource::collection($policies);
        }else{
            return response()->json([
                "message" => "نوع غير موجود",
        ],404);
        }
    }

    public function show($id)
    {
        $policie = WorkPolicie::find($id);
        if ($policie == null) {
            return response()->json([
                "message" => "غير موجود"
            ], 404);
        }
        return new  WorkPolicieResource($policie);

    }
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'body' => 'required|string',
            'type_id'=>'required|exists:custom_properties,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
            ], 409);
        }

        // return $request;
            $policieType = CustomProperties::where('id',$request->type_id)->first();
            if($policieType->type != 'policieType'){
                return response()->json([
                    "message" => "نوع غير موجود",
                ],404);

            }
    WorkPolicie::create($request->all());
        return response()->json([
            "message"=>"تمت الإضافة"
        ]);
    }

    public function update(Request $request, $id)
    {
        //check
        $policie = WorkPolicie::find($id);
        if ($policie == null) {
            return response()->json([
                "message" => "غير موجود"
            ], 404);
        }
        //validation
        $validator = Validator::make($request->all(), [
            'body' => 'nullable|string',
            'type_id'=>'nullable|exists:custom_properties,id',
        ]);
        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
                ],409);
        }
        if($request->type_id){
            $policieType = CustomProperties::where('id',$request->type_id)->first();
            if($policieType->type != 'policieType'){
                return response()->json([
                    "message" => "نوع تعليمات غير موجودد",
                ],404);
            }
        }

        //update
        $policie->update($request->all());
        //response
        return response()->json([
            "message" => "تم التعديل",

        ]);
    }

    public function destroy($id)
    {
        $policie = WorkPolicie::find($id);
        if ($policie == null) {
            return response()->json([
                "message" => "غير موجود"
            ], 404);
        }
        $policie->delete();
        return response()->json([
            "message" => "تمت الأرشفة"], 200);
    }


    public function archive()
    {
        $policies = WorkPolicie::onlyTrashed()->orderBy('deleted_at', 'DESC')->get();
        return  WorkPolicie::collection($policies);
    }

    public function restore($id)
    {
        $policie = WorkPolicie::onlyTrashed()->find($id);
        if ($policie == null) {
            return response()->json([
                "message" => "غير موجود بالأرشيف"
            ], 404);
        }
        $policie->restore();
        return response()->json([
                "message" => "تمت الإستعادة",
        ], 200);
    }

    public function deleteArchive($id)
    {
        $policie = WorkPolicie::onlyTrashed()->find($id);
        if ($policie == null) {
            return response()->json([
                "message" => "غير موجود بالأرشيف"
            ], 404);
        }
        $policie->forceDelete();
        return response()->json([
            "message" => "تم الحذف"], 200);
    }

    public function search($key)
    {
        $policies = WorkPolicie::where('body', 'like', "%$key%")
        ->orderBy('type_id')->get();
        return WorkPolicieResource::collection($policies);
    }
}
