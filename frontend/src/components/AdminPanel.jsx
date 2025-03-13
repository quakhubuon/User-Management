import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

function AdminPanel() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-4 bg-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;