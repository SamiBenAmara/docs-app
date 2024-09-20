import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FolderIcon from '@mui/icons-material/FolderOutlined';
import './Navbar.css';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NavbarMenu from '../NavbarMenu/NavbarMenu';

const Navbar = () => {

  const isLoggedIn = useSelector((state) => state.userData.isLoggedIn);

  const [showMenu, setShowMenu] = useState(false);

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
            <NavbarMenu setShowMenu={setShowMenu} />
          ) : (<></>)}
        </div>
        ) : (<></>)}
      </div>
    </>
  )
}

export default Navbar