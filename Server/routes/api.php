<?php

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\RuleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CustomCotroller;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SalePointController;
use App\Http\Controllers\ShortcomingController;
use App\Http\Controllers\WorkPolicieController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\CustomPropertiesController;
use App\Http\Controllers\InventoryProductController;
use App\Http\Controllers\SellingIncentivesController;

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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();

});

//login
Route::post('/login',[UserController::class,'login']);


Route::middleware(['auth:api'])->group(function(){
    //checke auth
    Route::get("/users/auth", [UserController::class,'checkAuth']);
    //logout
    Route::post('/logout',[UserController::class,'logout']);
    Route::group(['prefix'=>'users','as'=>'users.'],function(){
        //select all users
        Route::get('/',[UserController::class,'all']);
        //select one user
        Route::get('/show/{id}',[UserController::class,'show']);
        //create user(register)
        Route::post('/',[UserController::class,'create']);
        //update user
        Route::put('/{id}',[UserController::class,'update']);
        //usersoft delete
        Route::delete('/delete/{id}',[UserController::class,'destroy']);
        Route::get('/archive',[UserController::class,'archive']);
        Route::post('/restore/{id}',[UserController::class,'restore']);
        Route::delete('/deleteArchive/{id}',[UserController::class,'deleteArchive']);
        //search user
        Route::get('/search/{key}',[UserController::class,'search']);
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
        //search customer
         Route::get('/search/{key}',[CustomerController::class,'search']);
         //updateCheckBox
         Route::put('/updateCheckBox/{id}',[CustomerController::class,'updateCheckBox']);

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
         //search orders
         Route::get('/search/{key}',[OrdersController::class,'search']);
         //get orders of an user
        Route::get('/user/{id}',[OrdersController::class,'myUser']);
        //pay for an order
        Route::post('/pay/{id}',[OrdersController::class,'pay']);
         //get orders in a specific period
        Route::post('/specificOrders',[OrdersController::class,'ordersInSpecificTime']);
        //filter
        Route::get('/filter',[OrdersController::class,'filter']);

        Route::post('/isPaid_theOtherSystem/{id}',[OrdersController::class,'isPaid_theOtherSystem']);
        //deliveryOrderPay
        Route::put('/deliveryOrderPay/{id}',[OrdersController::class,'deliveryOrderPay']);

        //popUp
        //popUp order
        Route::post('/AddPopUpOrder',[OrdersController::class,'popUpOrder']);
        //accept popUp order
        Route::put('/acceptPopUpOrder/{id}',[OrdersController::class,'acceptOrder']);
        //cancel accepting popUp order
        Route::put('/cancelPopUpOrder/{id}',[OrdersController::class,'cancelOrder']);
        //select uaccepted orders
        Route::get('/unAcceptedOrders',[OrdersController::class,'unAcceptedOrders']);


    });

    Route::group(['prefix'=>'points','as'=>'points.'],function(){
        //select all points
        Route::get('/',[SalePointController::class,'all']);
        //select one point
        Route::get('/show/{id}',[SalePointController::class,'show']);
        //create point
        Route::post('/',[SalePointController::class,'store']);
        //update point
        Route::put('/{id}',[SalePointController::class,'update']);
        //point soft delete
        Route::delete('/delete/{id}',[SalePointController::class,'destroy']);
        Route::get('/archive',[SalePointController::class,'archive']);
        Route::post('/restore/{id}',[SalePointController::class,'restore']);
        Route::delete('/deleteArchive/{id}',[SalePointController::class,'deleteArchive']);
         //search points
         Route::get('/search/{key}',[SalePointController::class,'search']);

    });
    Route::group(['prefix'=>'properties','as'=>'properties.'],function(){
        //getCustomList
        Route::get('/getCustomList/{type}',[CustomPropertiesController::class,'getCustomList']);
        //select one
        Route::get('/show/{id}',[CustomPropertiesController::class,'show']);
         //create
         Route::post('/{type}',[CustomPropertiesController::class,'create']);
        //update
        Route::put('/{id}',[CustomPropertiesController::class,'update']);
        // soft delete
        Route::delete('/delete/{id}',[CustomPropertiesController::class,'destroy']);
        Route::get('{type}/archive/',[CustomPropertiesController::class,'archive']);
        Route::post('/restore/{id}',[CustomPropertiesController::class,'restore']);
        Route::delete('/deleteArchive/{id}',[CustomPropertiesController::class,'deleteArchive']);
        //search points
        //  Route::get('/search/{key}',[CustomPropertiesController::class,'search']);

    });
    Route::group(['prefix'=>'shortcomings','as'=>'shortcomings.'],function(){
        //select all
        Route::get('/',[ShortcomingController::class,'all']);
        //select one
        Route::get('/show/{id}',[ShortcomingController::class,'show']);
        //create
        Route::post('/',[ShortcomingController::class,'store']);
        //update
        Route::put('/{id}',[ShortcomingController::class,'update']);
        //soft delete
        Route::delete('/delete/{id}',[ShortcomingController::class,'destroy']);
        Route::get('/archive',[ShortcomingController::class,'archive']);
        Route::post('/restore/{id}',[ShortcomingController::class,'restore']);
        Route::delete('/deleteArchive/{id}',[ShortcomingController::class,'deleteArchive']);
        //search
        Route::get('/search/{key}',[ShortcomingController::class,'search']);
        //filter
        Route::get('/filter',[ShortcomingController::class,'filter']);
        //update status
        Route::post('/updateStatus/{id}',[ShortcomingController::class,'updateStatus']);
        //customersServiceProducts
        Route::get('/customersServiceProducts',[ShortcomingController::class,'customersServiceProducts']);


    });
    Route::group(['prefix'=>'rules','as'=>'rules'],function(){
        //select all
        Route::get('/{type}',[RuleController::class,'all']);
        //select one
        Route::get('/show/{id}',[RuleController::class,'show']);
        //create
        Route::post('/',[RuleController::class,'create']);
        //update
        Route::put('/{id}',[RuleController::class,'update']);
        //soft delete
        Route::delete('/delete/{id}',[RuleController::class,'destroy']);
        Route::get('/archive',[RuleController::class,'archive']);
        Route::post('/restore/{id}',[RuleController::class,'restore']);
        Route::delete('/deleteArchive/{id}',[RuleController::class,'deleteArchive']);
        //search
        Route::get('/search/{key}',[RuleController::class,'search']);


    });

    Route::group(['prefix'=>'incentives','as'=>'incentives'],function(){
        //select all
        Route::get('/',[SellingIncentivesController::class,'all']);
        //select one
        Route::get('/show/{id}',[SellingIncentivesController::class,'show']);
        //create
        Route::post('/',[SellingIncentivesController::class,'create']);
        //update
        Route::put('/{id}',[SellingIncentivesController::class,'update']);
        //soft delete
        Route::delete('/delete/{id}',[SellingIncentivesController::class,'destroy']);
        Route::get('/archive',[SellingIncentivesController::class,'archive']);
        Route::post('/restore/{id}',[SellingIncentivesController::class,'restore']);
        Route::delete('/deleteArchive/{id}',[SellingIncentivesController::class,'deleteArchive']);
        //filter
        Route::get('/filter',[SellingIncentivesController::class,'filter']);

    });

    Route::group(['prefix'=>'offers','as'=>'offers'],function(){
        //select all
        Route::get('/',[OfferController::class,'all']);
        //select one
        Route::get('/show/{id}',[OfferController::class,'show']);
        //create
        Route::post('/',[OfferController::class,'store']);
        //update
        Route::put('/{id}',[OfferController::class,'update']);
        // soft delete
        Route::delete('/delete/{id}',[OfferController::class,'destroy']);
        Route::get('/archive',[OfferController::class,'archive']);
        Route::post('/restore/{id}',[OfferController::class,'restore']);
        Route::delete('/deleteArchive/{id}',[OfferController::class,'deleteArchive']);
         //search
         Route::get('/search/{key}',[OfferController::class,'search']);

    });

    Route::group(['prefix'=>'companies','as'=>'companies'],function(){
        //select all
        Route::get('/',[CompanyController::class,'all']);
        //select one
        Route::get('/show/{id}',[CompanyController::class,'show']);
        //create
        Route::post('/',[CompanyController::class,'store']);
        //update
        Route::put('/{id}',[CompanyController::class,'update']);
        // // soft delete
        // Route::delete('/delete/{id}',[CompanyController::class,'destroy']);
        // Route::get('/archive',[CompanyController::class,'archive']);
        // Route::post('/restore/{id}',[CompanyController::class,'restore']);
        // Route::delete('/deleteArchive/{id}',[CompanyController::class,'deleteArchive']);
        //search
        Route::get('/search/{key}',[CompanyController::class,'search']);
        //updateCheckBox
        Route::put('/updateCheckBox/{id}',[CompanyController::class,'updateCheckBox']);


    });

    Route::group(['prefix'=>'notifications','as'=>'notifications'],function(){
        //select all
        Route::get('/{status}',[NotificationController::class,'customAll']);
        //select one
        Route::get('/show/{id}',[NotificationController::class,'show']);
        //create
        Route::post('/',[NotificationController::class,'create']);
        //update
        Route::put('/{id}',[NotificationController::class,'update']);
        //filter
        Route::get('/{status}/filter',[NotificationController::class,'filter']);
        //forceDelete
        Route::delete('/forceDelete/{id}',[NotificationController::class,'forceDelete']);

    });
    Route::group(['prefix'=>'inventoryProducts','as'=>'inventoryProducts'],function(){
        //select all
        Route::get('/{status}',[InventoryProductController::class,'customAll']);
        //select one
        Route::get('/show/{id}',[InventoryProductController::class,'show']);
        //create
        Route::post('/',[InventoryProductController::class,'create']);
        //update
        Route::put('/{id}',[InventoryProductController::class,'update']);
          //forceDelete
          Route::delete('/forceDelete/{id}',[InventoryProductController::class,'forceDelete']);

    });

    Route::group(['prefix'=>'areas','as'=>'areas'],function(){
        //select all
        Route::get('/',[AreaController::class,'all']);
        //select one
        Route::get('/show/{id}',[AreaController::class,'show']);
        //create
        Route::post('/',[AreaController::class,'create']);
        //update
        Route::put('/{id}',[AreaController::class,'update']);
        // soft delete
        Route::delete('/delete/{id}',[AreaController::class,'destroy']);
        Route::get('/archive',[AreaController::class,'archive']);
        Route::post('/restore/{id}',[OfferController::class,'restore']);
        Route::delete('/deleteArchive/{id}',[AreaController::class,'deleteArchive']);
         //search
         Route::get('/search/{key}',[AreaController::class,'search']);

    });

    Route::group(['prefix'=>'workPolicies','as'=>'workPolicies'],function(){
        //select all
        Route::get('/{type}',[WorkPolicieController::class,'all']);
        //select one
        Route::get('/show/{id}',[WorkPolicieController::class,'show']);
        //create
        Route::post('/',[WorkPolicieController::class,'create']);
        //update
        Route::put('/{id}',[WorkPolicieController::class,'update']);
        //soft delete
        Route::delete('/delete/{id}',[WorkPolicieController::class,'destroy']);
        Route::get('/archive',[WorkPolicieController::class,'archive']);
        Route::post('/restore/{id}',[WorkPolicieController::class,'restore']);
        Route::delete('/deleteArchive/{id}',[WorkPolicieController::class,'deleteArchive']);
        //search
        Route::get('/search/{key}',[WorkPolicieController::class,'search']);


    });

});

