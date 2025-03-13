import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

function CreateUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const hasCheckedAdmin = useRef(false); // Dùng để kiểm tra chỉ chạy 1 lần

  useEffect(() => {
    const checkAdmin = async () => {
      if (hasCheckedAdmin.current) return;
      hasCheckedAdmin.current = true; // Đánh dấu đã chạy

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vui lòng đăng nhập trước!');
        navigate('/');
        return;
      }

      try {
        const profileResponse = await axios.get(`${API_BASE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!profileResponse.data || !profileResponse.data.roles) {
          throw new Error('Dữ liệu không hợp lệ!');
        }

        setCurrentUser(profileResponse.data);

        // Kiểm tra role admin
        if (!profileResponse.data.roles.includes('admin')) {
          alert('Bạn không có quyền truy cập trang này!');
          navigate('/profile');
        }
      } catch (err) {
        console.error('Error during admin check:', err);
        alert('Không thể xác thực. Vui lòng đăng nhập lại!');
        navigate('/');
      }
    };

    checkAdmin();
  }, [navigate]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== passwordConfirm) {
      setError('Mật khẩu không khớp!');
      return;
    }

    if (password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự!');
      return;
    }

    const data = {
      name,
      email,
      password,
      password_confirmation: passwordConfirm,
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/user`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Tạo user thành công!');
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirm('');
      setTimeout(() => navigate('/users'), 2000);
    } catch (err) {
      console.log('Lỗi từ server:', err.response?.data);
      if (err.response && (err.response.status === 422 || err.response.status === 400)) {
        const errors = err.response.data.errors;
        setError(Object.values(errors).flat().join(' '));
      } else if (err.response && err.response.status === 403) {
        alert('Bạn không có quyền tạo user!');
        navigate('/profile');
      } else {
        setError('Tạo user thất bại. Vui lòng thử lại!');
      }
    }
  };

  const handleClear = () => {
    setName('');
    setEmail('');
    setPassword('');
    setPasswordConfirm('');
    setMessage('');
    setError('');
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Tạo người dùng mới</h1>
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
      {currentUser && (
        <form onSubmit={handleCreateUser} className="bg-white p-6 rounded shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700">Tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Nhập tên"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Nhập email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Xác nhận mật khẩu</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Nhập lại mật khẩu"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Tạo mới
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="w-full mt-2 bg-gray-500 text-white p-2 rounded"
          >
            Xóa
          </button>
        </form>
      )}
    </div>
  );
}

export default CreateUser;
