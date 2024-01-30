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

class CustomFieldsController extends Controller
{
    public function all(Request $request)
    {
        $request->validate([
            'name' => 'required|exists:custom_fields,name:'
        ]);

        $customField = CustomField::where('name', $request->name)->get();
        return response()->json($customField);
    }

}
