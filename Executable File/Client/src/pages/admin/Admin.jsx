import React, { useEffect, useState } from 'react';
import '../../styles/Admin.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Admin = () => {
  const navigate = useNavigate();

  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [banner, setBanner] = useState('');

  // Redirect if not admin
  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  // Fetch counts on mount
  useEffect(() => {
    fetchCountData();
  }, []);

  const fetchCountData = async () => {
    try {
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        axios.get('http://localhost:6001/fetch-users'),
        axios.get('http://localhost:6001/fetch-products'),
        axios.get('http://localhost:6001/fetch-orders'),
      ]);
      setUserCount(usersRes.data.length - 1); // ignoring admin
      setProductCount(productsRes.data.length);
      setOrdersCount(ordersRes.data.length);
    } catch (err) {
      console.error('Error fetching counts:', err);
    }
  };

  const updateBanner = async () => {
    try {
      await axios.post('http://localhost:6001/update-banner', { banner });
      alert('Banner updated');
      setBanner('');
    } catch (err) {
      alert('Failed to update banner');
      console.error(err);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-home-card">
        <h5>Total users</h5>
        <p>{userCount}</p>
        <button onClick={() => navigate('/all-users')}>View all</button>
      </div>

      <div className="admin-home-card">
        <h5>All Products</h5>
        <p>{productCount}</p>
        <button onClick={() => navigate('/all-products')}>View all</button>
      </div>

      <div className="admin-home-card">
        <h5>All Orders</h5>
        <p>{ordersCount}</p>
        <button onClick={() => navigate('/all-orders')}>View all</button>
      </div>

      <div className="admin-home-card">
        <h5>Add Product</h5>
        <p>(new)</p>
        <button onClick={() => navigate('/new-product')}>Add now</button>
      </div>

      <div className="admin-banner-input admin-home-card">
        <h5>Update banner</h5>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="floatingURLInput"
            placeholder="Enter banner URL"
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
          />
          <label htmlFor="floatingURLInput">Banner URL</label>
        </div>
        <button onClick={updateBanner}>Update</button>
      </div>
    </div>
  );
};

export default Admin;
