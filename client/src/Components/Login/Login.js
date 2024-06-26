import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateAllData } from '../../reduxSlices/userSlice.js';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { loginUser } from '../../functions.js';

const Login = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayError, setDisplayError] = useState(0);
  
  const handleLoginUser = async (e) => {

    e.preventDefault();

    try {

      const formData = {
        email: email,
        password: password
      }

      const loginResult = await loginUser(formData);

      if (loginResult.status === 200) {
        const userFormData = {
          firstName: loginResult.data.firstName,
          lastName: loginResult.data.lastName,
          userName: loginResult.data.userName,
          email: email,
          isLoggedIn: true,
        };

        dispatch(updateAllData(userFormData));
        navigate('/home');
      } else {
        setDisplayError(loginResult.response.status);
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
            { displayError === 404 && <h6 className='errorMessage'>Email does not exist</h6>}
            { displayError === 400 && <h6 className='errorMessage'>Password is incorrect</h6>}
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