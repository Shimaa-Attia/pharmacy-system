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
        Schema::create('area_customer', function (Blueprint $table) {
            $table->bigInteger('customer_id',false,true);
            $table->bigInteger('area_id',false,true);
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('CASCADE')->onUpdate('CASCADE');
            $table->foreign('area_id')->references('id')->on('areas')->onDelete('CASCADE')->onUpdate('CASCADE');
            $table->primary(['customer_id','area_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('area_customer');
    }
};
