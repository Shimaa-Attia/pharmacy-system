<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomField extends Model
{
    use HasFactory;
    protected $table = "custom_fields";
    public function customer(){
        return $this->belongsTo(Customer::class,'customer_id');
    }

}
