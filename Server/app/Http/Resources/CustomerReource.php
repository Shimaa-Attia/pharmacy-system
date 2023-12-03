<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class CustomerReource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $contacts = DB::table('custom_fields')
                ->select('id','name','value')
                ->where('customer_id', '=', $this->id)
                ->get();



        return [
            'id'=>$this->id,
            'name'=>$this->name,
            // 'contactInfo'=>$this->customFields,
            'contactInfo'=>$contacts,
            'notes'=>$this->notes,
        ];
    }
}