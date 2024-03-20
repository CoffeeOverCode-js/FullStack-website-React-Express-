import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NavBar = ({ loginForm, setLoginForm, homepageData, managementUser, setManagementUser}) => {

  // Hook for navigation
  const navigate = useNavigate();

  // Function to handle the login button click
  const handleLoginClick = () => {
    setLoginForm(true);
  };

  // JSX to render the component
  return ( 
    <div>
      {/* Header section */}
      <header className="header">
        {/* Link to the home page */}
        <Link to="/" className="logo btn btn-link">
          Cool Tech
        </Link>

        {/* Navigation section */}
        <nav className="navbar">
          {/* Conditional rendering based on user role */}
          {homepageData.roleName === "Admin User" ? (
            <button
              className="btn btn-success btn-lg"
              onClick={(e) => {
                e.preventDefault();
                navigate("/admin-dashboard");
              }}
            >
              Admin Dashboard
            </button>
          ) : homepageData.roleName === "Management User" ? (
            // Button for Management User
            <button className="btn btn-warning btn-lg"
            onClick={(e) => {
              e.preventDefault();
              setManagementUser(true)
              navigate("/admin-dashboard")
            }}>Management Dashboard</button>
          ) : null}
          {/* Link to the login page */}
          <Link
            to="/login"
            className="logo btn btn-link"
            onClick={handleLoginClick}
          >
            Login
          </Link>
          {/* Link to the registration page */}
          <Link to="/register" className="logo btn btn-link">
            Register
          </Link>
          {/* Link to more information (adjust as needed) */}
          <Link to="#" className="logo btn btn-link">
            More Info
          </Link>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
