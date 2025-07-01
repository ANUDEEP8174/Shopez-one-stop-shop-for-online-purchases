import React, { useEffect, useState } from 'react';
import '../../styles/AllUsers.css';
import axios from 'axios';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchUsersData();
  }, []);

  const fetchUsersData = async () => {
    try {
      const [usersRes, ordersRes] = await Promise.all([
        axios.get('http://localhost:6001/fetch-users'),
        axios.get('http://localhost:6001/fetch-orders'),
      ]);

      const customers = usersRes.data.filter(user => user.usertype === 'customer');
      setUsers(customers);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching user/order data:', error);
    }
  };

  return (
    <div className="all-users-page">
      <h3>All Users</h3>

      <div className="user-cards">
        {users.map(user => {
          const userOrderCount = orders.filter(order => order.userId === user._id).length;
          return (
            <div className="user-card" key={user._id}>
              <span>
                <h5>User ID</h5>
                <p>{user._id}</p>
              </span>
              <span>
                <h5>Username</h5>
                <p>{user.username}</p>
              </span>
              <span>
                <h5>Email Address</h5>
                <p>{user.email}</p>
              </span>
              <span>
                <h5>Orders</h5>
                <p>{userOrderCount}</p>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllUsers;
