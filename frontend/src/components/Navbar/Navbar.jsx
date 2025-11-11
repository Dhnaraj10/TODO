import React from 'react';
import './Navbar.css';
import { FaBookSkull } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <FaBookSkull className="logo-icon" />
          <b>TODO</b>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
          aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
          <ul className="navbar-nav gap-3 align-items-center">
            <li className="nav-item">
              <Link to="/about" className="nav-btn">About Us</Link>
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-btn">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/todo" className="nav-btn">Todo</Link>
            </li>

            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link to="/signin" className="nav-btn">Sign In</Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="nav-btn">Sign Up</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/logout" className="nav-btn">Logout</Link>
                </li>
              </>
            )}

            {isLoggedIn && (
              <li className="nav-item">
                <Link to="/profile">
                  <img
                    className="user-icon"
                    src="https://static.vecteezy.com/system/resources/previews/005/005/788/non_2x/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg"
                    alt="user"
                  />
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;