<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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
}
