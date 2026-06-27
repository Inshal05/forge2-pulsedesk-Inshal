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
        Schema::create('ticket_comments', function (Blueprint $table) {
            $table->id();

            // Related ticket
            $table->foreignId('ticket_id')
                ->constrained()
                ->cascadeOnDelete();

            // Comment author
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            // Comment content
            $table->text('comment');

            // Internal notes are visible only to agents/admins
            $table->boolean('is_internal')->default(false);

            // Optional attachment path
            $table->string('attachment')->nullable();

            $table->timestamps();

            $table->index('ticket_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticket_comments');
    }
};