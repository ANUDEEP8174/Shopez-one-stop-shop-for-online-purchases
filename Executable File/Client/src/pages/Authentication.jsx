import React, { useState } from 'react';
import '../styles/Authentication.css';
import Login from '../components/Login';
import Register from '../components/Register';

const Authentication = () => {
  const [isLogin, setIsLogin] = useState(true);

  // Function to toggle between Login and Register
  const toggleAuthForm = () => setIsLogin((prev) => !prev);

  return (
    <div className="AuthenticatePage">
      {/* Conditional rendering based on isLogin state */}
      {isLogin ? (
        <Login setIsLogin={setIsLogin} toggleAuthForm={toggleAuthForm} />
      ) : (
        <Register setIsLogin={setIsLogin} toggleAuthForm={toggleAuthForm} />
      )}
    </div>
  );
};

export default Authentication;
