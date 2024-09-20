import React from 'react';
import { useSelector } from 'react-redux';
import './DeleteFileMenu.css';
import 'reactjs-popup/dist/index.css';
import { deleteFile } from '../../functions.js';

const DeleteFileMenu = ({ fileName, setSendDeleteMenu, setEditOrNewFile, userFilesRefetch }) => {
  
    const userEmail = useSelector((state) => state.userData.email);

    const handleFileDelete = async () => {

        const formData = {
          email: userEmail,
          fileName: fileName
        };
    
        try {
    
          const localIsDeleteSuccess = await deleteFile(formData);
          if (localIsDeleteSuccess === 1) {
            userFilesRefetch();
            setSendDeleteMenu(0);
            setEditOrNewFile(-1);
          }
    
        } catch (err) {
          console.log(err.message);
        }
      };

    return (
        <div className='deleteFileOuterMenuWrapper'>
            <div className='deleteMenuInnerContainer'>
                <div className='deleteMenuHeaderContainer'>
                    <h2>Are you sure you want to delete {fileName}?</h2>
                </div>
                <div className='deleteFileMenuButtonWrapper'>
                    <button
                        className='deleteFileMenuCancelButton'
                        onClick={handleFileDelete}
                    >
                        Delete
                    </button>
                    <button 
                        className='deleteFileMenuSendButton'
                        onClick={() => setSendDeleteMenu(0)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteFileMenu