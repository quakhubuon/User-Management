<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Danh sách quyền (Permissions)
        $permissions = [
            'create user',
            'edit user',
            'delete user',
            'publish user',
            'view user',
            'edit own profile', // Thêm quyền riêng cho user
            'view own profile'  // Thêm quyền riêng cho user
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Tạo vai trò (Roles)
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $editorRole = Role::firstOrCreate(['name' => 'editor']);
        $userRole = Role::firstOrCreate(['name' => 'user']);

        // Gán quyền cho vai trò
        $adminRole->givePermissionTo($permissions); // Admin có tất cả quyền
        $editorRole->givePermissionTo(['create user', 'edit user']); // Editor có quyền quản lý user
        $userRole->givePermissionTo(['view own profile', 'edit own profile']); // User chỉ có quyền với chính mình
    }
}
