import React, { useContext, useEffect, useState } from 'react';
import '../../styles/Profile.css';
import { GeneralContext } from '../../context/GeneralContext';
import axios from 'axios';

const Profile = () => {
  const { logout } = useContext(GeneralContext);

  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:6001/fetch-orders');
      const userOrders = res.data
        .filter((order) => order.userId === userId)
        .reverse();
      setOrders(userOrders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const cancelOrder = async (id) => {
    try {
      await axios.put('http://localhost:6001/cancel-order', { id });
      alert('Order cancelled!');
      fetchOrders();
    } catch (err) {
      alert('Order cancellation failed!');
      console.error(err);
    }
  };

  return (
    <div className="profilePage">
      {/* User Info */}
      <div className="profileCard">
        <span>
          <h5>Username:</h5>
          <p>{username}</p>
        </span>
        <span>
          <h5>Email:</h5>
          <p>{email}</p>
        </span>
        <span>
          <h5>Orders:</h5>
          <p>{orders.length}</p>
        </span>
        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Orders */}
      <div className="profileOrders-container">
        <h3>Orders</h3>
        <div className="profileOrders">
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map((order) => (
              <div className="profileOrder" key={order._id}>
                <img src={order.mainImg} alt={order.title} />
                <div className="profileOrder-data">
                  <h4>{order.title}</h4>
                  <p>{order.description}</p>

                  <div>
                    <p><b>Size:</b> {order.size}</p>
                    <p><b>Quantity:</b> {order.quantity}</p>
                    <p>
                      <b>Price:</b> ₹{parseInt(order.price - (order.price * order.discount) / 100) * order.quantity}
                    </p>
                    <p><b>Payment:</b> {order.paymentMethod}</p>
                  </div>

                  <div>
                    <p><b>Address:</b> {order.address}</p>
                    <p><b>Pincode:</b> {order.pincode}</p>
                    <p><b>Ordered On:</b> {order.orderDate.slice(0, 10)}</p>
                  </div>

                  <div>
                    <p><b>Status:</b> {order.orderStatus}</p>
                    {(order.orderStatus === 'order placed' || order.orderStatus === 'In-transit') && (
                      <button className="btn btn-danger" onClick={() => cancelOrder(order._id)}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
