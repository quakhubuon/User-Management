import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="bg-gray-800 text-white w-64 h-screen p-4">
      <h2 className="text-lg mb-4">Menu</h2>
      <ul>
        <li className="mb-2">
          <Link to="/profile" className="hover:text-gray-300">Thông tin cá nhân</Link>
        </li>
        <li className="mb-2">
          <Link to="/users" className="hover:text-gray-300">Danh sách người dùng</Link>
        </li>
        <li className="mb-2">
          <Link to="/create-user" className="hover:text-gray-300">Tạo người dùng mới</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;