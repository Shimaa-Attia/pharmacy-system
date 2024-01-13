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
        Schema::table('shortcomings', function (Blueprint $table) {
            //productName - productImage - clientInfo - creator_userId - updator_userId
            //- isAvailable_inOtherbranch  - productType - notes -status
            // $table->id();
            $table->string('productName');
            $table->string('productImage',255)->nullable();
            $table->string('clientInfo');
            $table->bigInteger('creator_userId',false,true)->nullable();
            $table->bigInteger('lastUpdater_userId',false,true)->nullable();
            $table->boolean('isAvailable_inOtherBranch')->default(false);
            $table->enum('productType', ['أدوية', 'براندات', 'كوزمو', 'تركيبات']);
            $table->bigInteger('status_id',false,true)->nullable();
            // $table->timestamps();
            // $table->softDeletes();
            $table->foreign('creator_userId')->references('id')->on('users')->onDelete('SET NULL')->onUpdate('CASCADE');
            $table->foreign('lastUpdater_userId')->references('id')->on('users')->onDelete('SET NULL')->onUpdate('CASCADE');
            $table->foreign('status_id')->references('id')->on('custom_properties')->onDelete('SET NULL')->onUpdate('CASCADE');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shortcomings');
    }
};
