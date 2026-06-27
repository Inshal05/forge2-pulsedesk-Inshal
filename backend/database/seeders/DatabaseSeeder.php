<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::create([
            'name' => 'Acme Inc',
            'slug' => 'acme-inc',
            'domain' => null,
            'plan' => 'free',
            'is_active' => true,
            'settings' => [],
        ]);

        User::create([
            'organization_id' => $organization->id,
            'name' => 'Admin User',
            'email' => 'admin@acme.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        User::create([
            'organization_id' => $organization->id,
            'name' => 'Agent User',
            'email' => 'agent@acme.test',
            'password' => Hash::make('password'),
            'role' => 'agent',
            'is_active' => true,
        ]);

        User::create([
            'organization_id' => $organization->id,
            'name' => 'Customer User',
            'email' => 'customer@acme.test',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'is_active' => true,
        ]);
    }
}