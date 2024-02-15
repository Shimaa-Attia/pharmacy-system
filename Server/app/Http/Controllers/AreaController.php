<?php

namespace App\Http\Controllers;

use App\Models\Area;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AreaController extends Controller
{
    public function all()
    {
        $areas = Area::orderBy('created_at', 'DESC')->get();
        return  $areas;
    }

    public function show($id)
    {
        $area = Area::find($id);
        if ($area == null) {
            return response()->json([
                "message" => "منطقة غير موجودة"
            ], 404);
        }
        return $area;

    }

    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',
            'points'=>'numeric|nullable'
        ]);

        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
                ], 409);
        }



        //create
        Area::create($request->all());

        return response()->json([
            "message" => "تمت إضافة المنطقة "
        ]);
    }

    public function update(Request $request, $id)
    {
        //check
        $area = Area::find($id);
        if ($area == null) {
            return response()->json([
                "message" => "منطقة غير موجود"
            ], 404);
        }
        //validation
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|max:255',
            'points'=>'numeric|nullable'
        ]);
        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
                ],409);
        }
        //update

        $area->update($request->all());
        //response
        return response()->json([
            "message" => "تم تعديل المنطقة بنجاح",

        ]);
    }


    public function destroy($id)
    {
        $area = Area::find($id);
        if ($area == null) {
            return response()->json([
                "message" => "منطقة غير موجود"
            ]);
        }
        $area->delete();
        return response()->json([
            "message" => "تمت أرشفة المنطقة "], 200);
    }


    public function archive()
    {

        $areas = Area::onlyTrashed()->orderBy('created_at', 'DESC')->get();

        return $areas;


    }

    public function restore($id)
    {
        $area = Area::onlyTrashed()->find($id);
        if ($area == null) {
            return response()->json([
                "message" => "غير موجود بالأرشيف"
            ], 404);
        }
        $area->restore();
        return response()->json([
                "message" => "تمت إستعادة المنطقة",
        ], 200);
    }

    public function deleteArchive($id)
    {
        $area = Area::onlyTrashed()->find($id);
        if ($area == null) {
            return response()->json([
                "message" => "غير موجود بالأرشيف"
            ],404);
        }
        $area->forceDelete();
        return response()->json([
            "message" => "تم الحذف"], 200);
    }

    public function search($key)
    {
        $areas = Area::where('name', 'like', "%$key%")
        ->orderBy('created_at', 'DESC')->get();
        return $areas;

    }
}
