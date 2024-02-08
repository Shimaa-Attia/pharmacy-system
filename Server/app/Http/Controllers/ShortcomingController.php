<?php

namespace App\Http\Controllers;

use App\Http\Resources\ShortcomingResource;
use App\Models\Customer;
use App\Models\CustomProperties;
use App\Models\Shortcoming;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ShortcomingController extends Controller
{
    public function all()
    {
        // $data = Category::paginate(request()->all());
        // return Response::json($data, 200);
        // $shortcomings = Shortcoming::all()->sortByDesc("created_at");
        $shortcomings = Shortcoming::orderBy("created_at","DESC")->paginate(100);
        return
            ShortcomingResource::collection($shortcomings);
    }

    public function customersServiceProducts(){
        $shortcomings= Shortcoming::whereNotNull('clientInfo')
                    ->where(function ($query){
                    $query->whereHas('status', function ($query)  {
                            $query->where('name','متوفر وتم الطلب');
                        })->orWhereHas('status', function ($query)  {
                            $query->where('name','غير متوفر');
                        });
                    })->paginate(100);
        return ShortcomingResource::collection($shortcomings);
    }

    public function show($id)
    {
        $shortcoming = Shortcoming::find($id);
        if ($shortcoming == null) {
            return response()->json([
                "message" => "غير موجود", 404
            ]);
        }
        return new  ShortcomingResource($shortcoming);

    }

    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'productName' => 'required|max:255',
            "productImage"=>'nullable|image|mimes:png,jpg,jpeg,gif,webp',
            "isAvailable_inOtherBranch"=>'required|boolean',
            "productType" => 'required|in:أدوية,تركيبات,كوزمو,مستلزمات طبية',

        ]);

        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
                ], 409);
        }
        $imageName =null;
        if($request->productImage != null){ //check if there is image
            $imageName = Storage::putFile("shortcomings", $request->productImage);
        }
        $shortcoming = Shortcoming::create([
            "productName" => $request->productName,
            "productImage" => $imageName,
            "clientInfo" =>$request->clientInfo,
            "notes"=>$request->notes,
            "isAvailable_inOtherBranch"=>$request->boolean('isAvailable_inOtherBranch'),
            "productType"=>$request->productType,
            "creator_userId"=>Auth::user()->id
        ]);

        return response()->json([
            "message" => "تمت إضافته إلى النواقص",
            'sortcoming' => new  ShortcomingResource($shortcoming)
        ]);
    }

    public function update(Request $request, $id)
    {
        //check
        $shortcoming = Shortcoming::find($id);
        if ($shortcoming == null) {
            return response()->json([
                "message" => "غير موجود"
            ], 404);
        }
        //validation
        $validator = Validator::make($request->all(), [
            'productName' => 'nullable|max:255',
            "image"=>'nullable|image|mimes:png,jpg,jpeg,gif,webp',
            "isAvailable_inOtherBranch"=>'nullable|boolean',
            "productType" => 'nullable|in:أدوية,تركيبات,كوزمو,مستلزمات طبية',
            "clientInfo"=>'nullable|string',
            "notes"=>'nullable|string',
            "avillable_fromWhere"=>'nullable|string'
        ]);
        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
                ],409);
        }
        // $imageName=$shortcoming->productImage;
        if($request->image != null){ //check if there is image
            //delete old image
            // Storage::delete($shortcoming->productImage); ?
            if($shortcoming->productImage != null){
                 Storage::disk('public')->delete($shortcoming->productImage);
            }
            //upload new image
            $imageName = Storage::putFile("shortcomings", $request->image);
            $request->request->add(['productImage'=>"".$imageName]);
            // return($request->productImage);
        }



        //update

        // $shortcoming->update([
        //     "productName" => $request->productName,
        //     "productImage" => $imageName,
        //     "clientInfo" =>$request->clientInfo,
        //     "notes"=>$request->notes,
        //     "isAvailable_inOtherBranch"=>$request->boolean('isAvailable_inOtherBranch'),
        //     "productType"=>$request->productType,
        // ]);
        $shortcoming->update($request->all());
        //response
        return response()->json([
            "message" => "تم التعديل",
            'shortcoming' => new  ShortcomingResource($shortcoming)
        ]);
    }

    public function updateStatus(Request $request, $id){
          //check
        $shortcoming = Shortcoming::find($id);
        if ($shortcoming == null) {
            return response()->json([
                "message" => "غير موجود"
            ], 404);
        }
        //validation
        $validator = Validator::make($request->all(), [
           'status_id'=>'required|exists:custom_properties,id'
        ]);
        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
                ],409);
        }
        $status =CustomProperties::where('id',$request->status_id)->first();
        if($status->type!="status"){
            return response()->json([
                 "message" => "اختر احد الحالات الموجودة فقط"
            ], 409);
        }

        $shortcoming->update([
           "status_id"=>$request->status_id,
           "lastUpdater_userId"=>Auth::user()->id
        ]);

        return response()->json([
            "message" => "تم تغير الحالة ",
        ]);
    }


    public function destroy($id)
    {
        $shortcoming = Shortcoming::find($id);
        if ($shortcoming == null) {
            return response()->json([
                "message" => "غير موجود"
            ], 404);
        }
        $shortcoming->delete();
        return response()->json([
            "message" => "تمت الأرشفة"], 200);
    }


    public function archive()
    {

        $shortcomings = Shortcoming::onlyTrashed()->orderBy('created_at', 'DESC')->paginate(100);

        return  ShortcomingResource::collection($shortcomings);


    }

    public function restore($id)
    {
        $shortcoming = Shortcoming::onlyTrashed()->find($id);
        if ($shortcoming == null) {
            return response()->json([
                "message" =>"غير موجود بالأرشيف"
            ], 404);
        }
        $shortcoming->restore();
        return response()->json([
                "message" => "تمت الإستعادة",
                'shortcoming' => new  ShortcomingResource($shortcoming)
        ], 200);
    }

    public function deleteArchive($id)
    {
        $shortcoming = Shortcoming::onlyTrashed()->find($id);
        if ($shortcoming == null) {
            return response()->json([
                "message" =>"غير موجود بالأرشيف"
            ], 404);
        }
        if($shortcoming->productImage != null){
            Storage::disk('public')->delete($shortcoming->productImage);
          }
        $shortcoming->forceDelete();
        return response()->json([
            "message" => "تم الحذف"], 200);
    }

    public function search($key)
    {
        $shortcoming = Shortcoming::where('productName', 'like', "%$key%")
                        ->orWhere('clientInfo','like',"%$key%")
                        ->orWhereHas('status', function ($query) use ($key) {
                            $query->where('type', 'status')
                                  ->Where('name','like',"%$key%");
                        })
        ->orderBy('created_at', 'DESC')->paginate(100);
        return ShortcomingResource::collection($shortcoming);

    }

    public function filter(Request $request){
        $shortcoming_query = Shortcoming::with(['creatorUser', 'status', 'updaterUser']);
        if ($request->branch_id ) {
            $shortcoming_query->whereHas('creatorUser', function ($query) use ($request) {
                $query->where('branch_id', $request->branch_id );
            });
        }
        if ($request->productType) {
            $shortcoming_query->where('productType', $request->productType);
        }
        if($request->fromDate){
            $shortcoming_query->whereDate('created_at','>=', $request->fromDate);
        }
        if ($request->status_id && $request->status_id =="none" ) {
            $shortcoming_query->where('status_id', null);
        }elseif($request->status_id ){
            $shortcoming_query->where('status_id', $request->status_id);
        }
        if ($request->isAvailable_inOtherBranch == "yes") {
            $shortcoming_query->where('isAvailable_inOtherBranch', true);
        } elseif ($request->isAvailable_inOtherBranch == "no") {
            $shortcoming_query->where('isAvailable_inOtherBranch', false);
        }if($request->clientInfo == "notNull"){
            $shortcoming_query->whereNotNull('clientInfo');
        }

        if ($request->key) {
            $key = $request->key;
            $shortcoming_query->where('productName', 'like', "%$key%");
        }
        $shortcomings = $shortcoming_query->orderBy('created_at', 'DESC')->paginate(100);

        return ShortcomingResource::collection($shortcomings);
    }

}

