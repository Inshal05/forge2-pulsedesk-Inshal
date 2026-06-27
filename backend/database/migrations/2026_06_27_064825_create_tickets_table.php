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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();

            // Organization
            $table->foreignId('organization_id')
                ->constrained()
                ->cascadeOnDelete();

            // Ticket creator (customer)
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            // Assigned support agent
            $table->foreignId('assigned_to')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            // Basic ticket information
            $table->string('ticket_number')->unique();
            $table->string('title');
            $table->text('description');

            // Category
            $table->string('category')->default('General');

            // Priority
            $table->enum('priority', [
                'Low',
                'Medium',
                'High',
                'Critical'
            ])->default('Medium');

            // Status
            $table->enum('status', [
                'Open',
                'In Progress',
                'Resolved',
                'Closed'
            ])->default('Open');

            // SLA
            $table->timestamp('due_at')->nullable();

            // Resolution
            $table->timestamp('resolved_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['organization_id', 'status']);
            $table->index(['assigned_to']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};