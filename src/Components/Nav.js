import React from 'react'
import { Link, useNavigate } from "react-router-dom";


function Nav() {
  const navigate = useNavigate();

  const handleLogout = () => {

    navigate("/");
  };
  return (
    <div>
      <nav className="navbar">
        <h1>Shipment</h1>
        <ul className="listitem">
        <li>
            <Link className="navitems" to="/admin-page/view">List Shipment</Link>
          </li>
          <li>
            <Link className="navitems" to="/admin-page/create">Create Shipment</Link>
          </li>
          <li>
            <button className="navitems" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Nav;



