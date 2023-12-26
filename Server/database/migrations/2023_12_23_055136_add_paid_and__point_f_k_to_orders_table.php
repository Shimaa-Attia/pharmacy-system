<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal("paid", 6, 2)->after('totalAmmount')->default('0.00');
            $table->bigInteger('sale_point_id',false,true)->after('customer_address');

            $table->foreign('sale_point_id')->references('id')->on('sale_points');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            Schema::dropColumns('paid');
        });
    }
};
