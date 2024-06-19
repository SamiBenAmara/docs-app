import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './EditProfilePage.css';
import { editProfileInformation, editUserPassword, getUserInformation } from '../../functions.js';

const EditProfilePage = () => {

  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: "userData",
    queryFn: () => getUserInformation(localStorage.getItem("userEmail"))
  });

  useEffect(() => {
    setUserFormData(data);
  }, [data]);

  const [userFormData, setUserFormData] = useState(data);
  const [showChangePasswordMenu, setShowChangePasswordMenu] = useState(false);
  const [showChangeProfileError, setShowChangeProfileError] = useState(0);
  const [userPasswordData, setUserPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    reenterNewPassword: ""
  });

  const navigateBack = () => {
    navigate('/home');
  };

  const handleUpdateData = async () => {

    userFormData.originalEmail = localStorage.getItem("userEmail");

    try {
      const localUpdateDataSuccess = await editProfileInformation(userFormData);
      if (localUpdateDataSuccess === 1) {
        localStorage.setItem("userEmail", userFormData.email);
        setShowChangeProfileError(0);
        navigate('/home');
      } else {
        setShowChangeProfileError(localUpdateDataSuccess);
      }

    } catch (err) {
      console.log(err.message);
    }
  };

  const handleChangePassword = async () => {

    try {

      const localUserPasswordData = {
        email: localStorage.getItem("userEmail"),
        oldPassword: userPasswordData.oldPassword,
        newPassword: userPasswordData.newPassword,
        reenterNewPassword: userPasswordData.reenterNewPassword
      };

      const localChangePasswordResult = await editUserPassword(localUserPasswordData);
      if (localChangePasswordResult === 1) {
        setShowChangePasswordMenu(false);
        navigate('/home');
      }

    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className='mainDivWrapper'>
      <button className='editProfileBackButton' onClick={navigateBack}>
        <ArrowBackIcon style={{ position: 'absolute', marginRight: '125px' }} />
        Go Back
      </button>
      <hr style={{ width: '95%' }} />
      <div className='mainDiv'>
        {isLoading ? (<h1 style={{ color: 'white' }}>Loading...</h1>) : (
          <div className='contentDiv'>
            <div className='editProfileHeaderWrapper'>
              <h1 className='editProfileHeaderText'>Edit Profile Information</h1>
            </div>
            <hr className='topLine' />
            <div className='itemDiv'>
              <div className='itemHeaderDiv'>
                <h2 className='itemHeader'>First Name</h2>
              </div>
              <input 
                className='itemInput' 
                type='text' 
                // defaultValue={data?.firstname}
                value={userFormData?.firstname} 
                onChange={(e) => setUserFormData({ ...userFormData, firstname: e.target.value })} 
              />
            </div>
            <div className='itemDiv'>
              <div className='itemHeaderDiv'>
                <h2 className='itemHeader'>Last Name</h2>
              </div>
              <input
                className='itemInput'
                type='text'
                value={userFormData?.lastname}
                onChange={(e) => setUserFormData({ ...userFormData, lastname: e.target.value })}
              />
            </div>
            <div className='itemDiv'>
              <div className='itemHeaderDiv'>
                <h2 className='itemHeader'>Username</h2>
                { (showChangeProfileError === 2 || showChangeProfileError === 4) && <h6 style={{ color: 'red', marginLeft: '60px' }}>Username is already taken</h6> }
              </div>
              <input 
                className='itemInput' 
                type='text' 
                // defaultValue={data?.username} 
                value={userFormData?.username}
                onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}  
              />
            </div>
            <div className='itemDiv'>
              <div className='itemHeaderDiv'>
                <h2 className='itemHeader'>Email</h2>
                { (showChangeProfileError === 3 || showChangeProfileError === 4) && <h6 style={{ color: 'red', marginLeft: '60px' }}>Email is already taken</h6> }
              </div>
              <input
                className='itemInput' 
                type='text' 
                // defaultValue={data?.email}
                value={userFormData?.email} 
                onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
              />
            </div>
            <div className='editButtonWrapper'>
              {/* <button className='editMenuButton' onClick={navigateBack}>Back</button> */}
              {/* <button className='editMenuButton' onClick={() => setShowChangePasswordMenu(true)}>Change Password</button> */}
              <button className='editMenuButton' onClick={handleUpdateData}>Save</button>
            </div>
          </div>
        )}
        <div className='verticalLineContainer'>

        </div>
        <div className='changePasswordMenuOuterContainer'>
          <div className='changePasswordMenuInnerContainer'>
            <div className='editProfileHeaderWrapper'>
              <h1 className='editProfileHeader'>Change Password</h1>
            </div>
            <hr className='topLine' />
            <div className='itemDiv'>
              <div className='itemHeaderDiv'>
                <h2 className='itemHeader'>Enter Old Password</h2>
              </div>
              <input
                className='changePasswordInput' 
                type='password' 
                value={userPasswordData.oldPassword} 
                onChange={(e) => setUserPasswordData({ ...userPasswordData, oldPassword: e.target.value })}
              />
            </div>
            <div className='itemDiv'>
              <div className='itemHeaderDiv'>
                <h2 className='itemHeader'>Enter New Password</h2>
              </div>
              <input
                className='changePasswordInput' 
                type='password' 
                value={userPasswordData.newPassword} 
                onChange={(e) => setUserPasswordData({ ...userPasswordData, newPassword: e.target.value })}
              />
            </div>
            <div className='itemDiv'>
              <div className='itemHeaderDiv'>
                <h2 className='itemHeader'>Re - enter New Password</h2>
              </div>
              <input
                className='changePasswordInput' 
                type='password' 
                value={userPasswordData.reenterNewPassword} 
                onChange={(e) => setUserPasswordData({ ...userPasswordData, reenterNewPassword: e.target.value })}
              />
            </div>
            <div className='changePasswordButtonWrapper'>
              {/* <button className='changePasswordButton' onClick={navigateBack}>Back</button> */}
              <button className='changePasswordButton' onClick={handleChangePassword}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfilePage