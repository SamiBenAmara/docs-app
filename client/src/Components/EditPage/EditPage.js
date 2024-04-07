import React from 'react';
import './EditPage.css';

const EditPage = ({ isNewFile,
                    setNewFileName,
                    fileName,
                    fileType,
                    fileData,
                    setFileData,
                    navigateBack,
                    setShowDeleteFileMenu,
                    setShowSendFileMenu,
                    handleSaveFile
}) => {
    return (
        <div className="editScreenContainer">
          {isNewFile ? (
            <input 
              className="homeFileSearchBar" 
              type="text" 
              placeholder="Enter new file name"
              onChange={(e) => setNewFileName(e.target.value)}
              style={{
                marginTop: '50px',
                marginBottom: '20px'
              }}
            />
          ) : (
            <h1 style={{ color: 'white' }}>{fileName}</h1>
          )}
          { fileType === 'text' ? (
            <textarea
              value={atob(fileData)}  
              onChange={(e) => setFileData(btoa(e.target.value))}
              style={{
                backgroundColor: 'white',
                width: '75%',
                height: '650px',
                padding: '15px'
              }}
            />
          ) : (<></>) }
          { fileType === 'image' ? (
            <img 
              src={fileData} 
              alt="" 
              className='editScreenImage'
            />
          ) : (<></>) }
          { fileType === 'pdf' ? (
            <embed src={fileData} height="1000x" width="600px"/>
          ) : (<></>) }
          <div className='editScreenButtonWrapper'>
            <button className='editScreenButton' onClick={navigateBack}>
              Go Back
            </button>
            { isNewFile === false ? (
              <button 
                className='editScreenButton' 
                onClick={() => setShowDeleteFileMenu(true)}
              >
                Delete
              </button>
            ) : (<></>) }
            {isNewFile === false ? (
              <button className='editScreenButton' onClick={() => setShowSendFileMenu(true)}>
                Send
              </button>
            ) : (<></>)}
            { fileType === 'text' ? (
              <button className='editScreenButton' onClick={handleSaveFile}>
                Save
              </button>
            ) : (<></>) }
          </div>
        </div>
    )
}

export default EditPage