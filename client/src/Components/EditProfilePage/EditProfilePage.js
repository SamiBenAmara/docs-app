import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateAllData } from '../../reduxSlices/userSlice.js';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './EditProfilePage.css';
import { editProfileInformation, editUserPassword, getUserInformation } from '../../functions.js';

const EditProfilePage = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.userData);

  // const { data, isLoading } = useQuery({
  //   queryKey: "userData",
  //   queryFn: () => getUserInformation(userData.email)
  //   // queryFn: () => getUserInformation(localStorage.getItem("userEmail"))
  // });

  // useEffect(() => {
  //   setUserFormData(data);
  // }, [data]);

  // const [userFormData, setUserFormData] = useState(data);
  const [userFormData, setUserFormData] = useState(userData);
  // const [showChangePasswordMenu, setShowChangePasswordMenu] = useState(false);
  const [showChangeProfileError, setShowChangeProfileError] = useState(0);
  const [showChangePasswordError, setShowChangePasswordError] = useState(0);
  const [userPasswordData, setUserPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    reenterNewPassword: ""
  });

  // useEffect(() => {
  //   setUserFormData(userData);
  // }, [userFormData, userData]);


  const navigateBack = () => {
    navigate('/home');
  };

  const handleUpdateData = async () => {

    // userFormData.originalEmail = localStorage.getItem("userEmail");
    // userFormData.originalEmail = userData.email;

    try {

      const localFormData = {
        firstName: userFormData.firstName,
        lastName: userFormData.lastName,
        userName: userFormData.userName,
        email: userFormData.email,
        originalEmail: userData.email,
        originalUserName: userData.userName
      };

      const localUpdateDataResult = await editProfileInformation(localFormData);
            
      if (localUpdateDataResult.status === 200) {
        // localStorage.setItem("userEmail", userFormData.email);
        dispatch(updateAllData(userFormData));
        setShowChangeProfileError(3);
        // setShowChangeProfileError({ show: false, message: '' });
        // navigate('/home');
      } else {
        setShowChangeProfileError(localUpdateDataResult.response.data);
      }

    } catch (err) {
      console.log(err.message);
    }
  };

  const handleChangePassword = async () => {

    try {

      const localUserPasswordData = {
        // email: localStorage.getItem("userEmail"),
        email: userData.email,
        oldPassword: userPasswordData.oldPassword,
        newPassword: userPasswordData.newPassword,
        reenterNewPassword: userPasswordData.reenterNewPassword
      };

      const localChangePasswordResult = await editUserPassword(localUserPasswordData);
      console.log("localChangePasswordResult: ", localChangePasswordResult);
      
      if (localChangePasswordResult.status === 200) {
        setUserPasswordData({
          oldPassword: "",
          newPassword: "",
          reenterNewPassword: ""
        });
        setShowChangePasswordError(4);
        // setShowChangePasswordMenu(false);
        // navigate('/home');
      } else {
        setShowChangePasswordError(localChangePasswordResult.response.data);
        // setShowChangePasswordError();
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
        {/* {isLoading ? (<h1 style={{ color: 'white' }}>Loading...</h1>) : ( */}
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
                // defaultValue={userData.firstName}
                value={userFormData.firstName} 
                onChange={(e) => setUserFormData({ ...userFormData, firstName: e.target.value })} 
              />
            </div>
            <div className='itemDiv'>
              <div className='itemHeaderDiv'>
                <h2 className='itemHeader'>Last Name</h2>
              </div>
              <input
                className='itemInput'
                type='text'
                value={userFormData.lastName}
                onChange={(e) => setUserFormData({ ...userFormData, lastName: e.target.value })}
              />
            </div>
            <div className='itemDiv'>
              <div className='itemHeaderDiv'>
                <h2 className='itemHeader'>Username</h2>
                {/* { (showChangeProfileError === 2 || showChangeProfileError === 4) && <h6 style={{ color: 'red', marginLeft: '60px' }}>Username is already taken</h6> } */}
              </div>
              <input 
                className='itemInput' 
                type='text' 
                // defaultValue={data?.username} 
                value={userFormData.userName}
                onChange={(e) => setUserFormData({ ...userFormData, userName: e.target.value })}  
              />
            </div>
            <div className='itemDiv'>
              <div className='itemHeaderDiv'>
                <h2 className='itemHeader'>Email</h2>
                {/* { (showChangeProfileError === 3 || showChangeProfileError === 4) && <h6 style={{ color: 'red', marginLeft: '60px' }}>Email is already taken</h6> } */}
                { showChangeProfileError === 1 && <h6 style={{ color: 'red', marginLeft: '60px' }}>Email is already in use</h6> }
                { showChangeProfileError === 2 && <h6 style={{ color: 'red', marginLeft: '60px' }}>Username is already in use</h6> }
                { showChangeProfileError === 3 && <h6 style={{ color: 'green', marginLeft: '60px' }}>Sucessfully updated user's information</h6> }
              </div>
              <input
                className='itemInput' 
                type='text' 
                // defaultValue={data?.email}
                value={userFormData.email} 
                onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
              />
            </div>
            <div className='editButtonWrapper'>
              {/* <button className='editMenuButton' onClick={navigateBack}>Back</button> */}
              {/* <button className='editMenuButton' onClick={() => setShowChangePasswordMenu(true)}>Change Password</button> */}
              <button className='editMenuButton' onClick={handleUpdateData}>Save</button>
            </div>
          </div>
        {/* )} */}
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
            { showChangePasswordError === 1 && <h6 className='changePasswordErrorText'>Old password is incorrect</h6> }
            { showChangePasswordError === 2 && <h6 className='changePasswordErrorText'>New passwords don't match</h6> }
            { showChangePasswordError === 3 && <h6 className='changePasswordErrorText'>New password cannot be the same as the old one</h6> }
            { showChangePasswordError === 4 && <h6 className='changePasswordSuccessText'>Sucessfully updated password</h6> }
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