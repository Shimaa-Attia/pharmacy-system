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
        Schema::create('selling_incentives', function (Blueprint $table) {
            //composition  //reason  //incentivesPercentatge //notes //usage //name
            $table->id();
            $table->string('productName');
            $table->text('usage')->nullable();
            $table->text('composition')->nullable();
            $table->decimal("incentivesPercentatge", 4, 2)->default(0.0);
            $table->text('notes')->nullable();
            $table->bigInteger('incentiveReason_id',false,true)->nullable();
            $table->foreign('incentiveReason_id')->references('id')->on('custom_properties')->onDelete('SET NULL')->onUpdate('CASCADE');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('selling_incentives');
    }
};
