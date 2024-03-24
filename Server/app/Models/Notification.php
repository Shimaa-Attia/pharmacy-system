<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Notification extends Model
{
    use HasFactory; use SoftDeletes;
    protected $fillable=[
      'body',
      'status_id',
      'branch_id',
      'creator_userId'
    ];

    public function status(){
        return $this->belongsTo(CustomProperties::class,'status_id','id');
    }

    public function branch(){
        return $this->belongsTo(CustomProperties::class,'branch_id','id');
    }
    public function creatorUser(){
        return $this->belongsTo(User::class,'creator_userId','id');
    }
}
