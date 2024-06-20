import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import DeleteFileMenu from '../DeleteFileMenu/DeleteFileMenu.js';
import SendFileMenu from '../SendFileMenu/SendFileMenu.js';
import { changeFileName } from '../../functions.js';

import './EditPage.css';
import EditFileOptionsMenu from '../EditFileOptionsMenu/EditFileOptionsMenu.js';

const MONTH_LIST = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// isNewFile,
// setNewFileName,
// fileName,
// fileType,
// fileData,
// file,
// setFileData,
// navigateBack,
// setShowDeleteFileMenu,
// setShowSendFileMenu,
// handleSaveFile,
// handleAcceptFile,
// handleRejectFile,
// handleRestoreFile,
// newEditFileName,
// setNewEditFileName

const EditPage = ({ selectedFile, setSelectedFile, editOrNewFile, setEditOrNewFile, userFilesRefetch }) => {

    const userEmail = useSelector((state) => state.userData.email);

    const [editFileName, setEditFileName] = useState(false);
    const [newEditFileName, setNewEditFileName] = useState(selectedFile?.name.split('.')[0]);
    const [sendDeleteMenu, setSendDeleteMenu] = useState(0);
    const [displayEditNameError, setDisplayEditNameError] = useState(false);
    const [displayNewNameError, setDisplayNewNameError] = useState(-1);

    const handleEditFileName = async () => {
      
      const localNewFileName = `${newEditFileName}${selectedFile?.extension}`;

      try {

        const localFormData = {
          // email: localStorage.getItem("userEmail"),
          email: userEmail,
          fileName: selectedFile?.name,
          newFileName: localNewFileName
        };

        const handleEditFileNameSuccess = await changeFileName(localFormData);
        if (handleEditFileNameSuccess === 1) {
          userFilesRefetch();
          setSelectedFile({ ...selectedFile, name: localNewFileName });
          setEditFileName(false);
          setDisplayEditNameError(false);
        } else {
          setDisplayEditNameError(true);
        }

      } catch (err) {
        console.log(err.message);
      }
    }

    const getFileExtension = () => {
      
      return selectedFile?.name.split('.')[1];

    };

    const displayDateAndTime = () => {

      if (editOrNewFile === 0) {
        return;
      }

      let localFullDate = selectedFile?.date;
      let localDate = localFullDate.substring(0, 10);
      let localTime = localFullDate.substring(11, 16);

      let localMonth = MONTH_LIST[Number(localDate.substring(5, 7)) - 1];
      let localDay = localDate.substring(8, 10);
      let localYear = localDate.substring(0, 4);

      return `${localMonth} ${localDay}, ${localYear} | ${localTime}`

    };

    return (
      <>
        <div className='editScreenContainer'>
          <div className='contentHeadersWrapper'>
            <div className='fileHeaderWrapper'>
              {editOrNewFile === 0 ? (
                <div className='newFileNameWrapper'>
                  <input
                    className="newFileSearchBar"
                    type="text"
                    placeholder="Enter new file name"
                    value={selectedFile?.name}
                    onChange={(e) => setSelectedFile({ ...selectedFile, name: e.target.value })}
                    style={{
                      marginTop: '50px',
                      marginBottom: '20px'
                    }}
                  />
                  { displayNewNameError === 0 && <h5 style={{ color: 'red', marginTop: '0px' }}>Invalid name, please enter a string followed by a period and an extension</h5>} 
                  { displayNewNameError === 1 && <h5 style={{ color: 'red', marginTop: '0px' }}>Invalid name, file name cannot have the following characters: / &gt; &lt; : " \ | ? *</h5> }
                  { displayNewNameError === 2 && <h5 style={{ color: 'red', marginTop: '0px' }}>Invalid name, file name cannot contain spaces</h5> }
                </div>
              ) : (
                <div className='fileNameWrapper'>
                  { editFileName ? (
                    <div className='fileEditNameWrapper'>
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <input
                          className='fileEditNameInput'
                          value={newEditFileName}
                          onChange={(e) => setNewEditFileName(e.target.value)}
                        />
                        <h3 style={{
                          marginLeft: '10px'
                        }}>.{getFileExtension()}</h3>
                      </div>
                      {displayEditNameError && <h6 style={{ color: 'red', marginTop: '0px', marginBottom: '0px' }}>This file name already exists</h6>}
                      <div className='fileEditNameButtonWrapper'>
                        <button 
                          className='fileEditNameButton'
                          onClick={handleEditFileName}
                        >
                          Save
                        </button>
                        <button
                          className='fileEditNameButton'
                          // value={newEditFileName}
                          onClick={() => {
                            setEditFileName(false);
                            setDisplayEditNameError(false);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <h1 className='headerText'>{selectedFile?.name}</h1>
                  ) }
                </div>
              )}
              <div className='fileDetailsWrapper'>
                <h4 className='fileDateHeader'>{displayDateAndTime()}</h4>
                {selectedFile?.sender && 
                  <h4 className='fileInfoHeader'>From: <b>{selectedFile?.sender}</b></h4>
                }
              </div>
            </div>
            <hr className='belowHeaderBorder' />
            <div className='editPageContentDiv'>
              { (selectedFile?.type === 'text' || editOrNewFile === 0) &&
                <textarea
                  className='editScreenTextArea'
                  value={atob(selectedFile?.data)}
                  onChange={(e) => setSelectedFile({ ...selectedFile, data: btoa(e.target.value) })}
                  // onChange={(e) => setFileData(btoa(e.target.value))}
                />}
              { selectedFile?.type === 'image' &&
                <div className='editScreenImage'> 
                  <div data-role="imagemagnifier" data-magnifier-mode="glass" data-lens-type="circle" data-lens-size="200">
                    <img className='editScreenImage' src={selectedFile?.data} alt="" />
                  </div>
                </div>
              }
              { selectedFile?.type === 'pdf' &&
                <embed src={selectedFile?.data} height="500x" width="600px"/>
              }
            </div>
          </div>
          <div className='optionsContainer'>
            <div className='optionsHeaderContainer'>
              <h1 className='headerText'>Options</h1>
            </div>
            <hr className='belowHeaderBorder' />
            <EditFileOptionsMenu
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              editOrNewFile={editOrNewFile}
              setSendDeleteMenu={setSendDeleteMenu}
              setEditFileName={setEditFileName}
              setEditOrNewFile={setEditOrNewFile}
              userFilesRefetch={userFilesRefetch}
              setDisplayNewNameError={setDisplayNewNameError}
            />
          </div>
        </div>
        {sendDeleteMenu === 1 &&
          <SendFileMenu
            fileName={selectedFile?.name}
            setSendDeleteMenu={setSendDeleteMenu}
            setEditOrNewFile={setEditOrNewFile}
            userFilesRefetch={userFilesRefetch}
          />
        }
        {sendDeleteMenu === 2 &&
          <DeleteFileMenu 
            fileName={selectedFile?.name}
            setSendDeleteMenu={setSendDeleteMenu}
            setEditOrNewFile={setEditOrNewFile}
            userFilesRefetch={userFilesRefetch}
          />
        }
      </>
    )
}

export default EditPage

// <div className="editScreenContainer">
//   {isNewFile ? (
//     <input 
//       className="homeFileSearchBar" 
//       type="text" 
//       placeholder="Enter new file name"
//       onChange={(e) => setNewFileName(e.target.value)}
//       style={{
//         marginTop: '50px',
//         marginBottom: '20px'
//       }}
//     />
//   ) : (
//     <h1>{fileName}</h1>
//   )}
//   { fileType === 'text' ? (
//     <textarea
//       value={atob(fileData)}  
//       onChange={(e) => setFileData(btoa(e.target.value))}
//       style={{
//         backgroundColor: 'white',
//         width: '75%',
//         height: '650px',
//         padding: '15px'
//       }}
//     />
//   ) : (<></>) }
//   { fileType === 'image' ? (
//     <img 
//       src={fileData} 
//       alt="" 
//       className='editScreenImage'
//     />
//   ) : (<></>) }
//   { fileType === 'pdf' ? (
//     <embed src={fileData} height="1000x" width="600px"/>
//   ) : (<></>) }
//   <div className='editScreenButtonWrapper'>
//     <button className='editScreenButton' onClick={navigateBack}>
//       Go Back
//     </button>
//     { isNewFile === false ? (
//       <button 
//         className='editScreenButton' 
//         onClick={() => setShowDeleteFileMenu(true)}
//       >
//         Delete
//       </button>
//     ) : (<></>) }
//     {isNewFile === false ? (
//       <button className='editScreenButton' onClick={() => setShowSendFileMenu(true)}>
//         Send
//       </button>
//     ) : (<></>)}
//     { fileType === 'text' ? (
//       <button className='editScreenButton' onClick={handleSaveFile}>
//         Save
//       </button>
//     ) : (<></>) }
//   </div>
// </div>