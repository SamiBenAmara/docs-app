import React, { useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import './SortFilterMenu.css';

const SortFilterMenu = ({ listType,
                          fileList,
                          setFileList,
                          handleDisplaySortOptions,
                          handleDisplayFilterOptions,
                          displaySortFilterOptions,
                          fileFilterOptionLists,
                          setFileFilterOptionLists,
                          reloadFileList,
                          setReloadFileList }) => {
  
  // 0 --> Name (ASC)
  // 1 --> Name (DESC)
  // 2 --> Date (ASC)
  // 3 --> DATE (DESC)
  const [fileSortOptions, setFileSortOptions] = useState(-1);

  const [numActiveFilters, setNumActiveFilters] = useState(0);
  
  // Keeps track of the filters that are currently being used
  const [filterList, setFilterList] = useState({ extensions: [], fileTypes: [], senders: [] });

  // Filter the user's files based on the selected filters
  const handleFilterFiles = (localSelectedGroup, localSelectedOption) => {

    let localNumActiveFilters = numActiveFilters;
    let localFilterList = filterList;
    let isFilter;
 
    if (localSelectedGroup === 1) {
      // Set or disable filter if the user selected an "extension" filter
      isFilter = fileFilterOptionLists.extensions[localSelectedOption].isSelected;
      if (isFilter) {
        const indexOfExtension = localFilterList.extensions.indexOf(localSelectedOption);
        localFilterList.extensions.splice(indexOfExtension, 1);
        setFileFilterOptionLists({ ...fileFilterOptionLists, extensions: { ...fileFilterOptionLists.extensions, [localSelectedOption]: { isSelected: 0 } } });
      } else {
        localFilterList.extensions.push(localSelectedOption);
        setFileFilterOptionLists({ ...fileFilterOptionLists, extensions: { ...fileFilterOptionLists.extensions, [localSelectedOption]: { isSelected: 1 } } });
      }
    } else if (localSelectedGroup === 2) {
      isFilter = fileFilterOptionLists.fileTypes[localSelectedOption];
      if (isFilter) {
        const indexOfFileType = localFilterList.fileTypes.indexOf(localSelectedOption);
        localFilterList.fileTypes.splice(indexOfFileType, 1);
        setFileFilterOptionLists({ ...fileFilterOptionLists, fileTypes: { ...fileFilterOptionLists.fileTypes, [localSelectedOption]: 0 } });
      } else {
        localFilterList.fileTypes.push(localSelectedOption);
        setFileFilterOptionLists({ ...fileFilterOptionLists, fileTypes: { ...fileFilterOptionLists.fileTypes, [localSelectedOption]: 1 } });
      }
    } else if (localSelectedGroup === 3) {
      isFilter = fileFilterOptionLists.senders[localSelectedOption].isSelected;
      if (isFilter) {
        const indexOfSender = localFilterList.senders.indexOf(localSelectedOption);
        localFilterList.senders.splice(indexOfSender, 1);
        setFileFilterOptionLists({ ...fileFilterOptionLists, senders: { ...fileFilterOptionLists.senders, [localSelectedOption]: { isSelected: 0 } } });
      } else {
        localFilterList.senders.push(localSelectedOption);
        setFileFilterOptionLists({ ...fileFilterOptionLists, senders: { ...fileFilterOptionLists.senders, [localSelectedOption]: { isSelected: 1 }  } });
      }
    }

    localNumActiveFilters = isFilter ? localNumActiveFilters -= 1 : localNumActiveFilters += 1;
    setNumActiveFilters(localNumActiveFilters);
    setFilterList(localFilterList);

    isFilter = !isFilter;

    let localTempFileList = fileList;

    if (localNumActiveFilters === 0) {
      localTempFileList = fileList.map((file) => {
        file.isViewable = 2;
        return file;
      }); 
    } else {

      const extensionsNotEmpty = localFilterList.extensions.length > 0;
      const fileTypesNotEmpty = localFilterList.fileTypes.length > 0;
      const sendersNotEmpty = localFilterList.senders.length > 0;

      // Filter the user's files based on the currently selected filters
      localTempFileList = localTempFileList.map((file) => {

        if (extensionsNotEmpty && !localFilterList.extensions.includes(file.extension)) {
          file.isViewable = 0;
          return file;
        }

        if (fileTypesNotEmpty && !localFilterList.fileTypes.includes(file.type)) {
          file.isViewable = 0;
          return file;
        }

        if (sendersNotEmpty && !localFilterList.senders.includes(file.sender)) {
          file.isViewable = 0;
          return file;
        }

        file.isViewable = 1;
        return file;
      });
    }

    setFileList(localTempFileList);
    setReloadFileList(!reloadFileList);

  };

  // Sort the users' files based on the selected sorting option
  const handleSortFiles = (sortOptionParam) => {

    if (sortOptionParam === 0) {
      setFileList(fileList.sort((file1, file2) => file1.name.localeCompare(file2.name)));
      setFileSortOptions(fileSortOptions === 0 ? -1 : 0);
    } else if (sortOptionParam === 1) {
      setFileList(fileList.sort((file1, file2) => file1.name.localeCompare(file2.name)).reverse());
      setFileSortOptions(fileSortOptions === 1 ? -1 : 1);
    } else if (sortOptionParam === 2) {
      setFileList(fileList.sort((file1, file2) => file1.date.localeCompare(file2.date)));
      setFileSortOptions(fileSortOptions === 2 ? -1 : 2);
    } else if (sortOptionParam === 3) {
      setFileList(fileList.sort((file1, file2) => file1.date.localeCompare(file2.date)).reverse());
      setFileSortOptions(fileSortOptions === 3 ? -1 : 3);
    }

    setReloadFileList(!reloadFileList);
  };

  return (
    <div className='fileListDisplaySortFilterWrapper'>
        <div className='fileListDisplaySortWrapper'>
          <button
            className='fileListDisplaySortFilterButton'
            onClick={handleDisplaySortOptions}
          >
            Sort
            <ArrowDropDownIcon />
          </button>
          { displaySortFilterOptions === 1 &&
            <div className='fileListDisplaySortOptions'>
              <button
                className='fileListDisplaySortOptionButton'
                onClick={() => handleSortFiles(0)}
                style={{ backgroundColor: fileSortOptions === 0 ? "rgb(0, 0, 0, 0.25)" : "white" }}
              >
                Name (ASC)
              </button>
              <button
                className='fileListDisplaySortOptionButton'
                onClick={() => handleSortFiles(1)}
                style={{ backgroundColor: fileSortOptions === 1 ? "rgb(0, 0, 0, 0.25)" : "white" }}
              >
                Name (DESC)
              </button>
              <button 
                className='fileListDisplaySortOptionButton'
                onClick={() => handleSortFiles(2)}
                style={{ backgroundColor: fileSortOptions === 2 ? "rgb(0, 0, 0, 0.25)" : "white" }}
              >
                Date (ASC)
              </button>
              <button
                className='fileListDisplaySortOptionButton'
                onClick={() => handleSortFiles(3)}
                style={{ backgroundColor: fileSortOptions === 3 ? "rgb(0, 0, 0, 0.25)" : "white" }}
              >
                Date (DESC)
              </button>
            </div>
          }
        </div>
        <div className='fileListDisplayFilterWrapper'>
          <button
            className='fileListDisplaySortFilterButton'
            onClick={handleDisplayFilterOptions}
          >
            Filter
            <ArrowDropDownIcon />
          </button>
          { displaySortFilterOptions === 2 &&
            <div className='fileListDisplayFilterOptions'>
              <h4 className='fileListDisplayFilterOptionsHeaderText'>Extensions</h4>
              <hr className='fileListDisplayFilterHorizontalLine' />
              <div className='fileListDisplayFilterOptionsExtensionList'>
                {Object.keys(fileFilterOptionLists?.extensions)?.map((extension) => {
                  return (
                    <button
                      className='fileListDisplayFilterOptionsButton'
                      style={{ backgroundColor: fileFilterOptionLists.extensions[extension].isSelected === 1 ? "rgb(0, 0, 0, 0.25)" : "white" }}
                      onClick={() => handleFilterFiles(1, extension)}
                    >
                      {extension}
                    </button>
                  );
                })}
              </div>
              <h4 className='fileListDisplayFilterOptionsHeaderText'>File Type</h4>
              <div className='fileListDisplayFilterOptionsFileTypeList'>
                <hr className='fileListDisplayFilterHorizontalLine' />
                <button 
                  className='fileListDisplayFilterOptionsButton'
                  onClick={() => handleFilterFiles(2, "pdf")}
                  style={{ backgroundColor: fileFilterOptionLists.fileTypes["pdf"] ? "rgb(0, 0, 0, 0.25)" : "white" }}
                >
                  PDF File
                </button>
                <button
                  className='fileListDisplayFilterOptionsButton'
                  onClick={() => handleFilterFiles(2, "img")}
                  style={{ backgroundColor: fileFilterOptionLists.fileTypes["img"] ? "rgb(0, 0, 0, 0.25)" : "white" }}
                >
                  Image File
                </button>
                <button
                  className='fileListDisplayFilterOptionsButton'
                  onClick={() => handleFilterFiles(2, "txt")}
                  style={{ backgroundColor: fileFilterOptionLists.fileTypes["txt"] ? "rgb(0, 0, 0, 0.25)" : "white" }}
                >
                  Text File
                </button>
              </div>
              {listType === 1 &&
                <>
                  <h4 className='fileListDisplayFilterOptionsHeaderText'>Senders</h4>
                  <hr className='fileListDisplayFilterHorizontalLine' />
                  <div className='fileListDisplayFilterOptionsSenderList'>
                    {Object.keys(fileFilterOptionLists?.senders)?.map((sender) => {
                      return (
                        <button
                          className='fileListDisplayFilterOptionsButton'
                          onClick={() => handleFilterFiles(3, sender)}
                          style={{ backgroundColor: fileFilterOptionLists.senders[sender].isSelected === 1 ? "rgb(0, 0, 0, 0.25)" : "white" }}
                        >
                          {sender}
                        </button>
                      );
                    })}
                  </div>
                </>
              }
          </div>
        }
      </div>
    </div>
  )
}

export default SortFilterMenu;
