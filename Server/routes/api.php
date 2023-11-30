<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\OrdersController;
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
//create user(register)
Route::post('/users',[UserController::class,'create']);


Route::middleware('auth:api')->group(function(){
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

Route::group(['prefix'=>'customers','as'=>'customers.'],function(){
    //select all customers
    Route::get('/',[CustomerController::class,'all']);
    //select one customer
    Route::get('/show/{id}',[CustomerController::class,'show']);
    //select customer contact info
    Route::get('/contact/{id}',[CustomerController::class,'contactInfo']);
    //create customer
    Route::post('/',[CustomerController::class,'store']);
    //update customer
    Route::put('/{id}',[CustomerController::class,'update']);
    //customer soft delete
    Route::delete('/delete/{id}',[CustomerController::class,'destroy']);
    Route::get('/archive',[CustomerController::class,'archive']);
    Route::post('/restore/{id}',[CustomerController::class,'restore']);
    Route::delete('/deleteArchive/{id}',[CustomerController::class,'deleteArchive']);

});
Route::group(['prefix'=>'orders','as'=>'orders.'],function(){
    //select all orders
    Route::get('/',[OrdersController::class,'all']);
    //select one order
    Route::get('/show/{id}',[OrdersController::class,'show']);
    //create order
    Route::post('/',[OrdersController::class,'store']);
    //update order
    Route::put('/{id}',[OrdersController::class,'update']);
    //order soft delete
    Route::delete('/delete/{id}',[OrdersController::class,'destroy']);
    Route::get('/archive',[OrdersController::class,'archive']);
    Route::post('/restore/{id}',[OrdersController::class,'restore']);
    Route::delete('/deleteArchive/{id}',[OrdersController::class,'deleteArchive']);

});
