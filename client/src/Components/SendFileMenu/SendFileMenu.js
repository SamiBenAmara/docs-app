import React from 'react';
import './SendFileMenu.css';

const SendFileMenu = ({ fileReceiverName, 
                        handleSearchForUser, 
                        searchUsersList, 
                        handleUserClick, 
                        handleSendFile, 
                        setShowSendFileMenu }) => {
  
  return (
      <div className='sendFileOuterMenuWrapper'>
        <div className='sendFileInnerMenuWrapper'>
          <h1 style={{marginLeft: '30px'}}>Search for a user</h1>
          <input 
            className="sendFileMenuSearchBar" 
            type="text"
            placeholder="Search for a user..."
            value={fileReceiverName}
            onChange={handleSearchForUser}
          />
          <div className='userSearchSuggestionListWrapper'>
            {searchUsersList.map((user) => {
              return (
                <div className='userSearchSuggestionListBox'>
                  <button 
                    className='userSearchSuggestionListButton'
                    onClick={() => handleUserClick(user.username)}
                  >
                      {user.username}
                  </button>
                </div>
              )
          })}
          </div>           
          <div className='sendFileMenuButtonWrapper'>
            <button className='sendFileMenuCancelButton' onClick={() => setShowSendFileMenu(false)}>
              Cancel
            </button>
            <button 
              className='sendFileMenuSendButton'
              onClick={handleSendFile}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
}

export default SendFileMenu