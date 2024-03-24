<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkPolicie extends Model
{
    use HasFactory; use SoftDeletes;
    protected $fillable =[
      'body',
      'type_id'
    ];
    public function type(){
        return $this->belongsTo(CustomProperties::class,'type_id','id');
    }
}
