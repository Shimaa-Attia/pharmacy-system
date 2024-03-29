<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Customer;
use App\Models\CustomField;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\CustomerReource;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Exists;

use function PHPUnit\Framework\isEmpty;

class CustomerController extends Controller
{
    public function all(Request $request)
    {
        // return $request->noPaginate;
        if($request->noPaginate){
             $customers=Customer::all()->sortByDesc("created_at");
        }else{
            $customers = Customer::orderBy("created_at","DESC")->paginate(20);
        }
        return
            CustomerReource::collection($customers);
    }

    public function show($id)
    {
        $customer = Customer::find($id);
        if ($customer == null) {
            return response()->json([
                "message" => "هذا العميل غير موجود"
            ], 404);
        }
        return new CustomerReource($customer);
    }


    public function contactInfo($id)
    {

        $phones = DB::table('custom_fields')
            ->select('id', 'value')
            ->where('name', '=', 'phone')
            ->where('customer_id', '=', $id)
            ->get();

        $adresses = DB::table('custom_fields')
            ->select('id', 'value')
            ->where('name', '=', 'address')
            ->where('customer_id', '=', $id)
            ->get();

        return response()->json([
            "phones" => $phones,
            "addresses" => $adresses
        ]);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|required',
            'code' => 'required|unique:customers,code',
            "phones.*" => 'nullable|min:11|max:11|unique:custom_fields,value',
            "addresses.*" => 'nullable|min:5',
            "notes"=>'nullable|string',
            'onHim'=>'numeric|nullable|gte:0',
            'forHim'=>'numeric|nullable|gte:0',
            'customer_area'=>'nullable|string|min:5',
            'defualtArea_id'=>'required|exists:areas,id',
            'areas'=>'nullable|array',
            'areas.*'=>'nullable|exists:areas,id'

        ]);
        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()], 409);
        }


        DB::transaction(function () use ($request) {
            // $customer = Customer::create([
            //     "code" => $request->code,
            //     "name" => $request->name,
            //     "notes" => $request->notes ?? null
            // ]);

            $customer=Customer::create($request->all());

            if ($request->has("phones")) {
                foreach ($request->phones as $phone) {
                    if ($phone !== null) {
                        CustomField::create([
                            "name" => "phone",
                            "value" => $phone,
                            "customer_id" => $customer->id
                        ]);
                    }
                }
            }

            if ($request->has("addresses")) {
                foreach ($request->addresses as $address) {
                    CustomField::create([
                        "name" => "address",
                        "value" => $address,
                        "customer_id" => $customer->id
                    ]);
                }
            }
            if($request->has('areas')){
                $customer->areas()->attach( $request->areas);
            }

        });
        return response()->json([
            "message" => "تم إضافة عميل",
        ]);

    }

    public function update(Request $request, $id)
    {
        if (isset($id)) {
            $request->request->add(["id" => $id]);
        }

        $validator = Validator::make($request->all(), [
            "id" => 'required|exists:customers,id',
            'name' => 'nullable',
            'code' => 'nullable|unique:customers,code,' . $id,
            "phones.value.*" => 'nullable|regex:/^01[0125][0-9]{8}$/|unique:custom_fields,value,' . $id . ',customer_id',
            "addresses.value.*" => 'nullable|min:5',
            "notes"=>'nullable|string',
            'onHim'=>'numeric|nullable|gte:0',
            'forHim'=>'numeric|nullable|gte:0',
            // 'customer_area'=>'nullable|string|min:5',
            'areas'=>'nullable|array',
            'areas.*'=>'nullable|exists:areas,id',
            'defualtArea_id'=>'nullable|exists:areas,id',

        ]);
        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
            ], 409);
        }

        DB::transaction(function () use ($request, $id) {
            $customer = customer::find($id);
            $customer->update($request->all());
            if($request->phones){
                foreach ($request->phones as $phone) {
                    if(isset($phone["id"])){

                        CustomField::where("id", $phone["id"])->update([
                            "value" => $phone['value']
                        ]);
                    }else{
                        CustomField::create([
                            "name"=>"phone",
                            "value"=> $phone['value'],
                            "customer_id"=>$customer->id
                        ]);
                    }

                }
            }
            if($request->addresses){
                foreach ($request->addresses as $address) {
                    if(isset($address["id"])){

                       CustomField::where("id", $address["id"])->update([
                          "value" => $address['value']
                      ]);
                    }else{
                        CustomField::create([
                           "name"=>"address",
                           "value"=> $address['value'],
                           "customer_id"=>$customer->id
                        ]);
                    }
                }
            }
            if($request->areas){

            $customer->areas()->sync($request->areas);
            // $customer->areas()->syncWithoutDetaching( $request->areas,false);
            }
        });

        return response()->json([
            "message" => "تم تحديث بيانات العميل",
        ]);


    }

    public function destroy($id)
    {
        $customer = Customer::find($id);
        if ($customer == null) {
            return response()->json([
                "message" => "هذا العميل غير موجود"
            ], 404);
        }
        $customer->delete();
        return response()->json([
            "message" => "تم أرشفة العميل"
        ], 200);
    }


    public function archive()
    {

        $customers = Customer::onlyTrashed()->orderBy('created_at', 'DESC')->paginate(20);
        return response()->json([
            'customers' =>  CustomerReource::collection($customers),
        ]);
    }

    public function restore($id)
    {
        $customer = Customer::onlyTrashed()->find($id);
        if ($customer == null) {
            return response()->json([
                "message" => "هذا العميل غير موجود بالأرشيف"
            ], 404);
        }
        $customer->restore();
        return response()->json([
            "message" => "تم إستعادة العميل",
            "customer" => new CustomerReource($customer)
        ], 200);
    }

    public function deleteArchive($id)
    {
        $customer = Customer::onlyTrashed()->find($id);
        if ($customer == null) {
            return response()->json([
                "message" => " هذا العميل غير موجود بالأرشيف"
            ], 404);
        }
        $customer->forceDelete();
        return response()->json([
            "message" => "تم الحذف"
        ], 200);
    }


    public function search($key)
    {
        $customers = Customer::where('name', 'like', "%$key%")
            ->OrWhere('code', 'like', "$key")
            ->orWhereHas('customFields', function ($query) use ($key) {
                $query->where('value', 'like', "%$key%");
            })
            ->orderBy('created_at', 'DESC')->paginate(20);
        return CustomerReource::collection($customers);

    }

    public function updateCheckBox($id)
    {
         if($id == "all"){
            Customer::where('checkBox', true)->update(['checkBox' => false]);
            return response()->json([
                "message" => "تم التحديث"
            ]);
        }else{
            $customer = Customer::find($id);
            if ($customer == null) {
                return response()->json([
                    "message" => "عميل غير موجود"
                ], 404);
            }

            $update = $customer->update([
                "checkBox" => !$customer->checkBox

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
