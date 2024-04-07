import React from 'react';
import DescriptionIcon from '@mui/icons-material/Description';
import './FileCard.css';

const FileCard = ({ fileName, fileType }) => {
  
  const displayFileName = () => {

    if (fileName.length > 10) {
      return `${fileName.substring(0, 5)}...`;
    } else {
      return `${fileName}`;
    }

  };
  
  return (
    <div className="fileCardDiv">
        <DescriptionIcon style={{ color: 'white', height: '100', width: '100' }}/>
        <h1 className="fileNameH1">{displayFileName()}</h1>
        {fileName.length > 10 ? (
          <h2 className='fileNameH2'>{`(.${fileType})`}</h2>
        ) : (<></>)}
    </div>
  )
}

export default FileCard