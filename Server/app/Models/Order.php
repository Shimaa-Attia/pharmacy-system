<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Monolog\Handler\SamplingHandler;

class Order extends Model
{
    use SoftDeletes;
    use HasFactory;
    protected $fillable = [
        'cost',
        'totalAmmount',
        'paid',
        'notes',
        'customer_id',
        'customer_phone',
        'customer_address',
        'user_id',
        'sale_point_id',
        'isPaid_theOtherSystem'
    ];

    public function customer(){
        return $this->belongsTo(Customer::class,'customer_id');
    }
    public function user(){
        return $this->belongsTo(User::class,'user_id');
    }
    public function sale_point(){
        return $this->belongsTo(Sale_point::class,'sale_point_id');
    }
}
