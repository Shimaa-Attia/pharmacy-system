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
            'phone' => 'required|unique:users,phone|regex:/^01[0125][0-9]{8}$/',
            'password' => 'required|confirmed|min:6',
            'role' =>'required|in:طيار,مشرف,صيدلي',
            'code' => 'required|unique:users,code',
            'hourRate' => 'numeric',
            'salary' => 'numeric',

        ]);

        if($validator->fails()){
                return response()->json([
                        "message"=>"validation error",
                        "error"=>$validator->errors()
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


        return response()->json([
                "message"=>"تم اضافة المستخدم",
                'user' => $user,
           ],200 );

    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'phone' => 'required|regex:/^01[0125][0-9]{8}$/',
            'password' => 'required'
        ]);


        if (!auth()->attempt($request->only('phone', 'password'))) {
            return response(['message' => 'البيانات غير صحيحة، حاول مرة أخرى']);
        }

        /** @var \App\Models\User $user **/  $user = Auth::user();
        $token = $user->createToken('API Token')->accessToken;

        return response()->json([
                "message"=>"تم تسجيل دخولك بنجاح",
                'user' => auth()->user(),
                'token' => $token
           ] ,200 );

    }

    public function logout(){

        if(Auth::guard('api')->check()){
         /** @var \App\Models\User $user **/  $user = Auth::guard('api')->user();

            $accessToken = $user->token();

                DB::table('oauth_refresh_tokens')
                    ->where('access_token_id', $accessToken->id)
                    ->update(['revoked' => true]);
            $accessToken->revoke();

            return Response(['data' => 'Unauthorized','message' => 'تم تسجيل خروجك بنجاح'],200);
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
                 "message"=>"هذا المستخدم غير موجود"
             ],404);
         }
         return new UserResouce($user);
       }



   public function update(Request $request, $id){
       //check
        $user =  User::find($id);
        if($user == null){
           return response()->json([
               "message"=>"هذا المستخدم غير موجود"
           ],404);
        }
      //validation
      $validator =  Validator::make($request->all(),[
        'name' => 'required|max:255',
        'phone' => "required|regex:/^01[0125][0-9]{8}$/|unique:users,phone,$user->id",
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
      ],200);


  }

  public function destroy($id)
  {
      $user=User::find($id);
      if($user == null){
        return response()->json([
            "message"=>"هذا المستخدم غير موجود"
        ],404);
     }
      $user->delete();
      return response()->json([
        "message"=>"تم أرشفة المستخدم"
        ],200);
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
            "message"=>"هذا المستخدم غير موجود بالأرشيف"
        ],404);
     }
      $user->restore();
      return response()->json([
        "message"=>"تم إستعادة المستخدم",
        "user"=>$user
        ] ,200);
  }

  public function deleteArchive($id){
      $user=User::onlyTrashed()->find($id);
      if($user == null){
        return response()->json([
            "message"=>" هذا المستخدم غير موجود بالأرشيف"
        ],404);
     }
      $user->forceDelete();
      return response()->json([
        "message"=>"تم الحذف"
    ],200);
  }

}
