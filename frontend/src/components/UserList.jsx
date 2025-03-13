import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập trước!");
        return;
      }

      try {
        // Lấy thông tin user hiện tại để kiểm tra role
        const profileResponse = await axios.get(
          `${API_BASE_URL}/api/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!profileResponse.data || !profileResponse.data.roles) {
          throw new Error("Dữ liệu không hợp lệ!");
        }

        setCurrentUser(profileResponse.data);

        // Kiểm tra quyền admin
        if (!profileResponse.data.roles.includes("admin")) {
          setError("Bạn không có quyền truy cập trang này!");
          return;
        }

        // Gọi API lấy danh sách user
        const usersResponse = await axios.get(
          `${API_BASE_URL}/api/user`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!usersResponse.data) {
          throw new Error("Không thể tải danh sách người dùng!");
        }

        setUsers(usersResponse.data);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError("Bạn không có quyền truy cập trang này!");
        } else {
          setError(err.message || "Không thể tải dữ liệu. Vui lòng thử lại!");
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (error) {
      alert(error);
      navigate(error.includes("quyền") ? "/profile" : "/");
    }
  }, [error, navigate]);

  // Hàm xử lý xóa user
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Cập nhật danh sách users sau khi xóa thành công
      setUsers(users.filter((user) => user.id !== id));
      alert("Xóa thành công!");
    } catch {
      alert("Không thể xóa người dùng! Vui lòng thử lại.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Danh sách người dùng</h1>
      {error && <p className="text-red-500">{error}</p>}
      {currentUser && users.length > 0 ? (
        <div className="bg-white p-6 rounded shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Tên</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Vai trò</th>
                <th className="p-2 border">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="p-2 border">{user.id}</td>
                  <td className="p-2 border">{user.name}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">
                    {Array.isArray(user.roles) && user.roles.length > 0
                      ? user.roles.map((role) => role.name).join(", ")
                      : "Không có vai trò"}
                  </td>
                  <td className="p-2 border">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                      onClick={() => navigate(`/edit-user/${user.id}`)}
                    >
                      Sửa
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Đang tải danh sách người dùng...</p>
      )}
    </div>
  );
}

export default UserList;
