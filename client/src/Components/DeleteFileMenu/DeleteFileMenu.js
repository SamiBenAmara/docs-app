import React from 'react'
import './DeleteFileMenu.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const DeleteFileMenu = ({fileName, setShowDeleteFileMenu, handleFileDelete}) => {
  
    return (
        // <Popup trigger={<button>Trigger</button>} position="bottom">
            <div className='deleteFileOuterMenuWrapper'>
                <div className='deleteMenuInnerContainer'>
                    <div className='deleteMenuHeaderContainer'>
                        <h2>Are you sure you want to delete {fileName}?</h2>
                    </div>
                    <div className='deleteFileMenuButtonWrapper'>
                        <button 
                            className='deleteFileMenuSendButton'
                            onClick={() => setShowDeleteFileMenu(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className='deleteFileMenuCancelButton'
                            onClick={handleFileDelete}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        // </Popup>
    );
}

export default DeleteFileMenu