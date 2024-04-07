import React from 'react'
import FileCard from '../FileCard/FileCard';
import './HomePage.css';

const HomePage = ({ setScreen,
                    setIsNewFile,
                    handleUploadFile,
                    fileData,
                    handleFileClick,
                    handleSearchForFile,
                    searchFileList,
                    searchFileName }) => {

    const getFileType = (localFile) => {

      const fileIdentifierRegex = "(base64)";
      const localFileAllData = localFile.data;
  
      let base64Position = localFileAllData.search(fileIdentifierRegex);
  
      let fileIdentiferInfo = localFileAllData.substring(5, base64Position - 1);
  
      let localFileData = localFileAllData.substring(base64Position + 7, localFileAllData.length);
  
      if (fileIdentiferInfo.substring(0, 4) === 'text') {
        return "txt";
      } else if (fileIdentiferInfo.substring(0, 5) === 'image') {
        return "img";
      } else if (fileIdentiferInfo === 'application/pdf') {
        return "pdf";
      }
      
    }

    return (
        <div className="homeDiv">
          <div className="topSearchWrapper">
            {/* <div className="searchWrapper"> */}
              <input 
                className="homeFileSearchBar"
                type="text"
                placeholder="Search for a file..."
                value={searchFileName} 
                onChange={handleSearchForFile}
              />
              {/* <button className="homeSearchButton">GO</button> */}
            {/* </div> */}
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
          </div>
          <hr></hr>
          <div className="fileGridDiv">
            {fileData?.map((file) => {
              return (
                <button
                  className='fileListButton'
                  onClick={() => handleFileClick(file)}
                >
                  <FileCard fileName={file.name} fileType={getFileType(file)} />
                </button>
            )})}
          </div>
        </div>
    );
}

export default HomePage