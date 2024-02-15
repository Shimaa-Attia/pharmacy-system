<?php

namespace App\Http\Controllers;
use App\Models\Company;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CompanyController extends Controller
{
    public function all()
    {
        $companies = Company::orderBy('created_at', 'DESC')->get();
        return  $companies;
    }

    public function show($id)
    {
        $company = Company::find($id);
        if ($company == null) {
            return response()->json([
                "message" => "الشركة غير موجودة"
            ], 404);
        }
        return $company;

    }

    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',
            'phoneNumber'=>'nullable|string',
            'entryInstructions'=>'nullable|string',
            'TaxCard'=>'nullable|string',
            'notes'=>'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
                ], 409);
        }



        //create
        Company::create($request->all());

        return response()->json([
            "message" => "تمت إضافة الشركة "
        ]);
    }

    public function update(Request $request, $id)
    {
        //check
        $company = Company::find($id);
        if ($company == null) {
            return response()->json([
                "message" =>  "الشركة غير موجودة"
            ], 404);
        }
        //validation
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|max:255',
            'phoneNumber'=>'nullable|string',
            'entryInstructions'=>'nullable|string',
            'TaxCard'=>'nullable|string',
            'notes'=>'nullable|string'
        ]);
        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
                ],409);
        }
        //update

        $company->update($request->all());
        //response
        return response()->json([
            "message" => "تم تعديل بيانات الشركة بنجاح",

        ]);
    }


    // public function destroy($id)
    // {
    //     $company = Company::find($id);
    //     if ($company == null) {
    //         return response()->json([
    //             "message" =>  "الشركة غير موجودة"
    //         ]);
    //     }
    //     $company->delete();
    //     return response()->json([
    //         "message" => "تمت أرشفة الشركة "], 200);
    // }


    // public function archive()
    // {

    //     $companies = Company::onlyTrashed()->orderBy('created_at', 'DESC')->get();

    //     return $companies;


    // }

    // public function restore($id)
    // {
    //     $company = Company::onlyTrashed()->find($id);
    //     if ($company == null) {
    //         return response()->json([
    //             "message" => "الشركة غير موجودة بالأرشيف"
    //         ], 404);
    //     }
    //     $company->restore();
    //     return response()->json([
    //             "message" => "تم إستعادة الشركة",
    //     ], 200);
    // }

    // public function deleteArchive($id)
    // {
    //     $company = Company::onlyTrashed()->find($id);
    //     if ($company == null) {
    //         return response()->json([
    //             "message" => "الشركة غير موجودة بالأرشيف"
    //         ],404);
    //     }
    //     $company->forceDelete();
    //     return response()->json([
    //         "message" => "تم الحذف"], 200);
    // }

    public function search($key)
    {
        $companies = Company::where('name', 'like', "%$key%")
        ->orderBy('created_at', 'DESC')->get();
        return $companies;
    }

    public function updateCheckBox($id)
    {
         if($id == "all"){
            Company::where('checkBox', true)->update(['checkBox' => false]);
            return response()->json([
                "message" => "تم التحديث"
            ]);
        }else{
            $company = Company::find($id);
            if ($company == null) {
                return response()->json([
                    "message" => "شركة غير موجودة"
                ], 404);
            }

            $update = $company->update([
                "checkBox" => !$company->checkBox

            ]);
            if ($update) {
                return response()->json([
                    "message" => "تم التحديث"
                ]);
            } else {
                return response()->json([
                    "message" => "حدث خطأ ما"
                ], 409);
            }
        }

    }
}
