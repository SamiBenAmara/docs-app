import React from 'react';
import Signup from './Components/Signup/Signup';
import Login from './Components/Login/Login';
import Navbar from './Components/Navbar/Navbar';
import './App.css';

const App = () => {
  return (
    <div className="appDiv">
      <div className="appLogSignDiv">
        <Login/>
        <Signup/>      
      </div>
    </div>
  )
}

export default App