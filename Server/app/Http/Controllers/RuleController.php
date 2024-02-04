<?php

namespace App\Http\Controllers;

use App\Http\Resources\RuleResource;
use App\Models\CustomProperties;
use App\Models\Rule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RuleController extends Controller
{
    public function all($type)
    {

        $type = CustomProperties::where('name',$type)->first();
        if($type == null){
            return response()->json([
                "message" => "نوع تعليمات غير موجودد",
        ],404);
        }
         $rules = $type->rules;

        return RuleResource::collection($rules);
    }

    public function show($id)
    {
        $point = Rule::find($id);
        if ($point == null) {
            return response()->json([
                "message" => "غير موجود"
            ], 404);
        }
        return new  RuleResource($point);

    }
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'body' => 'required|string',
            'type_id'=>'required|exists:custom_properties,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "message" => "validation error",
                "error" => $validator->errors()
            ], 409);
        }

        // return $request;
            $ruleType = CustomProperties::where('id',$request->type_id)->first();
            if($ruleType->type != 'ruleType'){
                return response()->json([
                    "message" => "نوع تعليمات غير موجودد",
                ],404);

            }
    Rule::create($request->all());
        return response()->json([
            "message"=>"تمت الإضافة"
        ]);
    }

    public function update(Request $request, $id)
    {
        //check
        $rule = Rule::find($id);
        if ($rule == null) {
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
            $ruleType = CustomProperties::where('id',$request->type_id)->first();
            if($ruleType->type != 'ruleType'){
                return response()->json([
                    "message" => "نوع تعليمات غير موجودد",
                ],404);
            }
        }

        //update
        $rule->update($request->all());
        //response
        return response()->json([
            "message" => "تم التعديل",

        ]);
    }

    public function destroy($id)
    {
        $rule = Rule::find($id);
        if ($rule == null) {
            return response()->json([
                "message" => "غير موجود"
            ], 404);
        }
        $rule->delete();
        return response()->json([
            "message" => "تمت الأرشفة"], 200);
    }


    public function archive()
    {
        $rules = Rule::onlyTrashed()->orderBy('deleted_at', 'DESC')->get();
        return  Rule::collection($rules);
    }

    public function restore($id)
    {
        $rule = Rule::onlyTrashed()->find($id);
        if ($rule == null) {
            return response()->json([
                "message" => "غير موجود بالأرشيف"
            ], 404);
        }
        $rule->restore();
        return response()->json([
                "message" => "تمت الإستعادة",
        ], 200);
    }

    public function deleteArchive($id)
    {
        $rule = Rule::onlyTrashed()->find($id);
        if ($rule == null) {
            return response()->json([
                "message" => "غير موجود بالأرشيف"
            ], 404);
        }
        $rule->forceDelete();
        return response()->json([
            "message" => "تم الحذف"], 200);
    }

    public function search($key)
    {
        $rules = Rule::where('body', 'like', "%$key%")
        ->orderBy('type_id')->get();
        return RuleResource::collection($rules);
    }

}
