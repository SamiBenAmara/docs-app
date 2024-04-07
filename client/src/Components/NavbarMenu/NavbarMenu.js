import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavbarMenu.css';

const NavbarMenu = ({ setIsLoggedIn, setShowMenu }) => {
  
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setShowMenu(false);
    setIsLoggedIn(false);
    navigate('/');
  }
  
  const handleEditProfile = () => {
    navigate('/editprofile');
    setShowMenu(false);
  }

  const handleChangePassword = () => {
    setShowMenu(false);
  };

  return (
    <div className='navbarMenuWrapper'>
      <div className='navbarMenuItem'>
        <button className='navbarMenuItemButton' onClick={handleEditProfile}>
          Edit Profile
        </button>
      </div>
      <div className='navbarMenuItem'>
        <button className='navbarMenuItemButton' onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default NavbarMenu