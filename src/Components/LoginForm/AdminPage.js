import React from "react";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session data
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <h2>Welcome to the Admin Page</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminPage;
