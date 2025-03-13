<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // Tạo tài khoản Admin mẫu
        $admin = User::create([
        'name' => 'Admin User',
        'email' => 'admin@example.com',
        'password' => bcrypt('12345678'), // Mật khẩu mặc định
        ]);
        $admin->assignRole('admin'); // Gán role admin

        // Tạo tài khoản User thường mẫu
        $user = User::create([
            'name' => 'Normal User',
            'email' => 'user@example.com',
            'password' => bcrypt('12345678'),
        ]);
        $user->assignRole('user'); // Gán role user
    }
}
