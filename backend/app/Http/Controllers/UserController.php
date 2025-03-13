<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('roles')->get();
        return response()->json($users, 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'unique:users'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'confirmed', 'min:8']
        ],[
            'name.required' => 'Phải nhập tên người dùng',
            'name.unique' => 'Tên người dùng đã tồn tại',
            'email.required' => 'Phải nhập địa chỉ email',
            'email.unique' => 'Email đã tồn tại',
            'password.required' => 'Phải nhập mật khẩu',
            'password.confirmed' => 'Mật khẩu không khớp',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự',
        ]);

        if($validator->fails()){
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $user = new User;
        $user->name = request()->name;
        $user->email = request()->email;
        $user->password = bcrypt(request()->password);
        $user->save();
        
        // $user->assignRole($request->roles);

        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::find($id);
        if(empty($user)) {
            return response()->json(['error' => 'Không có người dùng tồn tại'], 400);
        }
        return response()->json($user, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::find($id);

        $validator = Validator::make($request->all(), [
            'name' => ['sometimes'],
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($id, 'id')],
            'password' => ['sometimes', 'confirmed', 'min:8']
        ],[
            'email.unique' => 'Email đã tồn tại',
            'password.confirmed' => 'Mật khẩu không khớp',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user->update($request->all());
        
        return response()->json(['message' => 'Cập nhật user thành công', 'user' => $user], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);
        $user->delete();
        return response()->json($user, 200);
    }
    
    // Xem thông tin cá nhân
    public function profile()
    {
        $user = JWTAuth::parseToken()->authenticate();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'email_verified_at' => $user->email_verified_at,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
            'roles' => $user->getRoleNames() // Lấy danh sách role của user
        ]);
    }


    public function updateProfile(Request $request)
    {
        // Xác thực user từ JWT
        $user = JWTAuth::parseToken()->authenticate();

        // Nếu user là admin và gửi ID khác, thì cập nhật user đó
        if ($user->hasRole('admin') && $request->has('id')) {
            $userToUpdate = User::find($request->id);
            if (!$userToUpdate) {
                return response()->json(['error' => 'User không tồn tại'], 404);
            }
        } else {
            // Nếu không phải admin, chỉ được cập nhật chính bản thân
            if ($request->has('id') && $request->id != $user->id) {
                return response()->json(['error' => 'Bạn không có quyền chỉnh sửa user khác'], 403);
            }
            $userToUpdate = $user;
        }

        // Validate dữ liệu nhập vào
        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users')->ignore($userToUpdate->id)],
            'password' => ['sometimes', 'confirmed', 'min:8'],
        ], [
            'email.unique' => 'Email đã tồn tại',
            'password.confirmed' => 'Mật khẩu không khớp',
            'password.min' => 'Mật khẩu phải có ít nhất 8 ký tự',
        ]);

        // Nếu validation thất bại, trả về lỗi
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Lấy dữ liệu hợp lệ
        $validated = $validator->validated();

        // Nếu có password trong request, mã hóa trước khi cập nhật
        if ($request->filled('password')) {
            $validated['password'] = bcrypt($validated['password']);
        }

        // Cập nhật thông tin user
        $userToUpdate->update($validated);

        return response()->json(['message' => 'Cập nhật user thành công', 'user' => $userToUpdate], 200);
    }

}
