import React from 'react';
import Signup from './Components/Signup/Signup';
import Login from './Components/Login/Login';
import Navbar from './Components/Navbar/Navbar';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import './App.css';

const App = () => {
  return (
    <div className='appDiv'>
      <h1 className='welcomeHeader'>Welcome to Docs</h1>
      <hr/>
      <div className="mainDiv">
        <div className='folderLogoDiv'>
          <FolderSharedIcon 
            style={{
              color: 'darkblue',
              width: '400px',
              height: '400px'
            }}
          />
          <div className='interiorIconWrapper'>
            <DescriptionOutlinedIcon 
              style={{
                color: 'darkblue',
                width: '200px',
                height: '200px'
              }}
            />
            <PictureAsPdfOutlinedIcon 
              style={{
                color: 'darkblue',
                width: '200px',
                height: '200px'
              }}
            />
            <ImageOutlinedIcon 
              style={{
                color: 'darkblue',
                width: '200px',
                height: '200px'
              }}
            />
          </div>
        </div>
        <div className='verticalLine'></div>
        <div className="appLogSignDiv">
          <Login/>
          <Signup/> 
        </div>
      </div>
    </div>
  )
}

export default App