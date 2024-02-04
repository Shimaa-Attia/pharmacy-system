<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OfferController extends Controller
{
    public function all()
    {
        $Offers = Offer::orderBy('created_at', 'DESC')->get();
        return  $Offers;
    }

    public function show($id)
    {
        $Offer = Offer::find($id);
        if ($Offer == null) {
            return response()->json([
                "message" => "عرض غير موجودة"
            ], 404);
        }
        return $Offer;

    }

    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'productName' => 'required|max:255',
            'offer_endDate'=>'nullable|date',
            'offer'=>'nullable|string',
            'notes'=>'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
                ], 409);
        }



        //create
        Offer::create($request->all());

        return response()->json([
            "message" => "تمت إضافة العرض "
        ]);
    }

    public function update(Request $request, $id)
    {
        //check
        $Offer = Offer::find($id);
        if ($Offer == null) {
            return response()->json([
                "message" => "عرض غير موجود"
            ], 404);
        }
        //validation
        $validator = Validator::make($request->all(), [
            'productName' => 'nullable|max:255',
            'offer_endDate'=>'nullable|date',
            'offer'=>'nullable|string',
            'notes'=>'nullable|string'
        ]);
        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
                ],409);
        }
        //update

        $Offer->update($request->all());
        //response
        return response()->json([
            "message" => "تم تعديل العرض بنجاح",

        ]);
    }


    public function destroy($id)
    {
        $Offer = Offer::find($id);
        if ($Offer == null) {
            return response()->json([
                "message" => "عرض غير موجود"
            ]);
        }
        $Offer->delete();
        return response()->json([
            "message" => "تمت أرشفة العرض "], 200);
    }


    public function archive()
    {

        $Offers = Offer::onlyTrashed()->orderBy('created_at', 'DESC')->get();

        return $Offers;


    }

    public function restore($id)
    {
        $Offer = Offer::onlyTrashed()->find($id);
        if ($Offer == null) {
            return response()->json([
                "message" => "غير موجود بالأرشيف"
            ], 404);
        }
        $Offer->restore();
        return response()->json([
                "message" => "تم إستعادةالعرض",
        ], 200);
    }

    public function deleteArchive($id)
    {
        $Offer = Offer::onlyTrashed()->find($id);
        if ($Offer == null) {
            return response()->json([
                "message" => "غير موجود بالأرشيف"
            ],404);
        }
        $Offer->forceDelete();
        return response()->json([
            "message" => "تم الحذف"], 200);
    }

    public function search($key)
    {
        $Offers = Offer::where('productName', 'like', "%$key%")
        ->orderBy('created_at', 'DESC')->get();
        return $Offers;

    }
}
