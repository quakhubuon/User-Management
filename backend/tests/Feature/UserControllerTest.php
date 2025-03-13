<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Spatie\Permission\Models\Role;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $user;
    protected $adminToken;
    protected $userToken;

    public function setUp(): void
    {
        parent::setUp();

        // Tạo role
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'user']);

        // Tạo admin user
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');
        $this->adminToken = JWTAuth::fromUser($this->admin);

        // Tạo regular user
        $this->user = User::factory()->create();
        $this->user->assignRole('user');
        $this->userToken = JWTAuth::fromUser($this->user);
    }

    /** @test */
    public function admin_can_get_all_users()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
        ])->getJson('/api/user');

        $response->assertStatus(200)
                 ->assertJsonStructure([['id', 'name', 'email', 'roles']]);
    }

    /** @test */
    public function non_admin_cannot_get_all_users()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->userToken,
        ])->getJson('/api/user');

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_create_user()
    {
        $data = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
        ])->postJson('/api/user', $data);

        $response->assertStatus(201)
                 ->assertJsonFragment(['name' => 'Test User']);
        
        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    }

    /** @test */
    public function store_validation_fails_with_invalid_data()
    {
        $data = [
            'name' => '', // required
            'email' => 'invalid-email', // invalid email
            'password' => 'short', // too short
            'password_confirmation' => 'different' // not matching
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
        ])->postJson('/api/user', $data);

        $response->assertStatus(400)
                 ->assertJsonStructure(['errors']);
    }

    /** @test */
    public function admin_can_show_user()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
        ])->getJson('/api/user/' . $this->user->id);

        $response->assertStatus(200)
                 ->assertJsonFragment(['id' => $this->user->id]);
    }

    /** @test */
    public function show_returns_error_for_nonexistent_user()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
        ])->getJson('/api/user/999');

        $response->assertStatus(400)
                 ->assertJson(['error' => 'Không có người dùng tồn tại']);
    }

    /** @test */
    public function admin_can_update_user()
    {
        $data = [
            'name' => 'Updated Name',
            'email' => 'updated@example.com'
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
        ])->putJson('/api/user/' . $this->user->id, $data);

        $response->assertStatus(200)
                 ->assertJsonFragment(['message' => 'Cập nhật user thành công']);
        
        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'name' => 'Updated Name'
        ]);
    }

    /** @test */
    public function admin_can_delete_user()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
        ])->deleteJson('/api/user/' . $this->user->id);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('users', ['id' => $this->user->id]);
    }

    /** @test */
    public function user_can_view_profile()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->userToken,
        ])->getJson('/api/profile');

        $response->assertStatus(200)
                 ->assertJsonFragment(['id' => $this->user->id]);
    }

    /** @test */
    public function user_can_update_own_profile()
    {
        $data = [
            'name' => 'New Name'
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->userToken,
        ])->putJson('/api/profile', $data);

        $response->assertStatus(200)
                 ->assertJsonFragment(['message' => 'Cập nhật user thành công']);
        
        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'name' => 'New Name'
        ]);
    }

    /** @test */
    public function non_admin_cannot_update_other_user_profile()
    {
        $data = [
            'id' => $this->admin->id,
            'name' => 'New Name'
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->userToken,
        ])->putJson('/api/profile', $data);

        $response->assertStatus(403)
                 ->assertJson(['error' => 'Bạn không có quyền chỉnh sửa user khác']);
    }

    /** @test */
    public function admin_can_update_other_user_profile()
    {
        $data = [
            'id' => $this->user->id,
            'name' => 'Admin Updated Name'
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->adminToken,
        ])->putJson('/api/profile', $data);

        $response->assertStatus(200)
                 ->assertJsonFragment(['message' => 'Cập nhật user thành công']);
        
        $this->assertDatabaseHas('users', [
            'id' => $this->user->id,
            'name' => 'Admin Updated Name'
        ]);
    }
}