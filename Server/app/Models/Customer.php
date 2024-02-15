<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory;
    use SoftDeletes;
    // protected $dateFormat = 'U';
    protected $fillable = [
        'name',
        'code',
        'notes',
        'onHim',
        'forHim',
        'customer_area'
        ];

    public function orders(){
            return $this->hasMany(Order::class,'customer_id');
    }
        public function customFields(){
            return $this->hasMany(CustomField::class,'customer_id');
    }
    public function areas(){
        return $this->belongsToMany(Area::class);
    }
}
