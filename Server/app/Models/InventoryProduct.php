<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InventoryProduct extends Model
{
    use HasFactory;use SoftDeletes;
    protected $fillable=[
      'productName',
      'status_id'
    ];

    public function status(){
        return $this->belongsTo(CustomProperties::class,'status_id','id');
    }
}