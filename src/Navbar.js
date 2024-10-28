import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isAuthenticated, onLogout, username, onLoggingout, user, isEmpauthenticate, setUser, setEmpUser, setRacfId, activePortal, setActivePortal }) => {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setShowOptions(true);
  };

  const handleMouseLeave = () => {
    setShowOptions(false);
  };

  const handlePortalChange = (portal) => {
    setActivePortal(portal);
    if (portal === "admin") {
      navigate("/login");
    } else if (portal === "user") {
      navigate("/user-login");
    }
  };

  const handleLogoClick = () => {
    setActivePortal(null);
    setUser(null);
    setEmpUser(null);
    setRacfId("");
    localStorage.clear();
    navigate("/");
  };

  const handleLogoutClick = () => {
    if (activePortal === "admin") {
      handleLogout();
    } else if (activePortal === "user") {
      handleUserLogout();
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
    setActivePortal(null);
    navigate("/login");
  };

  const handleUserLogout = () => {
    setEmpUser(null);
    setRacfId("");
    localStorage.clear();
    setActivePortal(null);
    navigate("/user-login");
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={handleLogoClick} title="Show admin/employee portal button">
        <img src={process.env.PUBLIC_URL + "/image.png"} alt="Logo" />
      </div>
      {!activePortal && (
        <ul className="portal-selector">
          <li title="Go to admin Login">
            <button
              className={activePortal === "admin" ? "active" : ""}
              onClick={() => handlePortalChange("admin")}
            >
              Admin Portal
            </button>
          </li>
          <li title="Go to Employee Login">
            <button
              className={activePortal === "user" ? "active" : ""}
              onClick={() => handlePortalChange("user")}
            >
              User Portal
            </button>
          </li>
        </ul>
      )}
      {activePortal && (
        <ul className="nav-links">
          {activePortal === "admin" ? (
            isAuthenticated ? (
              <>
                <li title="Admin dashboard">
                  <Link to="/admin-Home">Home</Link>
                </li>
                <li>
                  <Link to="/master-data">Show Data</Link>
                </li>
                <li>
                  <Link to="/Details">Details table</Link>
                </li>
                {/* <li title="Monthly data of all employees">
                  <Link to="/monthly-data">Monthly Data</Link>
                </li> */}
                {/* <li title="Leave data of all employees">
                  <Link to="/leave-details">Leave Details</Link>
                </li> */}
                {/* <li title="Entry/exit data of all employees">
                  <Link to="/entry-exit-data">Entry/Exit Data</Link>
                </li> */}
                {/* <li title="Utilization of all employees">
                  <Link to="/utilization">Utilization</Link>
                </li> */}
                {/* <li title="Upload data">
                  <Link to="/data-upload">Update Data</Link>
                </li>  */}
                <li
                  className="dropdown"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <span className="dropdown-toggle">Welcome, {username}!</span>
                  <ul className="dropdown-menu" style={{ display: showOptions ? "block" : "none" }}>
                    {/* <li title="Yearly holidays">
                      <Link to="/holiday-calender">Holidays Calendar</Link>
                    </li>
                    <li title="">
                        <Link to="/Send-data">Send Data</Link>
                    </li> */}
                    <li title="Logout">
                      <div onClick={handleLogoutClick}>Logout</div>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li title="Admin login dashboard">
                  <Link to="/login">Login</Link>
                </li>
              </>
            )
          ) : (
            isEmpauthenticate ? (
              <>
                <li title="User dashboard">
                  <Link to="/user-Home">Home</Link>
                </li>
                {/* <li title="Show yearly holidays">
                  <Link to="/user-holidays">Holidays</Link>
                </li> */}
                <li
                  className="dropdown"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <span className="dropdown-toggle">Welcome, {user}!</span>
                  <ul className="dropdown-menu" style={{ display: showOptions ? "block" : "none" }}>
                    {/* <li title="Employee details">
                      <Link to="/employee-profile">Profile</Link>
                    </li> */}
                    <li title="Logout">
                      <div onClick={handleLogoutClick}>Logout</div>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <li title="User login">
                <Link to="/user-login">Login</Link>
              </li>
            )
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
