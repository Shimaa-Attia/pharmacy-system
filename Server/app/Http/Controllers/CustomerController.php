<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\CustomerReource;
use App\Models\CustomField;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    public function all()
    {
        $customers = Customer::all()->sortByDesc("created_at");
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
            'name' => 'required',
            'code' => 'required|unique:customers,code',
            "phones.*" => 'nullable|min:11|max:11|unique:custom_fields,value',
            "addresses.*" => 'nullable|min:5',
        ]);
        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()], 400);
        }


        DB::transaction(function () use ($request) {
            $customer = Customer::create([
                "code" => $request->code,
                "name" => $request->name,
                "notes" => $request->notes ?? null
            ]);

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
            'name' => 'required',
            'code' => 'required|unique:customers,code,' . $id,
            "phones.value.*" => 'required|regex:/^01[0125][0-9]{8}$/|unique:custom_fields,value,' . $id . ',customer_id',
            "addresses.value.*" => 'required|min:5',

        ]);
        if ($validator->fails()) {
            return response()->json([
                "message" => $validator->errors()
            ], 409);
        }

        DB::transaction(function () use ($request, $id) {
            $customer = customer::find($id);
            $customer->update([
                "code" => $request->code,
                "name" => $request->name,
                "notes" => $request->notes
            ]);

            foreach ($request->phones as $phone) {
                CustomField::where("id", $phone["id"])->update([
                    "value" => $phone['value']
                ]);
            }
            foreach ($request->addresses as $address) {
                CustomField::where("id", $address["id"])->update([
                    "value" => $address['value']
                ]);
            }

        });

        return response()->json([
            "message" => "تم تحديث بيانات العميل",
        ]);


    }

    public
    function destroy($id)
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


    public
    function archive()
    {

        $customers = Customer::onlyTrashed()->orderBy('created_at', 'DESC')->get();
        return response()->json([
            'customers' =>  CustomerReource::collection($customers),
        ]);
    }

    public
    function restore($id)
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

    public
    function deleteArchive($id)
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
            ->OrWhere('code', 'like', "%$key%")
            ->orWhereHas('customFields', function ($query) use ($key) {
                $query->where('value', 'like', "%$key%");
            })
            ->orderBy('created_at', 'DESC')->get();
        return CustomerReource::collection($customers);

    }
}
