import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import SearchBar from '../SearchBar/SearchBar';
import FileDescription from '../FileDescription/FileDescription';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import RecyclingIcon from '@mui/icons-material/Recycling';
import HomeIcon from '@mui/icons-material/Home';
import { uploadFile, getSenders, getFileExtensions } from '../../functions.js';
import './FileListDisplay.css';
import SortFilterMenu from '../SortFilterMenu/SortFilterMenu.js';

// const LIST_NAMES = ["My&nbspFiles", "Inbox", "Recycle&nbspBin"];

const MAIN_CONTAINER_HEIGHTS = ["620px", "300px", "300px"];
const FILE_GRID_HEIGHTS = ["510px", "190px", "190px"];

const FileListDisplay = ({ listType, fileListProp, handleFileClick, userFilesRefetch, setEditOrNewFile }) => {
  
  const userEmail = useSelector((state) => state.userData.email);

  const { data: senderData, refetch: senderDataRefetch } = useQuery({
    queryKey: ["userSenders"],
    queryFn: () => getSenders(userEmail)
    // queryFn: () => getSenders(localStorage.getItem("userEmail"))
  });

  const { data: fileExtensionData, refetch: fileExtensionRefetch } = useQuery({
    queryKey: ["userFileExtensions"],
    queryFn: () => getFileExtensions(userEmail)
    // queryFn: () => getFileExtensions(localStorage.getItem("userEmail"))
  })

  // console.log("senderData: ", senderData);
  // console.log("fileExtensionData: ", fileExtensionData);

  /* For the fileTypes array:
   * Index 0 --> PDF
   * Index 1 --> IMAGE
   * Index 2 --> TEXT
   */
  const [fileFilterOptionLists, setFileFilterOptionLists] = useState({
    extensions: listType === 0 ? fileExtensionData?.myFiles : listType === 1 ? fileExtensionData?.inbox : fileExtensionData?.recycle,
    fileTypes: { pdf: 0, img: 0, txt: 0 },
    senders: senderData
  });

  // 0 --> Neither
  // 1 --> Display Sort
  // 2 --> Display Filter
  const [displaySortFilterOptions, setDisplaySortFilterOptions] = useState(0);

  const [fileList, setFileList] = useState(fileListProp);

  const [reloadFileList, setReloadFileList] = useState(false);

  useEffect(() => {
    setFileList(fileListProp);

    // let localFileTypesArray = [false, false, false];

    // fileListProp?.forEach((file) => {
    //   let localTempFileType = getFileType(file);
      
    //   if (localTempFileType === "pdf") {
    //     localFileTypesArray[0] = true;
    //   } else if (localTempFileType === "img") {
    //     localFileTypesArray[1] = true;
    //   } else if (localTempFileType === "txt") {
    //     localFileTypesArray[2] = true;
    //   }

    //   if (localFileTypesArray[0] && localFileTypesArray[1] && localFileTypesArray[2]) {
    //     return;
    //   }
    // });

    setFileFilterOptionLists({
      // extensions: Array.from(new Set(fileListProp?.map((file) => file = { name: `.${file.name.split('.')[1]}`, isSelected: 0 }))),
      // extensions: handleSetFilterOptionsListsExtensions,
      // extensions: fileExtensionData,
      extensions: listType === 0 ? fileExtensionData?.myFiles : listType === 1 ? fileExtensionData?.inbox : fileExtensionData?.recycle,
      fileTypes: { pdf: 0, img: 0, txt: 0 },
      senders: senderData
      // senders: handleSetFilterOptionsListsSenders
      // senders: Array.from(new Set(fileListProp?.map((file) => file = { name: file.sender, isSelected: 0 })))
    });

  }, [fileListProp, fileExtensionData, listType, senderData]);

  // console.log("senderData: ", senderData);
  // console.log("fileExtensionData: ", fileExtensionData);

  useEffect(() => {
    setFileList(fileList);
  }, [reloadFileList, fileList]);

  const handleInputClick = (e) => {
    e.target.value = '';
  };

  const handleUploadFile = async (e) => {
    
      let localFile = e.target.files[0];
      let fileName = localFile.name;
      let reader = new FileReader();
      reader.readAsDataURL(localFile);
  
      reader.onload = async function () {
        console.log(reader.result);
  
        try {
          
          let formData = {
            // email: localStorage.getItem('userEmail'),
            email: userEmail,
            fileName: fileName,
            fileData: reader.result,
            date: new Date()
          }
  
          await uploadFile(formData);
          userFilesRefetch();
  
        } catch (err) {
          console.log(err.message);
        }
      }
  
      reader.onerror = function (error) {
        console.log('Error: ', error)
      }
  };

  const handleDisplaySortOptions = () => {
    if (displaySortFilterOptions === 1) {
      setDisplaySortFilterOptions(0);
    } else {
      setDisplaySortFilterOptions(1);
    }
  };

  const handleDisplayFilterOptions = () => {
    if (displaySortFilterOptions === 2) {
      setDisplaySortFilterOptions(0);
    } else {
      setDisplaySortFilterOptions(2);
    }
  };
  
  // console.log("fileList: ", fileList);

  return (
    <div className='fileListDisplayMainWrapper' style={{ height: MAIN_CONTAINER_HEIGHTS[listType] }}>
      <div className='fileListDisplayHeaderWrapper'>
        <div className='fileListDisplayIconTextWrapper'>
          {listType === 0 &&
            <>
              <HomeIcon style={{ height: '50', width: '50', marginRight: '10px' }} />
              <h1 style={{ fontWeight: '400' }} >My&nbsp;Files</h1>
            </>
          }
          {listType === 1 &&
            <>
              <MoveToInboxIcon style={{ height: '50', width: '50', marginRight: '10px' }} />
              <h1 style={{ fontWeight: '400' }} >Inbox</h1>
            </>
          }
          {listType === 2 &&
            <>
              <RecyclingIcon style={{ height: '50', width: '50', marginRight: '10px' }} />
              <h1 style={{ fontWeight: '400' }} >Recycle&nbsp;Bin</h1>
            </>
          }
        </div>
        {listType === 0 ? (
          <div className='myFilesSearchWrapper'>
            <SearchBar
              // searchFileName={searchInboxFileName}
              // handleSearchForFile={(e) => handleSearchForFile(e, 1)}
              itemList={fileList}
              handleItemClick={handleFileClick}
            />
            <div className="addButtonWrapper"> 
              <button className="addButton" onClick={() => setEditOrNewFile(0)}>New File</button>
              <label for="file-upload" class="uploadFileButton">
                <input className="uploadFileInput" id="file-upload" type='file' onClick={handleInputClick} onChange={handleUploadFile} />
                Upload File
              </label>
            </div>
          </div>    
        ) : (
          <div className='fileListDisplaySearchBarWrapper'>
            <SearchBar
              itemList={fileList}
              handleItemClick={handleFileClick}
            />
          </div>
        )}
        <SortFilterMenu
          listType={listType}
          fileList={fileList}
          setFileList={setFileList}
          handleDisplaySortOptions={handleDisplaySortOptions}
          handleDisplayFilterOptions={handleDisplayFilterOptions}
          displaySortFilterOptions={displaySortFilterOptions}
          fileFilterOptionLists={fileFilterOptionLists}
          setFileFilterOptionLists={setFileFilterOptionLists}
          reloadFileList={reloadFileList}
          setReloadFileList={setReloadFileList}
        />
      </div>
      <hr className='fileListDisplayHorizontalLine' />
      <div className='fileListDisplayMenuWrapper'>
        <div className='fileListDisplayFileGridDiv' style={{ height: FILE_GRID_HEIGHTS[listType] }}>

          { fileList?.length === 0 && <p style={{ fontSize: 'xx-large', fontStyle: 'italic', textAlign: 'center' }}>No files available</p> }

          { fileList?.map((file) => (
            file.isViewable > 0 ? (
              <FileDescription file={file} handleFileClick={handleFileClick} />
            ) : null
          ))}
        </div>
      </div>
    </div>
  )
}

export default FileListDisplay