import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { getSenders, getFileExtensions } from '../../functions';

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

  // Index 0 --> Filter By Extension
  // Index 1 --> Filter By Type
  // Index 2 --> Filter By Sender
  // -1 --> Not filtering
  // 1  --> filtering
  // const [fileFilterOptions, setFileFilterOptions] = useState([-1, -1, -1]);

  const [numActiveFilters, setNumActiveFilters] = useState(0);
  
  // Keeps track of the filters that are currently being used
  const [filterList, setFilterList] = useState({ extensions: [], fileTypes: [], senders: [] });
  // console.log(`${listType}: `, fileFilterOptionLists);

  const handleFilterFiles = (localSelectedGroup, localSelectedOption) => {

    console.log("localSelectedGroup: ", localSelectedGroup);
    console.log("localSelectedOption: ", localSelectedOption);

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

    // if (localSelectedGroup === 1) {
    //   isFilter = fileFilterOptionLists.extensions[localSelectedOption].isSelected;
    //   localFilterList.extensions.push(localSelectedOption)
    //   setFileFilterOptionLists({ ...fileFilterOptionLists, extensions: { ...fileFilterOptionLists.extensions, [localSelectedOption]: { ...[localSelectedOption], isSelected: !isFilter } } });
    // } else if (localSelectedGroup === 2) {
    //   isFilter = fileFilterOptionLists.fileTypes[localSelectedOption];
    //   localFilterList = Array.from(new Set(localFilterList.fileTypes.push(localSelectedOption)));
    //   setFileFilterOptionLists({ ...fileFilterOptionLists, fileTypes: { ...fileFilterOptionLists.fileTypes, [localSelectedOption]: !isFilter } });
    // } else if (localSelectedGroup === 3) {
    //   isFilter = fileFilterOptionLists.senders[localSelectedOption].isSelected;
    //   setFileFilterOptionLists({ ...fileFilterOptionLists, senders: { ...fileFilterOptionLists.senders, [localSelectedOption]: { ...[localSelectedOption], isSelected: !isFilter } } });
    // }

    let localTempFileList = fileList;

    if (localNumActiveFilters === 0) {
      localTempFileList = fileList.map((file) => {
        file.isViewable = 2;
        return file;
      }); 
    } else {

      // ---------------------------------------------

      const extensionsNotEmpty = localFilterList.extensions.length > 0;
      const fileTypesNotEmpty = localFilterList.fileTypes.length > 0;
      const sendersNotEmpty = localFilterList.senders.length > 0;

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
      // ------------------------------------------
      
    //   if (localFilterList.extensions.length > 0) {
    //     // localTempFileList = localTempFileList.filter((file) => localFilterList.extensions.includes(file.extension));
    //     localTempFileList = localTempFileList.map((file) => {
    //       if (localFilterList.extensions.includes(file.extension)) {
    //         file.isViewable = 1;
    //       } else {
    //         file.isViewable = 0;
    //       }
    //       return file;
    //     });
    //   }
    //   if (localFilterList.fileTypes.length > 0) {
    //     // localTempFileList = localTempFileList.filter((file) => localFilterList.fileTypes.includes(file.type));
    //     localTempFileList = localTempFileList.map((file) => {
    //       if (localFilterList.fileTypes.includes(file.type)) {
    //         file.isViewable = 1;
    //       } else {
    //         file.isViewable = 0;
    //       }
    //       return file;
    //     });
    //   }
    //   if (localFilterList.senders.length > 0) {
    //     // localTempFileList = localTempFileList.filter((file) => localFilterList.senders.includes(file.senders));
    //     localTempFileList = localTempFileList.map((file) => {
    //       if (localFilterList.senders.includes(file.senders)) {
    //         file.isViewable = 1;
    //       } else {
    //         file.isViewable = 0;
    //       }
    //       return file;
    //     });
    //   }
    // }

    console.log("localTempFileList: ", localTempFileList);
    console.log("localFilterList: ", localFilterList);    
    console.log("fileFilterOptionLists: ", fileFilterOptionLists);

    setFileList(localTempFileList);
    setReloadFileList(!reloadFileList);

  };

  // const filterFilesByExtension = (selectedOption) => {

  //   let isFilter = fileFilterOptionLists.extensions[selectedOption].isSelected;
  //   let localNumActiveFilters = numActiveFilters;
  //   let localExtensionFilterList = filterList.extensions;

  //   // Check the current state of the selected filter, and switch it
  //   if (isFilter) {
  //     localNumActiveFilters -= 1;
  //     setNumActiveFilters(localNumActiveFilters);
  //     setFileFilterOptionLists({ ...fileFilterOptionLists, extensions: { ...fileFilterOptionLists.extensions, [selectedOption]: { ...[selectedOption], isSelected: 0 } } });
  //     localExtensionFilterList = localExtensionFilterList.filter((extension) => extension !== selectedOption);
  //     // setExtensionFilterList(localExtensionFilterList);
  //   } else {
  //     localNumActiveFilters += 1;
  //     setNumActiveFilters(localNumActiveFilters);
  //     setFileFilterOptionLists({ ...fileFilterOptionLists, extensions: { ...fileFilterOptionLists.extensions, [selectedOption]: { ...[selectedOption], isSelected: 1 } } });
  //     localExtensionFilterList.push(selectedOption);
  //     // setExtensionFilterList(localExtensionFilterList);
  //   }

  //   isFilter = !isFilter;
  //   let localTempFileList = fileList;

  //   // console.log("localNumActiveFilters: ", localNumActiveFilters);

  //   if (localNumActiveFilters === 0) {
  //     localTempFileList = fileList.map((file) => {
  //       file.isViewable = 2;
  //       return file;
  //     }); 
  //   } else {
  //     localTempFileList = localTempFileList.filter((file) => localExtensionFilterList.includes(file.extension));
  //   }

  //   // console.log("localTempFileList: ", localTempFileList);

  //   // setFileFilterOptionLists({ ...fileFilterOptionLists, extensions: newFilterOptionsList });
  //   // let localTempFileList = fileList.map((file) => {
      
  //   //   if (localNumActiveFilters === 0) {
  //   //     file.isViewable = 2;
  //   //   } else {
  //   //     if (isFilter) {
  //   //       if (file.extension === selectedOption) {
  //   //         file.isViewable = 1;
  //   //       } else if (file.isViewable !== 1) {
  //   //         file.isViewable = 0;
  //   //       }
  //   //     } else if (file.extension === selectedOption) {
  //   //       file.isViewable = 0;
  //   //     }
  //   //   }

  //   //   return file;
  //   // });

  //   // console.log(localTempFileList);

  //   setFileList(localTempFileList);
  //   setReloadFileList(!reloadFileList);

  //   // console.log(localTempFileList);
  // };

  // const filerFilesByType = (selectedOption) => {

  //   let isFilter = fileFilterOptionLists.fileTypes[selectedOption];
  //   let localNumActiveFilters = numActiveFilters;

  //   if (isFilter) {
  //     localNumActiveFilters -= 1;
  //     setNumActiveFilters(localNumActiveFilters);
  //     setFileFilterOptionLists({ ...fileFilterOptionLists, fileTypes: { ...fileFilterOptionLists.fileTypes, [selectedOption]: false } });
  //   } else {
  //     localNumActiveFilters += 1;
  //     setNumActiveFilters(localNumActiveFilters);
  //     setFileFilterOptionLists({ ...fileFilterOptionLists, fileTypes: { ...fileFilterOptionLists.fileTypes, [selectedOption]: true } });
  //   }

  //   isFilter = !isFilter;

  //   let localTempFileList = fileList.map((file) => {

  //     if (localNumActiveFilters === 0) {
  //       file.isViewable = 2;
  //     } else {
  //       if (isFilter) {
  //         if (file.type === selectedOption) {
  //           file.isViewable = 1;
  //         } else if (file.isViewable !== 1) {
  //           file.isViewable = 0;
  //         }
  //       } else if (file.type === selectedOption) {
  //         file.isViewable = 0;
  //       }
  //     }
  //     return file;
  //   });

  //   setFileList(localTempFileList);
  //   setReloadFileList(!reloadFileList);
  // };

  // const filterFilesBySender = (selectedOption) => {

  //   let isFilter = fileFilterOptionLists.senders[selectedOption].isSelected;
  //   let localNumActiveFilters = numActiveFilters;

  //   if (isFilter) {
  //     localNumActiveFilters -= 1;
  //     setNumActiveFilters(localNumActiveFilters);
  //     setFileFilterOptionLists({ ...fileFilterOptionLists, senders: { ...fileFilterOptionLists.senders, [selectedOption]: { ...[selectedOption], isSelected: 0 } } });
  //   } else {
  //     localNumActiveFilters += 1;
  //     setNumActiveFilters(localNumActiveFilters);
  //     setFileFilterOptionLists({ ...fileFilterOptionLists, senders: { ...fileFilterOptionLists.senders, [selectedOption]: { ...[selectedOption], isSelected: 1 } } });
  //   }

  //   isFilter = !isFilter;

  //   let localTempFileList = fileList.map((file) => {

  //     if (localNumActiveFilters === 0) {
  //       file.isViewable = 2;
  //     } else {
  //       if (isFilter) {
  //         if (file.sender === selectedOption) {
  //           file.isViewable = 1;
  //         } else if (file.isViewable !== 1) {
  //           file.isViewable = 0;
  //         }
  //       } else if (file.sender === selectedOption) {
  //         file.isViewable = 0;
  //       }
  //     }
  //     return file;
  //   });

  //   setFileList(localTempFileList);
  //   setReloadFileList(!reloadFileList);
  // };

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
              {/* <button className='fileListDisplayFilterOptionButton'>Extension</button> */}
              {/* <button className='fileListDisplayFilterOptionButton'>Sender</button> */}
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

export default SortFilterMenu