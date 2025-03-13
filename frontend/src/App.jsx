import './App.css'
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Update from './components/Update';
import AdminPanel from './components/AdminPanel';
import Profile from './components/Profile';
import UserList from './components/UserList';
import Register from './components/Register';
import CreateUser from './components/CreateUser';
import EditUser from './components/EditUser';

function App() {
  return (
    <Routes>
      {/* Trang đăng nhập */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Trang quản trị với layout */}
      <Route path="/" element={<AdminPanel />}>
        <Route path="profile" element={<Profile />} />
        <Route path="update" element={<Update />} />
        <Route path="users" element={<UserList />} />
        <Route path="create-user" element={<CreateUser />} />
        <Route path="edit-user/:id" element={<EditUser />} />
        {/* Route /users sẽ thêm sau */}
      </Route>
    </Routes>
  );
}

export default App;
