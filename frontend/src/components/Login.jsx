import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      setMessage('Đăng nhập thành công!');
      localStorage.setItem('token', response.data.token);
      navigate('/profile');
    } catch {
      setMessage('Đăng nhập thất bại. Kiểm tra email hoặc mật khẩu.');
    }
  };

  const handleClear = () => {
    setEmail('');
    setPassword('');
    setMessage('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl mb-4">Đăng nhập</h1>
        {message && (
          <p className={message.includes('thành công') ? 'text-green-500' : 'text-red-500'}>
            {message}
          </p>
        )}
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
          <label className="block text-gray-700">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Nhập mật khẩu"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Đăng nhập
        </button>
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="w-full mt-2 bg-gray-500 text-white p-2 rounded"
        >
          Đăng ký
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="w-full mt-2 bg-gray-500 text-white p-2 rounded"
        >
          Xóa
        </button>
      </form>
    </div>
  );
}

export default Login;