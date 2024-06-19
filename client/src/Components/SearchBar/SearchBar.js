import React, { useState } from 'react'
import './SearchBar.css'

const SearchBar = ({ itemList, handleItemClick }) => {
  
  const [searchItemName, setSearchItemName] = useState('');
  const [searchItemList, setSearchItemList] = useState(itemList);

  const handleSearchForFile = (e) => {

    let localSearchItemName = e.target.value;
    setSearchItemName(localSearchItemName);

    if (localSearchItemName === '') {
      setSearchItemList(itemList);
      return;
    } 

    setSearchItemList(itemList.filter((file) => file.name.search(`(${localSearchItemName})`) !== -1));
      
  };

  return (
    <div className="searchBarWrapper">
      <input 
        className="searchBar"
        type="text"
        placeholder="Search for a file..."
        value={searchItemName}
        onChange={handleSearchForFile}
      />
      { searchItemName !== '' && searchItemList?.length > 0 &&
        <div className='searchSuggestionListWrapper'>
          {searchItemList.map((item) => {
            return (
              <button 
                className='searchSuggestionListButton'
                onClick={() => handleItemClick(item)}
              >
                  {item.name}
              </button>
            )
          })}
        </div>
      }
    </div>
  )
}

export default SearchBar