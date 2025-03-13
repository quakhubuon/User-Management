<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\WithFaker;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /** @test */
    public function user_can_register()
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['id', 'name', 'email']);

        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    }

    /** @test */
    public function registration_requires_valid_data()
    {
        $response = $this->postJson('/api/auth/register', []);

        $response->assertStatus(422)
                 ->assertJsonStructure([
                     'message',
                     'errors' => ['name', 'email', 'password']
                 ]);
    }

    /** @test */
    public function user_can_login()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['token', 'token_type', 'expires_in', 'user']);
    }

    /** @test */
    public function user_cannot_login_with_invalid_credentials()
    {
        User::factory()->create(['email' => 'test@example.com']);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
                 ->assertJson(['error' => 'Đăng nhập không thành công']);
    }

    /** @test */
    public function authenticated_user_can_get_profile()
    {
        $user = User::factory()->create();
        $token = JWTAuth::fromUser($user);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->postJson('/api/auth/me');

        $response->assertStatus(200)
                 ->assertJson(['id' => $user->id, 'email' => $user->email]);
    }

    /** @test */
    public function unauthenticated_user_cannot_access_profile()
    {
        $response = $this->postJson('/api/auth/me');

        $response->assertStatus(401);
    }

    /** @test */
    public function user_can_logout()
    {
        $user = User::factory()->create();
        $token = JWTAuth::fromUser($user);

        $response = $this->withHeaders([
            'Authorization' => "Bearer $token",
        ])->postJson('/api/auth/logout');

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Đăng xuất thành công']);
    }
}
