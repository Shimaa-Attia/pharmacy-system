<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
// use Laravel\Sanctum\HasApiTokens;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use SoftDeletes;

    use HasApiTokens, HasFactory, Notifiable;


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'phone',
        'role',
        'code',
        'hourRate',
        'notes',
        'password',
        'branch_id',
        'salary',

    ];
    public function orders(){
        return $this->hasMany(Order::class,'user_id');
    }
    public function branch(){
        return $this->belongsTo(CustomProperties::class,'branch_id','id');
    }

    public function shortcoming(){
        return $this->hasMany(Shortcoming::class,'creator_userId','id');
    }
    public function notification(){
        return $this->hasMany(Shortcoming::class,'creator_userId','id');
    }
    public function inventory_product(){
        return $this->hasMany(Shortcoming::class,'creator_userId','id');
    }

    public function updatedShortcoming(){
        return $this->hasMany(Shortcoming::class,'lastUpdater_userId','id');
    }



    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
}
