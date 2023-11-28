<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResouce;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;


class UserController extends Controller
{
    public function create(Request $request)
    {
        $validator =  Validator::make($request->all(),[
            'name' => 'required|max:255',
            'phone' => 'required|unique:users,phone|regex:/(01)[0-9]{9}/|min:11|max:11',
            'password' => 'required|confirmed',
            'role' =>'required|in:طيار,مشرف,صيدلي',
            'code' => 'required|unique:users,code',
            'hourRate' => 'numeric',
            'salary' => 'numeric',

        ]);

        if($validator->fails()){
                return response()->json([
                        "message"=>$validator->errors()
                      ],409);
              }
         $hashedPassword = bcrypt($request->password);
         $user =User::create([
               "name"=>$request->name,
               "phone"=>$request->phone,
               "password"=>$hashedPassword,
               "role"=>$request->role,
               "hourRate"=>$request->hourRate,
               "code"=>$request->code,
               "notes"=>$request->notes,
               "salary"=>$request->salary
             ]);

        $token = $user->createToken('API Token')->accessToken;
        return response()->json([
                "message"=>"you registerd successfully",
                'user' => $user,
                'token' => $token
           ] ,201 );

    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'phone' => 'required|regex:/(01)[0-9]{9}/',
            'password' => 'required'
        ]);

        if (!auth()->attempt($data)) {
            return response(['message' => 'البيانات غير صحيحة، حاول مرة أخرى']);
        }
        /** @var \App\Models\User $user **/  $user = Auth::user();
        $token = $user->createToken('API Token')->accessToken;

        return response()->json([
                "message"=>"تم تسجيل دخولك بنجاح",
                'user' => auth()->user(),
                'token' => $token
           ] ,201 );

    }

    public function logout(){


        // if (Auth::check()) {
        // /** @var \App\Models\User $user **/  $user = Auth::user();


        //     $user->AauthAcessToken()->delete();

        // }
        // // /** @var \App\Models\User $user **/  $user = Auth::user();

        // return response()->json([
        //     //  'user' =>$user['name'],
        //     'status'    => 1,
        //     'message'   => 'User Logout',

        // ], 200);


        if(Auth::guard('api')->check()){
         /** @var \App\Models\User $user **/  $user = Auth::guard('api')->user();

            $accessToken = $user->token();

                DB::table('oauth_refresh_tokens')
                    ->where('access_token_id', $accessToken->id)
                    ->update(['revoked' => true]);
            $accessToken->revoke();

            return Response(['data' => 'Unauthorized','message' => 'User logout successfully.'],200);
        }
        return Response(['data' => 'Unauthorized'],401);
    }



    public function all(){
        $users = User::all();
        return UserResouce::collection($users);
    }

    public function show($id){
        $user =  User::find($id);
        if($user == null){
             return response()->json([
                 "message"=>"هذا المستخدم غير موجود",404
             ]);
         }
         return new UserResouce($user);
       }



   public function update(Request $request, $id){
       //check
        $user =  User::find($id);
        if($user == null){
           return response()->json([
               "message"=>"هذا المستخدم غير موجود",404
           ]);
        }
      //validation
      $validator =  Validator::make($request->all(),[
        'name' => 'required|max:255',
        'phone' => "required|regex:/(01)[0-9]{9}/|min:11|max:11|unique:users,phone,$user->id",
        'role' =>'required|in:طيار,مشرف,صيدلي',
        'code' => 'required|unique:users,code,'.$user->id,
        'hourRate' => 'numeric',
        'salary' => 'required|numeric',

    ]);
      if($validator->fails()){
        return response()->json([
                "message"=>$validator->errors()
              ],409);
      }
     //update
     $user->update([
        "name"=>$request->name,
        "phone"=>$request->phone,
        "role"=>$request->role,
        "hourRate"=>$request->hourRate,
        "code"=>$request->code,
        "notes"=>$request->notes,
        "salary"=>$request->salary

     ]);
     //response
    return response()->json([
       "message"=>"تم تعديل بيانات المستخدم بنجاح","new data "=>$user
      ,201]);


  }

  public function destroy($id)
  {
      $user=User::find($id);
      if($user == null){
        return response()->json([
            "message"=>"هذا المستخدم غير موجود",404
        ]);
     }
      $user->delete();
      return response()->json([
        "message"=>"تم أرشفة المستخدم",200]);
   }


  public function archive(){

      $users = User::onlyTrashed()->get();
      return response()->json([
        'users' => $users,
   ]  );
  }

  public function restore($id){
      $user=User::onlyTrashed()->find($id);
      if($user == null){
        return response()->json([
            "message"=>"هذا المستخدم غير موجود بالأرشيف",404
        ]);
     }
      $user->restore();
      return response()->json([
        "message"=>"تم إستعادة المستخدم",
        "user"=>$user,
        200]);
  }

  public function deleteArchive($id){
      $user=User::onlyTrashed()->find($id);
      if($user == null){
        return response()->json([
            "message"=>" هذا المستخدم غير موجود بالأرشيف",404
        ]);
     }
      $user->forceDelete();
      return response()->json([
        "message"=>"تم الحذف",200]);
  }

}
