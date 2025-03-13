import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl">Trang Quản Trị</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
      >
        Đăng xuất
      </button>
    </div>
  );
}

export default Header;