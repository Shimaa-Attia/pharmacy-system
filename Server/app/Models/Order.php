<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use SoftDeletes;
    use HasFactory;
    protected $fillable = [
        'cost',
        'notes',
        'customer_id',
        'user_id',
    ];

    public function customer(){
        return $this->belongsTo(Customer::class,'customer_id');
    }
    public function user(){
        return $this->belongsTo(User::class,'user_id');
    }
}
