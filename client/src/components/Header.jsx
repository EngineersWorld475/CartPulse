import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const Header = () => {
  return (
    <>
      {/* Top Strip */}
      <header className="header-top-strip py-2 bg-dark text-light">
        <div className="container">
          <div className="row">
            <div className="col-12 d-flex justify-content-between">
              <p className="mb-0">Free shipping over $100 & Free returns</p>
              <p className="mb-0 d-none d-md-block">
                Hotline: (777) 43433-4545-646 544-465 8193
              </p>
            </div>
            <div className="col-12 d-block d-md-none text-center mt-2">
              <p className="mb-0">Hotline: (777) 43433-4545-646 544-465 8193</p>
            </div>
          </div>
        </div>
      </header>

      {/* Upper Header */}
      <header className="header-upper py-3">
        <div className="container-xxl">
          <div className="row align-items-center">
            {/* Logo or Cart */}
            <div className="col-12 col-md-2 d-flex align-items-center mb-3 mb-md-0">
              <h1 className="fs-4 mb-0">
                <Link
                  to="/"
                  className="cartpulse d-flex align-items-center text-decoration-none"
                >
                  <span className="cartpulse-text">Cart</span>
                  <span className="cartpulse-logo">pulse.</span>
                </Link>
              </h1>
            </div>

            {/* Search Bar */}
            <div className="col-12 col-md-5 mb-3 mb-md-0">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search product here"
                  aria-label="Search product here"
                />
                <button className="btn btn-outline-secondary" type="button">
                  <FaSearch />
                </button>
              </div>
            </div>

            {/* Header Links */}
            <div className="col-12 col-md-5 d-flex justify-content-around flex-wrap gap-3">
              <Link
                to="/compare"
                className="d-flex flex-row align-items-center text-decoration-none text-white"
              >
                <img
                  src="images/compare.svg"
                  alt="Compare Products"
                  className="me-2"
                  style={{ width: '34px', height: '34px' }}
                />
                <p className="text-center mb-0 fs-6">
                  Compare
                  <br />
                  Products
                </p>
              </Link>
              <Link
                to="/wishlist"
                className="d-flex flex-row align-items-center text-decoration-none text-white"
              >
                <img
                  src="images/wishlist.svg"
                  alt="Wishlist"
                  className="me-2"
                  style={{ width: '34px', height: '34px' }}
                />
                <p className="text-center mb-0 fs-6">
                  Favourite
                  <br />
                  Wishlist
                </p>
              </Link>
              <Link
                to="/account"
                className="d-flex flex-row align-items-center text-decoration-none text-white"
              >
                <img
                  src="images/user.svg"
                  alt="My Account"
                  className="me-2"
                  style={{ width: '34px', height: '34px' }}
                />
                <p className="text-center mb-0 fs-6">
                  Login
                  <br />
                  My Account
                </p>
              </Link>
              <Link
                to="/cart"
                className="d-flex flex-row align-items-center text-decoration-none text-white"
              >
                <img
                  src="images/cart.svg"
                  alt="Cart"
                  className="me-2"
                  style={{ width: '34px', height: '34px' }}
                />
                <div className="d-flex flex-column align-items-center">
                  <span className="badge bg-light text-dark">0</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Header */}
      <header className="header-bottom">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="menu-bottom d-flex align-items-center">
                {/* Dropdown */}
                <div className="dropdown me-3">
                  <img
                    src="/images/menu.svg"
                    style={{ width: '14px', height: '14px' }}
                    alt="Menu Icon"
                  />
                  <button
                    className="btn dropdown-toggle text-white"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Shop Categories
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <li>
                      <Link className="dropdown-item" to="">
                        Action
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" href="#">
                        Another action
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" href="#">
                        Something else here
                      </Link>
                    </li>
                  </ul>
                </div>
                {/* Navlinks */}
                <div className="menu-links">
                  <div className="d-flex align-items-center gap-3 py-2">
                    <NavLink className="text-white" to="/">
                      Home
                    </NavLink>
                    <NavLink className="text-white" to="/">
                      Our Store
                    </NavLink>
                    <NavLink className="text-white" to="/">
                      Blogs
                    </NavLink>
                    <NavLink className="text-white" to="/contact">
                      Contact
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
