import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './HomePage.css';
import { useQuery } from 'react-query';
import { getFiles } from '../../functions.js';
import EditPage from '../EditPage/EditPage.js';
import FileListDisplay from '../FileListDisplay/FileListDisplay.js';

const HomePage = () => {

  const userEmail = useSelector((state) => state.userData.email);
  const userFirstName = useSelector((state) => state.userData.firstName);

  const { data: userFiles, refetch: userFilesRefetch } = useQuery({
    queryKey: ["userFiles"],
    queryFn: () => getFiles(userEmail)
  })

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
  
  // Send the user to the file viewing page when they select a file
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

export default HomePage;
