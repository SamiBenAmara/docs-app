import React from 'react'
import DescriptionIcon from '@mui/icons-material/Description';
import EditOffIcon from '@mui/icons-material/EditOff';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EditIcon from '@mui/icons-material/Edit';
import './FileDescription.css';

const MONTH_LIST = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const FileDescription = ({ file, handleFileClick }) => {
  
  let fileType = file.type;

  const displayDate = () => {

    let tempDate = "";

    tempDate = file.date.substring(0, 10);

    let tempNewMonth = MONTH_LIST[(parseInt(tempDate.substring(5, 7))) - 1];

    let tempNewDay = `${parseInt(tempDate.substring(8, 10))}`;

    let tempNewYear = `${tempDate.substring(0, 4)}`;

    return `${tempNewMonth} ${tempNewDay}, ${tempNewYear}`;
  };

  // Display a shortened version of the file name if it's longer than 10 characters, otherwise display the full name
  const displayFileName = () => {

    let localSplitFileName = file.name.split('.');
    if (localSplitFileName[0].length > 10) {
        return `${localSplitFileName[0].substring(0, 10)}...(.${localSplitFileName[1]})`;
    } else {
        return file.name;
    }

  };
  
  return (
    <button
        className='fileDescriptionListButton'
        onClick={() => handleFileClick(file)}
    >
        <div className='fileDescriptionListButtonInteriorWrapper'>
            <div className='fileDescriptionFileTypeWrapper'>
                { fileType === 'txt' && <DescriptionIcon style={{ color: 'darkblue', height: '25', width: '25' }} /> }
                { fileType === 'pdf' && <PictureAsPdfIcon style={{ color: 'darkblue', height: '25', width: '25' }} />}
                { fileType === 'img' && <ImageIcon style={{ color: 'darkblue', height: '25', width: '25' }} /> }
            </div>
            <div className='fileDescriptionFileNameWrapper'>
                <h3 className='fileDescriptionText'>{displayFileName()}</h3>
            </div>
            <div className='fileDescriptionDateCreatedWrapper'>
                <h3 className='fileDescriptionText'>{displayDate()}</h3>
            </div>
            <div className='fileDescriptionEditPermissionsWrapper'>
                { fileType === 'txt' ? (
                    <EditIcon style={{ color: 'darkblue', height: '25', width: '25' }} />
                ) : (
                    <EditOffIcon style={{ color: 'darkblue', height: '25', width: '25' }} />
                ) }
            </div>
            {file.binNumber === 1 && 
                <div className='fileDescriptionSenderWrapper'>
                    <h3 className='fileDescriptionText'>Sender: <b>{file.sender}</b></h3>
                </div>
            }
        </div>
    </button>
  )
}

export default FileDescription