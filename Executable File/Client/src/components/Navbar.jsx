import React, { useContext, useEffect, useState } from 'react';
import { BsCart3, BsPersonCircle } from 'react-icons/bs';
import { FcSearch } from 'react-icons/fc';
import { ImCancelCircle } from 'react-icons/im';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Navbar.css';
import { GeneralContext } from '../context/GeneralContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount, logout } = useContext(GeneralContext);

  const usertype = localStorage.getItem('userType');
  const username = localStorage.getItem('username');

  const [productSearch, setProductSearch] = useState('');
  const [noResult, setNoResult] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:6001/fetch-categories')
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  const handleSearch = () => {
    if (categories.includes(productSearch)) {
      navigate(`/category/${productSearch}`);
    } else {
      setNoResult(true);
    }
  };

  const SearchBar = () => (
    <div className="nav-search">
      <input
        type="text"
        placeholder="Search Electronics, Fashion, mobiles, etc."
        onChange={(e) => setProductSearch(e.target.value)}
      />
      <FcSearch className="nav-search-icon" onClick={handleSearch} />
      {noResult && (
        <div className="search-result-data">
          No items found... try searching for Electronics, mobiles, Groceries, etc.
          <ImCancelCircle
            className="search-result-data-close-btn"
            onClick={() => setNoResult(false)}
          />
        </div>
      )}
    </div>
  );

  const GuestNavbar = () => (
    <div className="navbar">
      <h3 onClick={() => navigate('/')}>ShopEZ</h3>
      <div className="nav-content">
        <SearchBar />
        <button className="btn" onClick={() => navigate('/auth')}>Login</button>
      </div>
    </div>
  );

  const CustomerNavbar = () => (
    <div className="navbar">
      <h3 onClick={() => navigate('/')}>ShopEZ</h3>
      <div className="nav-content">
        <SearchBar />
        <div className="nav-content-icons">
          <div className="nav-profile" onClick={() => navigate('/profile')}>
            <BsPersonCircle className="navbar-icons" title="Profile" />
            <p>{username}</p>
          </div>
          <div className="nav-cart" onClick={() => navigate('/cart')}>
            <BsCart3 className="navbar-icons" title="Cart" />
            <div className="cart-count">{cartCount}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const AdminNavbar = () => (
    <div className="navbar-admin">
      <h3 onClick={() => navigate('/admin')}>ShopEZ (admin)</h3>
      <ul>
        <li onClick={() => navigate('/admin')}>Home</li>
        <li onClick={() => navigate('/all-users')}>Users</li>
        <li onClick={() => navigate('/all-orders')}>Orders</li>
        <li onClick={() => navigate('/all-products')}>Products</li>
        <li onClick={() => navigate('/new-product')}>New Product</li>
        <li onClick={logout}>Logout</li>
      </ul>
    </div>
  );

  return (
    <>
      {!usertype && <GuestNavbar />}
      {usertype === 'customer' && <CustomerNavbar />}
      {usertype === 'admin' && <AdminNavbar />}
    </>
  );
};

export default Navbar;
