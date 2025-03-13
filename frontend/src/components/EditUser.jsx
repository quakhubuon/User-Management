import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../config';

function UpdateUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const checkAdminAndFetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập trước!');
        return;
      }

      try {
        // Kiểm tra role admin
        const profileResponse = await axios.get(`${API_BASE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!profileResponse.data || !profileResponse.data.roles) {
          throw new Error('Dữ liệu profile không hợp lệ!');
        }

        if (!profileResponse.data.roles.includes("admin")) {
          setError('Bạn không có quyền truy cập trang này!');
          navigate('/profile');
          return;
        }

        setCurrentUser(profileResponse.data);

        // Lấy thông tin user cần cập nhật
        const userResponse = await axios.get(`${API_BASE_URL}/api/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(userResponse.data.name);
        setEmail(userResponse.data.email);
      } catch (err) {
        console.log('Lỗi khi kiểm tra hoặc tải user:', err.response?.data || err.message);
        setError(
          err.response?.status === 403
            ? 'Bạn không có quyền truy cập!'
            : err.response?.status === 404
            ? 'Không tìm thấy user!'
            : 'Không thể tải dữ liệu user!'
        );
      }
    };

    checkAdminAndFetchUser();
  }, [id, navigate]);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password && password !== passwordConfirm) {
      setError('Mật khẩu không khớp!');
      return;
    }

    if (password && password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự!');
      return;
    }

    const data = {
      name,
      email,
    };
    if (password) {
      data.password = password;
      data.password_confirmation = passwordConfirm;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/user/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Cập nhật user thành công!');
      setPassword('');
      setPasswordConfirm('');
      setTimeout(() => navigate('/users'), 2000);
    } catch (err) {
      console.log('Lỗi từ server:', err.response?.data);
      if (err.response && (err.response.status === 422 || err.response.status === 400)) {
        const errors = JSON.parse(err.response.data); // Controller trả về JSON string
        setError(Object.values(errors).flat().join(' '));
      } else if (err.response && err.response.status === 403) {
        setError('Bạn không có quyền cập nhật user!');
        navigate('/profile');
      } else {
        setError('Cập nhật user thất bại. Vui lòng thử lại!');
      }
    }
  };

  const handleClear = () => {
    setPassword('');
    setPasswordConfirm('');
    setMessage('');
    setError('');
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Cập nhật người dùng</h1>
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
      {currentUser && (
        <form onSubmit={handleUpdateUser} className="bg-white p-6 rounded shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700">Tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Nhập tên"
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
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mật khẩu mới (để trống nếu không đổi)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Nhập mật khẩu mới"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Cập nhật
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="w-full mt-2 bg-gray-500 text-white p-2 rounded"
          >
            Xóa mật khẩu
          </button>
        </form>
      )}
    </div>
  );
}

export default UpdateUser;