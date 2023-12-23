<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sale_point extends Model
{
    use HasFactory;
    use SoftDeletes;
//   protected $table = 'sale_points';
    protected $fillable = [
        'name',
    ];

    public function orders(){
        return $this->hasMany(Order::class,'sale_point_id');
    }
}
