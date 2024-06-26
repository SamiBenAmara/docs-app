import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserNames, sendFiles } from '../../functions.js';
import { useQuery } from 'react-query';
import Select from 'react-select';
import './SendFileMenu.css';

const SendFileMenu = ({ fileName, setSendDeleteMenu, setEditOrNewFile, userFilesRefetch }) => {
  
  const userEmail = useSelector((state) => state.userData.email);

  const { data: userNamesList } = useQuery({
    queryKey: ["userNames"],
    queryFn: () => getUserNames(userEmail)
  });

  const [selectedUserNames, setSelectedUserNames] = useState([]);

  const handleSendFiles = async () => {

    if (selectedUserNames.length === 0) {
      console.log("NO USERS SELECTED");
      return;
    }

    try {

      let localUserNamesArr = selectedUserNames.map((item) => item.value);

      const localFormData = {
        email: userEmail,
        fileName: fileName,
        usernamesList: localUserNamesArr
      }

      const localSendFilesSuccess = await sendFiles(localFormData);
      if (localSendFilesSuccess === 1) {
        setSendDeleteMenu(0);
        setEditOrNewFile(-1);
      }

    } catch (err) {
      console.log(err.message);
    }
  };

  return (
      <div className='sendFileOuterMenuWrapper'>
        <div className='sendFileInnerMenuWrapper'>
          <h1 style={{marginLeft: '30px'}}>Search for a user</h1>
          <div style={{ width: '90%', marginLeft: '30px' }}>
            <Select
              options={userNamesList}
              isClearable
              isMulti
              onChange={(item) => setSelectedUserNames(item)}
            />
          </div>
          <div className='sendFileMenuButtonWrapper'>
            <button 
              className='sendFileMenuSendButton'
              onClick={handleSendFiles}
            >
              Send
            </button>
            <button className='sendFileMenuCancelButton' onClick={() => setSendDeleteMenu(0)}>
              Cancel
            </button></div>
        </div>
      </div>
    );
}

export default SendFileMenu;
