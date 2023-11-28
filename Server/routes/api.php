<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();

});
//login
Route::post('/login',[UserController::class,'login']);
//select all users
Route::get('users',[UserController::class,'all']);
//select one user
Route::get('users/show/{id}',[UserController::class,'show']);

//select all customers
Route::get('customers',[CustomerController::class,'all']);
//select one customer
Route::get('customers/show/{id}',[CustomerController::class,'show']);


Route::middleware('auth:api')->group(function(){
//create user
Route::post('/users',[UserController::class,'create']);
//logout
Route::post('/logout',[UserController::class,'logout']);
//update user
Route::put('users/{id}',[UserController::class,'update']);
//usersoft delete
Route::delete('users/delete/{id}',[UserController::class,'destroy']);
Route::get('users/archive',[UserController::class,'archive']);
Route::post('users/restore/{id}',[UserController::class,'restore']);
Route::delete('users/deleteArchive/{id}',[UserController::class,'deleteArchive']);

});


