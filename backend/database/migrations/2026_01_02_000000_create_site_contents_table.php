<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('site_contents', function (Blueprint $table) {
            $table->id();
            $table->string('section');
            $table->string('content_key');
            $table->text('content_value'); // text to allow larger JSON strings
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->unique(['section', 'content_key']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('site_contents');
    }
};
