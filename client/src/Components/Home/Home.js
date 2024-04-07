import React, { useState } from 'react';
import { uploadFile, getFiles, getAllUsers, sendFile, deleteFile, saveFileChanges } from '../../functions.js';
import { useQuery } from 'react-query';
// import './Home.css';
import DeleteFileMenu from '../DeleteFileMenu/DeleteFileMenu.js';
import SendFileMenu from '../SendFileMenu/SendFileMenu.js';
import EditPage from '../EditPage/EditPage.js';
import HomePage from '../HomePage/HomePage.js';

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
  const [searchFileList, setSearchFileList] = useState([]);
  const [searchFileName, setSearchFileName] = useState('');
  const [fileReceiverName, setFileReceiverName] = useState('');
  const [showDeleteFileMenu, setShowDeleteFileMenu] = useState(false);

  const handleFileClick = (localFile) => {

    setSearchFileName('');

    const fileIdentifierRegex = "(base64)";
    const localFileAllData = localFile.data;

    let base64Position = localFileAllData.search(fileIdentifierRegex);

    let fileIdentiferInfo = localFileAllData.substring(5, base64Position - 1);

    let localFileData = localFileAllData.substring(base64Position + 7, localFileAllData.length);

    if (fileIdentiferInfo.substring(0, 4) === 'text') {
      setFileType('text');
      setFileData(localFileData);
    } else if (fileIdentiferInfo.substring(0, 5) === 'image') {
      setFileType('image');
      setFileData(localFileAllData);
    } else if (fileIdentiferInfo === 'application/pdf') {
      setFileType('pdf');
      setFileData(localFileAllData);
    }

    setFile(localFile);
    setScreen('edit');
  }

  const navigateBack = () => {
    setScreen('home');
    setFileType('text');
    setIsNewFile(false);
    setFile(null);
    setFileData('');
  }

  const handleSaveFile = async () => {
    
    const formData = {
      email: localStorage.getItem('userEmail'),
      fileData: `data:text/plain;base64,${fileData}`
    };

    try {

      let localUpdateFileSuccess;

      if (isNewFile) {
        formData.fileName = newFileName;
        localUpdateFileSuccess = await uploadFile(formData);
      } else {
        formData.fileName = file.name;
        localUpdateFileSuccess = await saveFileChanges(formData);
      }

      if (localUpdateFileSuccess === 'success') {
        refetch();
        setScreen('home');
        setIsNewFile(false);
        setFile(null);
        setFileData('');
      }

    } catch (err) {
      console.log(err.message);
    }
  };

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

  const handleUploadFile = async (e) => {
    
    let file = e.target.files[0];
    let fileName = file.name;
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async function () {
      console.log(reader.result);

      try {
        
        let formData = {
          email: localStorage.getItem('userEmail'),
          fileName: fileName,
          fileData: reader.result
        }

        await uploadFile(formData);
        refetch();

      } catch (err) {
        console.log(err.message);
      }
    }

    reader.onerror = function (error) {
      console.log('Error: ', error)
    }
  };

  const handleSearchForUser = (e) => {
    let localTempUserName = e.target.value;
    setFileReceiverName(localTempUserName);

    if (localTempUserName === '') {
      setSearchUsersList([]);
    } else {
      setSearchUsersList(allUsersData.filter((user) => user.username.search(`(${localTempUserName})`) !== -1));
    }
  };

  const handleSearchForFile = (e) => {

    let localFileName = e.target.value;
    setSearchFileName(localFileName);

    if (localFileName === '') {
      setSearchFileList([]);
    } else {
      setSearchFileList(data.filter((file) => file.name.search(`(${localFileName})`) !== -1));
    }

  };

  const handleUserClick = (localUserName) => {
    setFileReceiverName(localUserName);
  };

  const handleFileDelete = async () => {

    const formData = {
      email: localStorage.getItem('userEmail'),
      fileName: file.name
    };

    try {

      const localIsDeleteSuccess = await deleteFile(formData);
      if (localIsDeleteSuccess === 'success') {
        refetch();
        setShowDeleteFileMenu(false);
        setScreen('home');
        setFile(null);
        setFileData('');
      }

    } catch (err) {
      console.log(err.message);
    }

  };

  return (

    <>
      { screen === 'home' ? (
        <HomePage 
          setScreen={setScreen}
          setIsNewFile={setIsNewFile}
          handleUploadFile={handleUploadFile}
          fileData={data}
          handleFileClick={handleFileClick}
          handleSearchForFile={handleSearchForFile}
          searchFileList={searchFileList}
          searchFileName={searchFileName}
        />
      ) : (<></>) }

      { screen === 'edit' ? (
        <EditPage 
          isNewFile={isNewFile}
          setNewFileName={setNewFileName}
          fileName={file?.name}
          fileType={fileType}
          fileData={fileData}
          setFileData={setFileData}
          navigateBack={navigateBack}
          setShowDeleteFileMenu={setShowDeleteFileMenu}
          setShowSendFileMenu={setShowSendFileMenu}
          handleSaveFile={handleSaveFile}
        />
      ) : (<></>) }
      { showSendFileMenu ? (
        <SendFileMenu 
          fileReceiverName={fileReceiverName} 
          handleSearchForUser={handleSearchForUser}
          searchUsersList={searchUsersList}
          handleUserClick={handleUserClick}
          handleSendFile={handleSendFile}
          setShowSendFileMenu={setShowSendFileMenu}
        />
      ) : (<></>) }
      { showDeleteFileMenu ? (
        <DeleteFileMenu 
          fileName={file.name} 
          setShowDeleteFileMenu={setShowDeleteFileMenu}
          handleFileDelete={handleFileDelete}
        />
      ) : (<></>) }
    </>
  )
}

export default Home