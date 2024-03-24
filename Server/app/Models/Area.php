<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Area extends Model
{
    use HasFactory; use SoftDeletes;
    protected $fillable =[
       'name',
       'points'
    ];

    public function customers(){
        return $this->belongsToMany(Customer::class);
    }

    public function orders(){
        return $this->hasMany(Order::class,'area_id');
    }
    public function customer(){
        return $this->hasMany(Order::class,'defualtArea_id');
    }
}
