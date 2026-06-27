<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\LoginRequest;
use App\Http\Requests\Api\V1\RegisterRequest;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = DB::transaction(function () use ($validated) {

            $organization = Organization::create([
                'name'      => $validated['organization_name'],
                'slug'      => str()->slug($validated['organization_name']),
                'plan'      => 'free',
                'is_active' => true,
                'settings'  => [],
            ]);

            return User::create([
                'organization_id' => $organization->id,
                'name'            => $validated['name'],
                'email'           => $validated['email'],
                'password'        => $validated['password'],
                'role'            => 'owner',
                'phone'           => $validated['phone'] ?? null,
                'avatar'          => $validated['avatar'] ?? null,
                'is_active'       => true,
            ]);
        });

        $token = $user->createToken('auth-token')->plainTextToken;

        $user->load('organization');

        return response()->json([
            'message' => 'Registration successful.',
            'user'    => $user,
            'token'   => $token,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Account is deactivated.',
            ], 403);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'user'    => $user,
            'token'   => $token,
        ]);
    }
}