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
        Schema::create('sla_policies', function (Blueprint $table) {
            $table->id();

            // Organization
            $table->foreignId('organization_id')
                ->constrained()
                ->cascadeOnDelete();

            // Policy name
            $table->string('name');

            // Ticket priority this SLA applies to
            $table->enum('priority', [
                'Low',
                'Medium',
                'High',
                'Critical'
            ]);

            // Response & resolution times (in minutes)
            $table->integer('response_time');
            $table->integer('resolution_time');

            // Active policy
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->unique(['organization_id', 'priority']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sla_policies');
    }
};