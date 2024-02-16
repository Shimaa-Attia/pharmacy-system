<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Shortcoming extends Model
{
    use HasFactory; use SoftDeletes;
    protected $fillable = [
        'productName',
        'productImage',
        'clientInfo',
        'creator_userId',
        'lastUpdater_userId',
        'isAvailable_inOtherBranch',
        'productType',
        'status_id',
        'notes',
        'avillable_fromWhere'
    ];
    public function status(){
        return $this->belongsTo(CustomProperties::class,'status_id','id');
    }
    public function creatorUser(){
        return $this->belongsTo(User::class,'creator_userId','id');
    }
    public function updaterUser(){
        return $this->belongsTo(User::class,'lastUpdater_userId','id');
    }
}
