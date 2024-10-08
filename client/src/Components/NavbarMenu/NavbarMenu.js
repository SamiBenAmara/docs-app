import React from 'react';
import { useDispatch } from 'react-redux';
import { updateLoggedInStatus, resetUserData } from '../../reduxSlices/userSlice';
import { useNavigate } from 'react-router-dom';
import './NavbarMenu.css';

const NavbarMenu = ({ setShowMenu }) => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(resetUserData());
    setShowMenu(false);
    dispatch(updateLoggedInStatus(false));
    navigate('/');
  }
  
  const handleEditProfile = () => {
    navigate('/editprofile');
    setShowMenu(false);
  }

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