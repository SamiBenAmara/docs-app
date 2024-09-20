import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RestoreIcon from '@mui/icons-material/Restore';
import { useSelector } from 'react-redux';
import { restoreDeletedFile, acceptReceivedFile, rejectReceivedFile, uploadFile, saveFileChanges } from '../../functions.js';
import './EditFileOptionsMenu.css';

const EditFileOptionsMenu = ({ selectedFile, 
                               setSelectedFile, 
                               editOrNewFile, 
                               setSendDeleteMenu, 
                               setEditFileName,
                               setEditOrNewFile,
                               userFilesRefetch,
                               setDisplayNewNameError }) => {

  const userEmail = useSelector((state) => state.userData.email);

  const handleRestoreFile = async () => {

    const formData = {
      email: userEmail,
      fileName: selectedFile?.name
    };

    try {

      const restoreFileSuccess = await restoreDeletedFile(formData);

      if (restoreFileSuccess === 1) {
        userFilesRefetch();
        setEditOrNewFile(-1);
        setSelectedFile({ name: '', data: '', type: '', date: '', sender: '', binNumber: 0, extension: '' });
      }
    } catch (err) {
      console.log(err.message);
    }

  };

  const handleAcceptFile = async () => {
    
    const formData = {
      email: userEmail,
      fileName: selectedFile?.name
    };

    try {

      const acceptFileStatus = await acceptReceivedFile(formData);

      if (acceptFileStatus === 1) {
        userFilesRefetch();
        setEditOrNewFile(-1);
        setSelectedFile({ name: '', data: '', type: '', date: '', sender: '', binNumber: 0, extension: '' });
      }

    } catch (err) {
      console.log(err.message);
    }

  };

  const handleRejectFile = async () => {

    const formData = {
      email: userEmail,
      fileName: selectedFile?.name
    };

    try {

      const rejectFormDataStatus = await rejectReceivedFile(formData);

      if (rejectFormDataStatus === 1) {
        userFilesRefetch();
        setEditOrNewFile(-1);
        setSelectedFile({ name: '', data: '', type: '', date: '', sender: '', binNumber: 0, extension: '' });
      }

    } catch (err) {
      console.log(err.message);
    }

  };

  const handleSaveFile = async () => {
    
    const formData = {
      email: userEmail,
      fileName: selectedFile?.name,
      fileData: `data:text/plain;base64,${selectedFile?.data}`,
      date: new Date()
    };

    // Check if file name is acceptable
    const localFileNameCheckArray = formData.fileName.split('.');
    if (localFileNameCheckArray.length !== 2) {
      // Check if the file name is a name followed by a period an a file extension
      setDisplayNewNameError(0);
      return;
    } else if (/[/><:"\\|?*]/.test(localFileNameCheckArray[0])) {
      // Check if the file name contains any invalid characters
      setDisplayNewNameError(1);
      return;
    } else if (localFileNameCheckArray[0].includes(" ")) {
      // Check if the file name contains any spaces
      setDisplayNewNameError(2);
      return;
    } else {
      setDisplayNewNameError(-1);
    }

    try {

      let localUpdateFileSuccess;

      // Check if the user is uploading a new file or editing an existing one
      if (editOrNewFile === 0) {
        localUpdateFileSuccess = await uploadFile(formData);
      } else if (editOrNewFile === 1) {
        localUpdateFileSuccess = await saveFileChanges(formData);
      }

      if (localUpdateFileSuccess === 1) {
        userFilesRefetch();
        setEditOrNewFile(-1);
        setSelectedFile({ name: '', data: '', type: '', date: '', sender: '', binNumber: 0, extension: '' });
      }

    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className='optionsButtonContainer'>
      <button
        className='optionsScreenButton' 
        onClick={() => setSendDeleteMenu(1)}
        disabled={editOrNewFile === 0 || selectedFile?.binNumber !== 0}
      >
        <SendIcon style={{ marginRight: '20px' }} />
        Send
      </button>
      <button
        className='optionsScreenButton'
        onClick={handleSaveFile}
        disabled={editOrNewFile !== 0 && !(selectedFile?.binNumber === 0 && selectedFile?.type === 'text')}
      >
        <SaveIcon style={{ marginRight: '20px' }} />
        Save
      </button>
      <button
        className='optionsScreenButton'
        onClick={() => setEditFileName(true)}
        disabled={editOrNewFile === 0 || selectedFile?.binNumber !== 0}
      >
        <EditIcon style={{ marginRight: '20px' }} />
        Edit File Name
      </button>
      <button 
        className='optionsScreenButton' 
        onClick={() => setSendDeleteMenu(2)}
        disabled={editOrNewFile === 0 || selectedFile?.binNumber === 1}
      >
        <DeleteIcon style={{ marginRight: '20px' }} />
        Delete
      </button>
      <button
        className='optionsScreenButton' 
        onClick={handleRestoreFile}
        disabled={editOrNewFile === 0 || selectedFile?.binNumber < 2}
      >
        <RestoreIcon style={{ marginRight: '20px' }} />
        Restore
      </button>
      <button 
        className='optionsScreenButton' 
        onClick={handleAcceptFile}
        disabled={selectedFile?.binNumber !== 1}
      >
        <CheckIcon style={{ marginRight: '20px' }} />
        Accept File
      </button>
      <button 
        className='optionsScreenButton'
        onClick={handleRejectFile}
        disabled={selectedFile?.binNumber !== 1}
      >
        <CloseIcon style={{ marginRight: '20px' }} />
        Reject File
      </button>
      <button 
        className='optionsScreenButton' 
        onClick={() => {
            setEditOrNewFile(-1);
            setSelectedFile({ name: '', data: '', type: '', date: '', sender: '', binNumber: 0, extension: '' });
        }}
      >
        <ArrowBackIcon style={{ marginRight: '20px' }} />
        Go Back
      </button>
    </div>
  )
}

export default EditFileOptionsMenu