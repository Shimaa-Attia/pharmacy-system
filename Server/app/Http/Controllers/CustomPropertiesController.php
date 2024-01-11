<?php

namespace App\Http\Controllers;

use App\Models\CustomProperties;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CustomPropertiesController extends Controller
{
    public function getCustomList($type){
        $properties = CustomProperties::where('type',$type)->get();
        // if($result === null){
        //     return response()->json([
        //         "message"=>"Not found"
        //     ],404);
        // }
        return $properties;
    }

    public function show($id){
        $property = CustomProperties::find($id);
        if($property ==null){
            return response()->json([
                        "message"=>"غير موجود"
                    ],404);
        }

        return $property;
    }
    public function create(Request $request , $type){
        $validator = Validator::make($request->all(),[
            'name'=>"required|text"
        ]);
        if($validator->fails()){
            return response()->json([
                "message"=>$validator->errors()
            ],409);
        }

       $create = CustomProperties::create([
            'type'=>$type,
            'name'=>$request->name
        ]);

        if($create){
            return response()->json([
              "message"=>"تمت الاضافة"
            ]);
        }else{
            return response()->json([
                "message"=>" حدث خطأ ما"
            ],409);
        }

    }
    public function update(Request $request ,$id){
        $property = CustomProperties::find($id);
        if($property ==null){
            return response()->json([
                        "message"=>"غير موجود"
                    ],404);
        }
        $validator = Validator::make($request->all(),[
            'name'=>"required|text"
        ]);

        if($validator->fails()){
            return response()->json([
                "message"=>$validator->errors()
            ],409);
        }

        $property->update([
          'name'=>$request->name
        ]);

        return response()->json([
            "message"=>"تم التحديث"
        ],409);
    }

    public function destroy($id)
    {
        $property = CustomProperties::find($id);
        if($property ==null){
            return response()->json([
                        "message"=>"غير موجود"
                    ],404);
        }
        $property->delete();
        return response()->json([
            "message" => "تمت الأرشفة"], 200);
    }


    public function archive($type)
    {

        $properties = CustomProperties::onlyTrashed()->where('type',$type)
        ->orderBy('created_at', 'DESC')->get();

        return  $properties;


    }

    public function restore($id)
    {
        $property = CustomProperties::onlyTrashed()->find($id);
        if ($property == null) {
            return response()->json([
                "message" => " غير موجود بالأرشيف"
            ], 404);
        }
        $property->restore();
        return response()->json([
                "message" => "تمت الاستعادة",
                'sale_piont' => $property
        ], 200);
    }

    public function deleteArchive($id)
    {
        $property = CustomProperties::onlyTrashed()->find($id);
        if ($property == null) {
            return response()->json([
                "message" => " غير موجود بالأرشيف"
            ], 404);
        }
        $property->forceDelete();
        return response()->json([
            "message" => "تم الحذف"], 200);
    }
}
