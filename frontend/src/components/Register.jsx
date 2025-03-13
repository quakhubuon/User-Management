import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Kiểm tra mật khẩu khớp
    if (password !== passwordConfirm) {
      setError('Mật khẩu không khớp!');
      return;
    }

    // Kiểm tra độ dài mật khẩu
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
      await axios.post(`${API_BASE_URL}/api/auth/register`, data);
      setMessage('Đăng ký thành công! Vui lòng đăng nhập.');
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirm('');
      setTimeout(() => navigate('/'), 2000); // Chuyển về trang đăng nhập sau 2 giây
    } catch (err) {
      if (err.response && err.response.status === 422) {
        const errors = err.response.data.errors;
        setError(Object.values(errors).flat().join(' '));
      } else {
        setError('Đăng ký thất bại. Vui lòng thử lại!');
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
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl mb-4">Đăng ký</h1>
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
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
          Đăng ký
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="w-full mt-2 bg-gray-500 text-white p-2 rounded"
        >
          Xóa
        </button>
        <p className="mt-2 text-center">
          Đã có tài khoản?{' '}
          <span
            onClick={() => navigate('/')}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Đăng nhập
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;