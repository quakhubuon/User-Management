import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

function Update() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpdate = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập trước!');
        navigate('/');
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setName(response.data.name);
        setEmail(response.data.email);
      } catch {
        setError('Không thể tải thông tin. Đăng nhập lại!');
        navigate('/');
      }
    };

    fetchUpdate();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Kiểm tra mật khẩu trước khi gửi
    if (password) {
      if (password.length < 8) {
        setError('Mật khẩu phải có ít nhất 8 ký tự!');
        return;
      }
      if (password !== passwordConfirm) {
        setError('Mật khẩu không khớp!');
        return;
      }
    }

    const token = localStorage.getItem('token');
    const data = { name, email };
    if (password) {
      data.password = password;
      data.password_confirmation = passwordConfirm;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/api/profile`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Cập nhật thành công!');
      setUser(response.data.user || response.data);
      setPassword('');
      setPasswordConfirm('');
    } catch (err) {
      // Xử lý lỗi 422 chi tiết
      if (err.response && err.response.status === 422) {
        const errors = err.response.data.errors;
        setError(Object.values(errors).flat().join(' ')); // Ghép các lỗi thành chuỗi
      } else {
        setError('Cập nhật thất bại. Kiểm tra lại dữ liệu!');
      }
      console.log('Lỗi từ server:', err.response?.data);
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Thông tin cá nhân</h1>
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}
      {user && (
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-gray-700">Tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mật khẩu mới (nếu muốn đổi)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Để trống nếu không đổi"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Nhập lại mật khẩu mới</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Để trống nếu không đổi"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Cập nhật
          </button>
        </form>
      )}
    </div>
  );
}

export default Update;