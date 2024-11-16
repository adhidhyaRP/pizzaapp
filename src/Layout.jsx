import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './Layout.css' 

const Layout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("authorized");
    navigate('/login');
  };

  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <h1>Pizza doc</h1>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">Combo Offers</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/Pizzas">Pizzas</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Dessert">Desserts</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Drink">Drinks</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/addtobucket">Add to Bucket</Link>
              </li>
            </ul>
            <button
              className="btn custom-logout-btn"
              onClick={logout}
            >
              LOGOUT
            </button>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default Layout;
