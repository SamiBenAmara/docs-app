import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { loginUser } from '../../functions.js';

const Login = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLoginUser = async (e) => {

    e.preventDefault();

    const formData = {
      email: email,
      password: password
    }

    try {

      const loginSuccess = await loginUser(formData);

      if (loginSuccess.status === 'success') {
        localStorage.setItem("userEmail", email);
        localStorage.setItem("username", loginSuccess.username);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("userFirstName", loginSuccess.name);
        navigate('/home');
      }

    } catch (err) {
      console.log(err.message);
    }

  };

  return (
    <div className="loginDiv">
        <h1 className='loginHeader'>Login</h1>
        <form onSubmit={handleLoginUser}>
            <input 
              className="loginInput" 
              type="email" 
              placeholder='Email Address'
              onChange={(e) => setEmail(e.target.value)}  
            />
            <input 
              className="loginInput" 
              type="password" 
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}  
            />
            <button 
              type="submit"
              className='loginButton'
            >
              Login
            </button>
        </form>
    </div>
  )
}

export default Login