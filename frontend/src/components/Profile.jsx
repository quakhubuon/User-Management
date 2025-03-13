import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
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
      } catch {
        setError('Không thể tải thông tin. Đăng nhập lại!');
        navigate('/');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleEdit = () => {
    navigate('/update'); // Chuyển hướng đến trang chỉnh sửa
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Thông tin cá nhân</h1>
      {error && <p className="text-red-500">{error}</p>}
      {user && (
        <div className="bg-white p-6 rounded shadow-md">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Tên:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Vai trò:</strong> {user.roles.join(', ')}</p>
          <p><strong>Ngày tạo:</strong> {new Date(user.created_at).toLocaleString()}</p>
          <p><strong>Ngày cập nhật:</strong> {new Date(user.updated_at).toLocaleString()}</p>
          <button
            onClick={handleEdit}
            className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Chỉnh sửa
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;