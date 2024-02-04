<?php

namespace App\Http\Controllers;

use App\Http\Resources\SellingIncentivesResorce;
use App\Models\CustomProperties;
use App\Models\SellingIncentives;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SellingIncentivesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function all()
    {
        $incentives = SellingIncentives::all()->sortByDesc("created_at");
        return SellingIncentivesResorce::collection($incentives);
    }


    public function show($id)
    {
        $incentive = SellingIncentives::find($id);
        if ($incentive == null) {
            return response()->json([
                "message" => "غير موجود"
            ], 404);
        }
        return new SellingIncentivesResorce( $incentive);
    }
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'productName' => 'required|max:255',
            'usage'=>'nullable|string',
            'composition'=>'nullable|string',
            'incentiveReason_id'=>'nullable|exists:custom_properties,id',
            'notes'=>'nullable|string',
            'incentivesPercentatge'=>'nullable|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
                ], 409);
        }

        $incentiveReason = CustomProperties::where('id',$request->incentiveReason_id)->first();
        if($incentiveReason->type != 'incentiveReason'){
            return response()->json([
                "message" => "سبب غير موجود",
            ],404);

        }

        //create
         SellingIncentives::create($request->all());

        return response()->json([
            "message" => "تمت الإضافة",

        ]);
    }


    public function update(Request $request, $id)
    {
        $incentive = SellingIncentives::find($id);
        if ($incentive == null) {
            return response()->json([
                "message" => "غير موجود"
            ], 404);
        }
        $validator = Validator::make($request->all(), [
            'productName' => 'nullable|max:255',
            'usage'=>'nullable|string',
            'composition'=>'nullable|string',
            'incentiveReason_id'=>'nullable|exists:custom_properties,id',
            'notes'=>'nullable|string',
            'incentivesPercentatge'=>'nullable|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
            ], 409);
        }
        if($request->incentiveReason_id){
            $incentiveReason = CustomProperties::where('id',$request->incentiveReason_id)->first();
            if($incentiveReason->type != 'incentiveReason'){
                return response()->json([
                    "message" => "سبب غير موجود",
                ],404);
            }
        }
        $incentive->update($request->all());

        return response()->json([
            "message" => "تم التعديل",

        ]);

    }

    public function destroy($id)
    {
        $incentive = SellingIncentives::find($id);
        if ($incentive == null) {
            return response()->json([
                "message" => "غير موجود"
            ], 404);
        }
        $incentive->delete();
        return response()->json([
            "message" => "تمت الأرشفة"], 200);
    }


    public function archive()
    {
        $incentives = SellingIncentives::onlyTrashed()->orderBy('deleted_at', 'DESC')->get();
        return SellingIncentivesResorce::collection($incentives);
    }

    public function restore($id)
    {
        $incentive = SellingIncentives::onlyTrashed()->find($id);
        if ($incentive == null) {
            return response()->json([
                "message" => "غير موجود بالأرشيف"
            ], 404);
        }
        $incentive->restore();
        return response()->json([
                "message" => "تمت الإستعادة",
        ], 200);
    }

    public function deleteArchive($id)
    {
        $incentive = SellingIncentives::onlyTrashed()->find($id);
        if ($incentive == null) {
            return response()->json([
                "message" => "غير موجود بالأرشيف"
            ], 404);
        }
        $incentive->forceDelete();
        return response()->json([
            "message" => "تم الحذف"], 200);
    }

    public function filter(Request $request)
    {
        $incentive_query = SellingIncentives::with(['incentiveReason']);
        if ($request->incentiveReason_id) {
            $incentive_query->where('incentiveReason_id', $request->incentiveReason_id);
        }
        if ($request->key) {
            $key = $request->key;
            $incentive_query->where(function ($query) use ($key) {
             $query->where('productName', 'like', "%$key%");
                });

        }
        $incentives = $incentive_query->orderBy('created_at', 'DESC')->get();

        return SellingIncentivesResorce::collection($incentives);

    }


}
