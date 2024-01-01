<?php

namespace App\Http\Controllers;

use App\Http\Resources\SalePointRecource;
use App\Models\Order;
use App\Models\Sale_point;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SalePointController extends Controller
{
    public function all()
    {
        $points = Sale_point::all()->sortByDesc("created_at");
        return
            SalePointRecource::collection($points);
    }

    public function show($id)
    {
        $point = Sale_point::find($id);
        if ($point == null) {
            return response()->json([
                "message" => "نقطة بيع غير موجودة", 404
            ]);
        }
        return new  SalePointRecource($point);

    }

    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
                ], 409);
        }



        //create
        $point = Sale_point::create([
            "name" => $request->name,
        ]);

        return response()->json([
            "message" => "تم إضافة نقطة بيع",
            'sale_piont' => new  SalePointRecource($point)
        ]);
    }

    public function update(Request $request, $id)
    {
        //check
        $point = Sale_point::find($id);
        if ($point == null) {
            return response()->json([
                "message" => "نقطة بيع غير موجودة"
            ], 404);
        }
        //validation
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',
        ]);
        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
                ],409);
        }
        //update

        $point->update([
            "name" => $request->name,

        ]);
        //response
        return response()->json([
            "message" => "تم تعديل نقطة البيع بنجاح",
            'sale_piont' => new  SalePointRecource($point)
        ]);
    }


    public function destroy($id)
    {
        $point = Sale_point::find($id);
        if ($point == null) {
            return response()->json([
                "message" => "نقطة بيع غير موجودة"
            ], 404);
        }
        $point->delete();
        return response()->json([
            "message" => "تم أرشفة نقطة البيع"], 200);
    }


    public function archive()
    {

        $points = Sale_point::onlyTrashed()->orderBy('created_at', 'DESC')->get();

        return  SalePointRecource::collection($points);


    }

    public function restore($id)
    {
        $point = Sale_point::onlyTrashed()->find($id);
        if ($point == null) {
            return response()->json([
                "message" => "نقطة البيع غير موجودة بالأرشيف"
            ], 404);
        }
        $point->restore();
        return response()->json([
                "message" => "تم إستعادة نقطة البيع",
                'sale_piont' => new  SalePointRecource($point)
        ], 200);
    }

    public function deleteArchive($id)
    {
        $point = Sale_point::onlyTrashed()->find($id);
        if ($point == null) {
            return response()->json([
                "message" => "نقطة البيع غير موجودة بالأرشيف"
            ], 404);
        }
        $point->forceDelete();
        return response()->json([
            "message" => "تم الحذف"], 200);
    }

    public function search($key)
    {
        $points = Sale_point::where('name', 'like', "%$key%")
        ->orderBy('created_at', 'DESC')->get();
        return SalePointRecource::collection($points);

    }

}
