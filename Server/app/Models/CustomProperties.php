<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CustomProperties extends Model
{
    use HasFactory;  use SoftDeletes;
    protected $fillable=[
        'type',
        'name'
    ];

    public function users(){
        return $this->hasMany(User::class,'branch_id','id');
    }

    public function shotrcoming(){
        return $this->hasMany(User::class,'status_id','id');
    }
    public function rules(){
        return $this->hasMany(Rule::class,'type_id','id');
    }
    public function sellingIncentives(){
        return $this->hasMany(SellingIncentives::class,'incentiveReason_id','id');
    }

    public function notifications(){
        return $this->hasMany(Notification::class,'status_id','id');
    }
    public function inventoryProducts(){
        return $this->hasMany(InventoryProduct::class,'status_id','id');
    }

}
