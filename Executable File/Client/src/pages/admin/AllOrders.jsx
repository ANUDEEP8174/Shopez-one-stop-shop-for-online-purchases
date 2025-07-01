import React, { useEffect, useState } from 'react';
import '../../styles/AllOrders.css';
import axios from 'axios';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [updateStatus, setUpdateStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-orders');
      setOrders([...response.data].reverse());
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const cancelOrder = async (id) => {
    try {
      await axios.put('http://localhost:6001/cancel-order', { id });
      alert('Order cancelled!');
      fetchOrders();
    } catch {
      alert('Order cancellation failed!');
    }
  };

  const updateOrderStatus = async (id) => {
    try {
      await axios.put('http://localhost:6001/update-order-status', { id, updateStatus });
      alert('Order status updated!');
      setUpdateStatus('');
      fetchOrders();
    } catch {
      alert('Order update failed!');
    }
  };

  return (
    <div className="all-orders-page">
      <h3>Orders</h3>
      <div className="all-orders">
        {orders.map((order) => (
          <div className="all-orders-order" key={order._id}>
            <img src={order.mainImg} alt={order.title} />
            <div className="all-orders-order-data">
              <h4>{order.title}</h4>
              <p>{order.description}</p>

              <div>
                <p><b>Size:</b> {order.size}</p>
                <p><b>Quantity:</b> {order.quantity}</p>
                <p><b>Price:</b> ₹{parseInt(order.price - (order.price * order.discount) / 100) * order.quantity}</p>
                <p><b>Payment method:</b> {order.paymentMethod}</p>
              </div>

              <div>
                <p><b>UserId:</b> {order.userId}</p>
                <p><b>Name:</b> {order.name}</p>
                <p><b>Email:</b> {order.email}</p>
                <p><b>Mobile:</b> {order.mobile}</p>
              </div>

              <div>
                <p><b>Ordered on:</b> {order.orderDate.slice(0, 10)}</p>
                <p><b>Address:</b> {order.address}</p>
                <p><b>Pincode:</b> {order.pincode}</p>
              </div>

              <div>
                <p><b>Order status:</b> {order.orderStatus}</p>

                {(order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled') && (
                  <>
                    <select
                      className="form-select form-select-sm"
                      defaultValue=""
                      onChange={(e) => setUpdateStatus(e.target.value)}
                    >
                      <option value="" disabled>Update order status</option>
                      <option value="Order placed">Order Placed</option>
                      <option value="In-transit">In-transit</option>
                      <option value="delivered">Delivered</option>
                    </select>
                    <button className="btn btn-primary" onClick={() => updateOrderStatus(order._id)}>Update</button>
                  </>
                )}

                {(order.orderStatus === 'order placed' || order.orderStatus === 'In-transit') && (
                  <button className="btn btn-danger" onClick={() => cancelOrder(order._id)}>Cancel</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllOrders;
