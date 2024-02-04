<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SellingIncentives extends Model
{
    use HasFactory; use SoftDeletes;
    protected $fillable = [
        'productName',
        'usage',
        'composition',
        'incentiveReason_id',
        'incentivesPercentatge',
        'notes'
    ];

    public function incentiveReason(){
        return $this->belongsTo(CustomProperties::class,'incentiveReason_id','id');
    }

}
