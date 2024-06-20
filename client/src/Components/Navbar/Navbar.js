import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FolderIcon from '@mui/icons-material/FolderOutlined';
import './Navbar.css';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NavbarMenu from '../NavbarMenu/NavbarMenu';

const Navbar = () => {

  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.userData.isLoggedIn);

  const [showMenu, setShowMenu] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect(() => {

  //   if (localStorage.getItem("isLoggedIn")) {
  //     setIsLoggedIn(true);
  //   }

  // });

  const handleNavbarMenuClick = () => {

    setShowMenu(!showMenu);

  };

  return (
    <>
      <div className="navBarDiv">
        <div className="docsNavBarLogoWrapper">
          <FolderIcon fontSize='large' style={{ color: 'white' }} />
          <h1 style={{ color: 'white', fontWeight: '400' }}>Docs</h1>
        </div>
        {isLoggedIn ? (
          <div className="navBarMenuButtonWrapper">
          <button 
            className="navBarMenuButton"
            onClick={handleNavbarMenuClick}  
          >
            <ArrowDropDownIcon style={{ color: 'white' }} />
          </button>
          {showMenu ? (
            <NavbarMenu /*setIsLoggedIn={setIsLoggedIn}*/ setShowMenu={setShowMenu} />
          ) : (<></>)}
        </div>
        ) : (<></>)}
      </div>
    </>
  )
}

export default Navbar