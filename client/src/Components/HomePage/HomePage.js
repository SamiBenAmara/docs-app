import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import FileCard from '../FileCard/FileCard';
import DescriptionIcon from '@mui/icons-material/Description';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import RecyclingIcon from '@mui/icons-material/Recycling';
import HomeIcon from '@mui/icons-material/Home';
import './HomePage.css';
import FileDescription from '../FileDescription/FileDescription';
import MenuIcon from '@mui/icons-material/Menu';
import SearchBar from '../SearchBar/SearchBar';
import { Menu } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useQuery } from 'react-query';
import { uploadFile, getFiles, getAllUsers, sendFile, deleteFile, saveFileChanges, getInboxFiles, getRecycleBinFiles, acceptReceivedFile, rejectReceivedFile, restoreDeletedFile } from '../../functions.js';
import EditPage from '../EditPage/EditPage.js';
import SortFilterMenu from '../SortFilterMenu/SortFilterMenu.js';
import FileListDisplay from '../FileListDisplay/FileListDisplay.js';

// setScreen,
// setIsNewFile,
// handleUploadFile,
// fileData,
// handleFileClick,
// handleSearchForFile,
// searchMyFilesFileList,
// searchMyFilesFileName,
// searchInboxFileList,
// searchInboxFileName,
// searchRecycleFileList,
// searchRecycleFileName

const HomePage = () => {

  const userEmail = useSelector((state) => state.userData.email);
  const userFirstName = useSelector((state) => state.userData.firstName);

  // console.log("userEmail: ", userEmail);
  // console.log("userFirstName: ", userFirstName);

  const { data: userFiles, refetch: userFilesRefetch } = useQuery({
    queryKey: ["userFiles"],
    queryFn: () => getFiles(userEmail)
    // queryFn: () => getFiles(localStorage.getItem('userEmail'))
  })

  // console.log("userFiles: ", userFiles);

  const [showMyFilesDropDown, setShowMyFilesDropDown] = useState(false);

  // 0  --> new file
  // 1  --> editing a file
  // -1 --> neither
  const [editOrNewFile, setEditOrNewFile] = useState(-1);
  const [selectedFile, setSelectedFile] = useState({
    name: '',
    data: '',
    type: '',
    date: '',
    binNumber: 0,
    extension: ''
  });

  // console.log("userFiles: ", userFiles);
  
  // 0 - my file, 1 - inbox, 2 - recycling bin
  const handleFileClick = (localFile) => {

    const fileIdentifierRegex = "(base64)";
    const localFileAllData = localFile?.data;

    let base64Position = localFileAllData.search(fileIdentifierRegex);

    let fileIdentiferInfo = localFileAllData.substring(5, base64Position - 1);

    let localFileData = localFileAllData.substring(base64Position + 7, localFileAllData.length);

    if (fileIdentiferInfo.substring(0, 4) === 'text') {
      setSelectedFile({
        name: localFile.name,
        data: localFileData,
        type: 'text',
        date: localFile.date,
        binNumber: localFile.binNumber,
        sender: localFile.sender,
        extension: `.${localFile.name.split('.')[1]}`
      });
    } else if (fileIdentiferInfo.substring(0, 5) === 'image') {
      setSelectedFile({
        name: localFile.name,
        data: localFileAllData,
        type: 'image',
        date: localFile.date,
        binNumber: localFile.binNumber,
        sender: localFile.sender,
        extension: `.${localFile.name.split('.')[1]}`
      });
    } else if (fileIdentiferInfo === 'application/pdf') {
      setSelectedFile({
        name: localFile.name,
        data: localFileAllData,
        type: 'pdf',
        date: localFile.date,
        binNumber: localFile.binNumber,
        sender: localFile.sender,
        extension: `.${localFile.name.split('.')[1]}`
      });
    }

    setEditOrNewFile(1);
  }

  return (
    <div className="homeDiv">
      { editOrNewFile === 0 || editOrNewFile === 1 ? (
        <EditPage
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          editOrNewFile={editOrNewFile}
          setEditOrNewFile={setEditOrNewFile}
          userFilesRefetch={userFilesRefetch}
        />
      ) : (
        <div>
          <div className='welcomeMessageWrapper'>
            <h1 className='welcomeMessageText'>{`Welcome, ${userFirstName}`}</h1>
            {/* <h1 className='welcomeMessageText'>{`Welcome, ${localStorage.getItem('userFirstName')}`}</h1> */}
          </div>
          <hr style={{ width: '95%' }} />
          <div className='fileDisplayWrapper'>
            <div className='inboxRecycleWrapper'>
              <FileListDisplay
                listType={1}
                fileListProp={userFiles?.inboxFiles}
                handleFileClick={handleFileClick}
                userFilesRefetch={userFilesRefetch}
                setEditOrNewFile={setEditOrNewFile}
              />
              <FileListDisplay
                listType={2}
                fileListProp={userFiles?.recycledFiles}
                handleFileClick={handleFileClick}
                userFilesRefetch={userFilesRefetch}
                setEditOrNewFile={setEditOrNewFile}
              />
            </div>
            <div className='myFilesWrapper'>
              <FileListDisplay
                listType={0}
                fileListProp={userFiles?.myFiles}
                handleFileClick={handleFileClick}
                userFilesRefetch={userFilesRefetch}
                setEditOrNewFile={setEditOrNewFile}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage

// const handleChangeMyFilesDropDown = () => {
//   setShowMyFilesDropDown(!showMyFilesDropDown);
// }

/* <div className="topSearchWrapper">
              <input 
                className="homeFileSearchBar"
                type="text"
                placeholder="Search for a file..."
                value={searchFileName} 
                onChange={handleSearchForFile}
              />
            { searchFileName !== '' ? (
              <div className='fileSearchSuggestionListWrapper'>
                {searchFileList.map((file) => {
                  return (
                    <div className='fileSearchSuggestionListBox'>
                      <button 
                        className='fileSearchSuggestionListButton'
                        onClick={() => handleFileClick(file)}
                      >
                          {file.name}
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : (<></>)}
            <div className="addButtonWrapper"> 
              <button 
                className="addButton"
                onClick={() => {
                  setScreen('edit');
                  setIsNewFile(true);
                }}
              >
                Create New File
              </button>
              <label for="file-upload" class="uploadFileButton">
                <input
                  className="uploadFileInput" 
                  id="file-upload" 
                  type='file'
                  onChange={handleUploadFile} />
                Upload File
              </label>
            </div>
          </div>*/

// <button
//   className='fileListButton'
// >
//   <div className='fileListButtonInteriorWrapper'>
//     <DescriptionIcon style={{ color: 'darkblue', height: '25', width: '25' }} />
//     <h3>{file.name}</h3>
//     <h3>{getFileType(file)}</h3>
//     <h3>Date Sent</h3>
//     <h3>Sender Name</h3>
//   </div>
// </button>

// <FileDescription 
//   file={file}
//   handleFileClick={handleFileClick}
//   getFileType={getFileType}
// />
// <button
//   className='fileListButton'
//   onClick={() => handleFileClick(file)}
// >
//   <div className='fileListButtonInteriorWrapper'>
//     <DescriptionIcon style={{ color: 'darkblue', height: '25', width: '25' }}/>
//     <h3>{file.name}</h3>
//     <h3>{getFileType(file)}</h3>
//     <h3>Date Created</h3>
//   </div>
//   {/* <FileCard fileName={file.name} fileType={getFileType(file)} /> */}
// </button>

/* <div className='myFilesButtonWrapper'>
    <button 
      className="addButton"
      onClick={() => {
        setScreen('edit');
        setIsNewFile(true);
      }}
    >
      New File
    </button>
    <label for="file-upload" class="uploadFileButton">
      <input
        className="uploadFileInput" 
        id="file-upload" 
        type='file'
        onChange={handleUploadFile} />
      Upload File
    </label>
    </div> */

/* <button
                    className='myFilesDropDownButton'
                    onClick={handleChangeMyFilesDropDown}
                  >
                    <ArrowDropDownIcon />
                  </button>
                  {showMyFilesDropDown && 
                    <div className='myFilesDropDownMenuWrapper'>
                      <button 
                        className='myFilesDropDownMenuButton'
                        onClick={() => {
                          setEditOrNewFile(0);
                          setShowMyFilesDropDown(false);
                        }}
                        // onClick={() => {
                        //   setScreen('edit');
                        //   setIsNewFile(true);
                        // }}
                      >
                        New File
                      </button>
                      <label
                        htmlFor="file-upload"
                        className="uploadFileButtonDropDown"
                      >
                        Upload File
                        <input
                          className="uploadFileInputDropDown" 
                          id="file-upload" 
                          type="file"
                          onChange={handleUploadFile} 
                        />
                      </label>
                      <button 
                        className='myFilesDropDownMenuButton'
                        onClick={() => {
                          setShowSortFilterMenu(0);
                          setShowMyFilesDropDown(false);
                        }}
                      >
                        Sort & Filter
                      </button>
                    </div>
                  } */

/* <button
                    className='myFilesDropDownButton'
                    onClick={() => setShowSortFilterMenu(1)}
                  >
                    <ArrowDropDownIcon />
                  </button>
                  { showSortFilterMenu === 1 && 
                    <SortFilterMenu
                      showSortFilterMenu={showSortFilterMenu}
                      setShowSortFilterMenu={setShowSortFilterMenu}
                    />
                  } */

/* <SearchBar 
                    searchFileName={searchMyFilesFileName}
                    handleSearchForFile={(e) => handleSearchForFile(e, 0)}
                    searchFileList={searchMyFilesFileList}
                    handleFileClick={handleFileClick}
                  /> */

/* <SearchBar
                    searchFileName={searchRecycleFileName}
                    handleSearchForFile={(e) => handleSearchForFile(e, 2)}
                    searchFileList={searchRecycleFileList}
                    handleFileClick={handleFileClick}
                  /> */

/* <button 
                    className='myFilesDropDownButton'
                    onClick={() => setShowSortFilterMenu(2)}  
                  >
                    <ArrowDropDownIcon />
                  </button>
                  { showSortFilterMenu === 2 && 
                    <SortFilterMenu 
                      showSortFilterMenu={showSortFilterMenu}
                      setShowSortFilterMenu={setShowSortFilterMenu}
                    /> 
                  } */

/* <div className='recycleBinWrapper'>
                <div className='recycleBinHeaderWrapper'>
                  <div className='inboxIconTextWrapper'>
                    <RecyclingIcon style={{ height: '50', width: '50', marginRight: '10px' }} />
                    <h1 style={{ fontWeight: '400' }} >Recycle Bin</h1>
                  </div>
                  <SearchBar
                    // searchFileName={searchInboxFileName}
                    // handleSearchForFile={(e) => handleSearchForFile(e, 1)}
                    itemList={userFiles?.recycledFiles}
                    handleItemClick={handleFileClick}
                  />
                </div>
                <hr className='inboxHorizontalLine' />
                <div className='inboxRecycleFileGridDiv'>
                { userFiles?.recycledFiles?.length === 0 && <p style={{ fontSize: 'xx-large', fontStyle: 'italic', textAlign: 'center' }}>No files available</p> }
                  { userFiles?.recycledFiles?.map((file) => (
                    
                    // (file.binNumber === 2 || file.binNumber === 3) &&
                    <FileDescription 
                      file={file}
                      handleFileClick={handleFileClick}
                      getFileType={getFileType}
                    />
                  ))}
                </div>
              </div> */

/* <div className='myFilesWrapper'>
              <div className='myFilesHeaderWrapper'>
                <div className='inboxIconTextWrapper'>
                  <HomeIcon style={{ height: '50', width: '50', marginRight: '10px' }} />
                  <h1 style={{ marginRight: '80px', fontWeight: '400' }} >My Files</h1>
                </div>
                <div className='myFilesSearchWrapper'>
                  <SearchBar
                    // searchFileName={searchInboxFileName}
                    // handleSearchForFile={(e) => handleSearchForFile(e, 1)}
                    itemList={userFiles?.myFiles}
                    handleItemClick={handleFileClick}
                  />
                  <div className="addButtonWrapper"> 
                    <button 
                      className="addButton"
                      onClick={() => {
                        // setScreen('edit');
                        // setIsNewFile(true);
                      }}
                    >
                      New File
                    </button>
                    <label for="file-upload" class="uploadFileButton">
                      <input
                        className="uploadFileInput" 
                        id="file-upload" 
                        type='file'
                        onChange={handleUploadFile} 
                      />
                      Upload File
                    </label>
                  </div>
                </div>
                { showSortFilterMenu === 0 && 
                  <SortFilterMenu 
                    showSortFilterMenu={showSortFilterMenu}
                    setShowSortFilterMenu={setShowSortFilterMenu}
                  /> 
                }
              </div>
              <hr className='inboxHorizontalLine' />
              <div className="fileGridDiv">

                {userFiles?.myFiles?.length === 0 && 
                  <p style={{ 
                      fontSize: 'xx-large', 
                      fontStyle: 'italic',
                      textAlign: 'center' }}>No files available</p>
                }

                {userFiles?.myFiles?.map((file) => (
                   
                  //  file.binNumber === 0 &&
                  <FileDescription 
                    file={file}
                    handleFileClick={handleFileClick}
                    getFileType={getFileType}
                  />
                ))}
              </div>
            </div> */