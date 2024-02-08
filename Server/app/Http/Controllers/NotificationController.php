<?php

namespace App\Http\Controllers;

use App\Models\CustomProperties;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    public function customAll($status){
        if($status =='notDone'){
            $status='لم ينفذ';
        }
        elseif($status =='done'){
            $status='تم تنفيذه';
        }else{
            return response()->json([
               "message"=>"incorrect route"
            ],404);
        }
        $notifications = Notification::with(['status'])
        ->WhereHas('status', function ($query) use ($status) {
            $query->where('name', $status);

        })->orderBy('created_at', 'DESC')->get();


        return $notifications;
    }
    public function show($id)
    {
        $notification =Notification::find($id);
        if ($notification == null) {
            return response()->json([
                "message" => "غير موجود"
            ], 404);
        }
        return $notification;

    }
    public function create(Request $request){
        $validator = Validator::make($request->all(),[
            "body" =>'required|string',
        ]);

        if($validator->fails()){
            return response()->json([
                "message"=>$validator->errors()
            ],409);
        }
        $status= CustomProperties::where('name','لم ينفذ')->first('id');
        $request->request->add(['status_id' =>$status->id]);
        Notification::create($request->all());

        return response()->json([
            "message"=>"تمت إضافة الإشعار"
        ]);
    }

    public function update(Request $request , $id){
        $notification =Notification::find($id);
        if ($notification == null) {
            return response()->json([
                "message" => "غير موجود"
            ], 404);
        }
        $validator = Validator::make($request->all(), [
            'body'=>'nullable|string',
            'status_id'=>'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
            ], 409);
        }

        if($request->status_id =="change"){
            if($notification->status->name =='لم ينفذ'){
                $newStatus = CustomProperties::where('name','تم تنفيذه')->first();
                $request->merge(['status_id' => $newStatus->id]);
            }elseif($notification->status->name =='تم تنفيذه'){
                $newStatus = CustomProperties::where('name','لم ينفذ')->first();
                $request->merge(['status_id' => $newStatus->id]);
            }

        }else{
            $request->request->remove('status_id');
        }
        $notification->update($request->all());

        return response()->json([
            "message"=>"تم تعديل الإشعار"
        ]);
    }

}