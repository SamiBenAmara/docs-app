import React, { useState } from 'react';
import { uploadFile, getFiles, getAllUsers, sendFile, deleteFile, saveFileChanges, getInboxFiles, getRecycleBinFiles, acceptReceivedFile, rejectReceivedFile, restoreDeletedFile } from '../../functions.js';
import { useQuery } from 'react-query';
// import './Home.css';
import DeleteFileMenu from '../DeleteFileMenu/DeleteFileMenu.js';
import SendFileMenu from '../SendFileMenu/SendFileMenu.js';
import EditPage from '../EditPage/EditPage.js';
import HomePage from '../HomePage/HomePage.js';
import { useMediaQuery } from '@mui/material';

const Home = () => {

  const { data, refetch } = useQuery({
    queryKey: ["userFiles"],
    queryFn: () => getFiles(localStorage.getItem('userEmail'))
  })

  const { data: allUsersData } = useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers
  })

  const [screen, setScreen] = useState('home');
  const [isNewFile, setIsNewFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState('');
  const [fileType, setFileType] = useState('text');
  const [showSendFileMenu, setShowSendFileMenu] = useState(false);
  const [searchUsersList, setSearchUsersList] = useState([]);

  const [searchInboxFileList, setSearchInboxFileList] = useState([]);
  const [searchInboxFileName, setSearchInboxFileName] = useState('');

  const [searchRecycleFileList, setSearchRecycleFileList] = useState([]);
  const [searchRecycleFileName, setSearchRecycleFileName] = useState('');

  const [searchMyFilesFileList, setSearchMyFilesFileList] = useState([]);
  const [searchMyFilesFileName, setSearchMyFilesFileName] = useState('');

  const [fileReceiverName, setFileReceiverName] = useState('');
  const [showDeleteFileMenu, setShowDeleteFileMenu] = useState(false);

  const [newEditFileName, setNewEditFileName] = useState(file?.name.split('.')[0]);

  // // 0 - my file, 1 - inbox, 2 - recycling bin
  // const handleFileClick = (localFile, localDeleteRecycle) => {

  //   // setSearchFileName('');
  //   setSearchMyFilesFileName('');
  //   setSearchInboxFileName('');
  //   setSearchRecycleFileName('');

  //   const fileIdentifierRegex = "(base64)";
  //   const localFileAllData = localFile.data;

  //   let base64Position = localFileAllData.search(fileIdentifierRegex);

  //   let fileIdentiferInfo = localFileAllData.substring(5, base64Position - 1);

  //   let localFileData = localFileAllData.substring(base64Position + 7, localFileAllData.length);

  //   if (fileIdentiferInfo.substring(0, 4) === 'text') {
  //     setFileType('text');
  //     setFileData(localFileData);
  //   } else if (fileIdentiferInfo.substring(0, 5) === 'image') {
  //     setFileType('image');
  //     setFileData(localFileAllData);
  //   } else if (fileIdentiferInfo === 'application/pdf') {
  //     setFileType('pdf');
  //     setFileData(localFileAllData);
  //   }

  //   setFile(localFile);
  //   setScreen('edit');
  // }

  const navigateBack = () => {
    setScreen('home');
    setFileType('text');
    setIsNewFile(false);
    setFile(null);
    setFileData('');
  }

  // const handleSaveFile = async () => {
    
  //   const formData = {
  //     email: localStorage.getItem('userEmail'),
  //     fileData: `data:text/plain;base64,${fileData}`
  //   };

  //   try {

  //     let localUpdateFileSuccess;

  //     if (isNewFile) {
  //       formData.fileName = newFileName;
  //       localUpdateFileSuccess = await uploadFile(formData);
  //     } else {
  //       formData.fileName = file.name;
  //       localUpdateFileSuccess = await saveFileChanges(formData);
  //     }

  //     if (localUpdateFileSuccess === 'success') {
  //       refetch();
  //       setScreen('home');
  //       setIsNewFile(false);
  //       setFile(null);
  //       setFileData('');
  //     }

  //   } catch (err) {
  //     console.log(err.message);
  //   }
  // };

  const handleSendFile = async () => {

    const formData = {
      senderEmail: localStorage.getItem('userEmail'),
      fileName: file.name,
      username: fileReceiverName
    };

    try {

      await sendFile(formData);
      setShowSendFileMenu(false);

    } catch (err) {
      console.log(err.message);
    }

  };

  // const handleUploadFile = async (e) => {
    
  //   let localFile = e.target.files[0];
  //   let fileName = localFile.name;
  //   let reader = new FileReader();
  //   reader.readAsDataURL(localFile);

  //   reader.onload = async function () {
  //     console.log(reader.result);

  //     try {
        
  //       let formData = {
  //         email: localStorage.getItem('userEmail'),
  //         fileName: fileName,
  //         fileData: reader.result,
  //         date: new Date()
  //       }

  //       await uploadFile(formData);
  //       refetch();

  //     } catch (err) {
  //       console.log(err.message);
  //     }
  //   }

  //   reader.onerror = function (error) {
  //     console.log('Error: ', error)
  //   }
  // };

  const handleSearchForUser = (e) => {
    let localTempUserName = e.target.value;
    setFileReceiverName(localTempUserName);

    if (localTempUserName === '') {
      setSearchUsersList([]);
    } else {
      setSearchUsersList(allUsersData.filter((user) => user.username.search(`(${localTempUserName})`) !== -1));
    }
  };

  // const handleSearchForFile = (e, binNumber) => {

  //   let localFileName = e.target.value;

  //   if (binNumber === 0) {
  //     setSearchMyFilesFileName(localFileName);
  //   } else if (binNumber === 1) {
  //     setSearchInboxFileName(localFileName);
  //   } else if (binNumber === 2) {
  //     setSearchRecycleFileName(localFileName);
  //   } else {
  //     console.log("BIN NUMBER ERROR");
  //   }

  //   // setSearchFileName(localFileName);

  //   if (localFileName === '') {
  //     // setSearchFileList([]);
  //     setSearchMyFilesFileList([]);
  //     setSearchInboxFileList([]);
  //     setSearchRecycleFileList([]);
  //   } else {
  //     if (binNumber === 0) {
  //       setSearchMyFilesFileList(data.filter((file) => file.name.search(`(${localFileName})`) !== -1 && file.binNumber === 0));
  //     } else if (binNumber === 1) {
  //       setSearchInboxFileList(data.filter((file) => file.name.search(`(${localFileName})`) !== -1 && file.binNumber === 1));
  //     } else if (binNumber === 2) {
  //       setSearchRecycleFileList(data.filter((file) => file.name.search(`(${localFileName})`) !== -1 && file.binNumber === 2));
  //     } else {
  //       console.log("BIN NUMBER ERROR");
  //     }
  //     // setSearchFileList(data.filter((file) => file.name.search(`(${localFileName})`) !== -1 && file.binNumber === binNumber));
  //   }
  // };

  const handleUserClick = (localUserName) => {
    setFileReceiverName(localUserName);
  };

  // const handleFileDelete = async () => {

  //   const formData = {
  //     email: localStorage.getItem('userEmail'),
  //     fileName: file.name,
  //     isRecycle: true
  //   };

  //   try {

  //     const localIsDeleteSuccess = await deleteFile(formData);
  //     if (localIsDeleteSuccess === 'success') {
  //       refetch();
  //       setShowDeleteFileMenu(false);
  //       setScreen('home');
  //       setFile(null);
  //       setFileData('');
  //     }

  //   } catch (err) {
  //     console.log(err.message);
  //   }
  // };

  const handleChangeFileName = async () => {
    try {

      // const localFormData = {
      //   email: localStorage.getItem("userEmail"),
      //   fileName: file.name,
      //   newFileName: 
      // }

    } catch (err) {
      console.log(err.message);
    }
  }

  // const handleAcceptFile = async () => {
    
  //   const formData = {
  //     email: localStorage.getItem("userEmail"),
  //     fileName: file.name
  //   };

  //   try {

  //     const acceptFileStatus = await acceptReceivedFile(formData);

  //     if (acceptFileStatus === 1) {
  //       refetch();
  //       setShowDeleteFileMenu(false);
  //       setScreen('home');
  //       setFile(null);
  //       setFileData('');
  //     }

  //   } catch (err) {
  //     console.log(err.message);
  //   }

  // };

  // const handleRejectFile = async () => {

  //   const formData = {
  //     email: localStorage.getItem("userEmail"),
  //     fileName: file.name
  //   };

  //   try {

  //     const rejectFormDataStatus = await rejectReceivedFile(formData);

  //     if (rejectFormDataStatus === 1) {
  //       refetch();
  //       setShowDeleteFileMenu(false);
  //       setScreen('home');
  //       setFile(null);
  //       setFileData('');
  //     }

  //   } catch (err) {
  //     console.log(err.message);
  //   }

  // };

  // const handleRestoreFile = async () => {
    
  //   const formData = {
  //     email: localStorage.getItem('userEmail'),
  //     fileName: file.name
  //   };

  //   try {

  //     const restoreFileSuccess = await restoreDeletedFile(formData);

  //     if (restoreFileSuccess === 1) {
  //       refetch();
  //       setShowDeleteFileMenu(false);
  //       setScreen('home');
  //       setFile(null);
  //       setFileData('');
  //     }

  //   } catch (err) {
  //       console.log(err.message);
  //   }

  // };

  return (

    <>
    </>

    // <HomePage 
    //   setScreen={setScreen}
    //   setIsNewFile={setIsNewFile}
    //   handleUploadFile={handleUploadFile}
    //   fileData={data}
    //   handleFileClick={handleFileClick}
    //   handleSearchForFile={handleSearchForFile}
    //   searchMyFilesFileList={searchMyFilesFileList}
    //   searchMyFilesFileName={searchMyFilesFileName}
    //   searchInboxFileList={searchInboxFileList}
    //   searchInboxFileName={searchInboxFileName}
    //   searchRecycleFileList={searchRecycleFileList}
    //   searchRecycleFileName={searchRecycleFileName}
    // />

    // <>
    //   { screen === 'home' ? (
    //     <HomePage 
    //       setScreen={setScreen}
    //       setIsNewFile={setIsNewFile}
    //       handleUploadFile={handleUploadFile}
    //       fileData={data}
    //       handleFileClick={handleFileClick}
    //       handleSearchForFile={handleSearchForFile}
    //       searchMyFilesFileList={searchMyFilesFileList}
    //       searchMyFilesFileName={searchMyFilesFileName}
    //       searchInboxFileList={searchInboxFileList}
    //       searchInboxFileName={searchInboxFileName}
    //       searchRecycleFileList={searchRecycleFileList}
    //       searchRecycleFileName={searchRecycleFileName}
    //     />
    //   ) : (<></>) }

    //   { screen === 'edit' ? (
    //     <EditPage 
    //       isNewFile={isNewFile}
    //       setNewFileName={setNewFileName}
    //       fileName={file?.name}
    //       fileType={fileType}
    //       fileData={fileData}
    //       file={file}
    //       setFileData={setFileData}
    //       navigateBack={navigateBack}
    //       setShowDeleteFileMenu={setShowDeleteFileMenu}
    //       setShowSendFileMenu={setShowSendFileMenu}
    //       handleSaveFile={handleSaveFile}
    //       handleAcceptFile={handleAcceptFile}
    //       handleRejectFile={handleRejectFile}
    //       handleRestoreFile={handleRestoreFile}
    //       newEditFileName={newEditFileName}
    //       setNewEditFileName={setNewEditFileName}
    //     />
    //   ) : (<></>) }
    //   { showSendFileMenu ? (
    //     <SendFileMenu
    //       fileReceiverName={fileReceiverName} 
    //       handleSearchForUser={handleSearchForUser}
    //       searchUsersList={searchUsersList}
    //       handleUserClick={handleUserClick}
    //       handleSendFile={handleSendFile}
    //       setShowSendFileMenu={setShowSendFileMenu}
    //     />
    //   ) : (<></>) }
    //   { showDeleteFileMenu ? (
    //     <DeleteFileMenu 
    //       fileName={file.name} 
    //       setShowDeleteFileMenu={setShowDeleteFileMenu}
    //       handleFileDelete={handleFileDelete}
    //     />
    //   ) : (<></>) }
    // </>
  )
}

export default Home