import React from 'react'
import './DeleteFileMenu.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { deleteFile } from '../../functions.js';

const DeleteFileMenu = ({ fileName, setSendDeleteMenu, setEditOrNewFile, userFilesRefetch }) => {
  
    const handleFileDelete = async () => {

        const formData = {
          email: localStorage.getItem('userEmail'),
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
        // <Popup trigger={<button>Trigger</button>} position="bottom">
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
        // </Popup>
    );
}

export default DeleteFileMenu