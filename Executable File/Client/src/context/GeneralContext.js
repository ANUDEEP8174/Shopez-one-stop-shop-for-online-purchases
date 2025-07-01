import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const GeneralContext = createContext();

const GeneralContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // Auth state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');

  // Search & Cart
  const [productSearch, setProductSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const res = await axios.get('http://localhost:6001/fetch-cart');
        const userItems = res.data.filter(item => item.userId === userId);
        setCartCount(userItems.length);
      }
    } catch (err) {
      console.error('Error fetching cart count:', err);
    }
  };

  const handleSearch = () => {
    navigate('#products-body');
  };

  const login = async () => {
    try {
      const loginInputs = { email, password };
      const res = await axios.post('http://localhost:6001/login', loginInputs);

      const { _id, usertype, username, email: userEmail } = res.data;
      localStorage.setItem('userId', _id);
      localStorage.setItem('userType', usertype);
      localStorage.setItem('username', username);
      localStorage.setItem('email', userEmail);

      navigate(usertype === 'admin' ? '/admin' : '/');
    } catch (err) {
      alert('Login failed!');
      console.error(err);
    }
  };

  const register = async () => {
    try {
      const inputs = { username, email, usertype, password };
      const res = await axios.post('http://localhost:6001/register', inputs);

      const { _id, usertype, username, email: userEmail } = res.data;
      localStorage.setItem('userId', _id);
      localStorage.setItem('userType', usertype);
      localStorage.setItem('username', username);
      localStorage.setItem('email', userEmail);

      navigate(usertype === 'admin' ? '/admin' : '/');
    } catch (err) {
      alert('Registration failed!');
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <GeneralContext.Provider
      value={{
        login,
        register,
        logout,
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        usertype,
        setUsertype,
        productSearch,
        setProductSearch,
        handleSearch,
        cartCount,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;
