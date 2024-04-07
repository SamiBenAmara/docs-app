import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FolderIcon from '@mui/icons-material/FolderOutlined';
import './Navbar.css';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NavbarMenu from '../NavbarMenu/NavbarMenu';

const Navbar = () => {

  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {

    if (localStorage.getItem("isLoggedIn")) {
      setIsLoggedIn(true);
    }

  });

  const handleNavbarMenuClick = () => {

    setShowMenu(!showMenu);

  };

  return (
    <>
      <div className="navBarDiv">
        <div className="docsNavBarLogoWrapper">
          <FolderIcon fontSize='large' />
          <h1>Docs</h1>
        </div>
        {isLoggedIn ? (
          <div className="navBarMenuButtonWrapper">
          <button 
            className="navBarMenuButton"
            onClick={handleNavbarMenuClick}  
          >
            <ArrowDropDownIcon />
          </button>
          {showMenu ? (
            <NavbarMenu setIsLoggedIn={setIsLoggedIn} setShowMenu={setShowMenu} />
          ) : (<></>)}
        </div>
        ) : (<></>)}
      </div>
    </>
  )
}

export default Navbar