import React from 'react'
import DescriptionIcon from '@mui/icons-material/Description';
import EditOffIcon from '@mui/icons-material/EditOff';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import EditIcon from '@mui/icons-material/Edit';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import './FileDescription.css';

const MONTH_LIST = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

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
            {/* <div className='fileDescriptionIconWrapper'>
                <CircleOutlinedIcon style={{ color: 'darkblue', height: '25', width: '25' }}/>
            </div> */}
            <div className='fileDescriptionFileTypeWrapper'>
                { fileType === 'txt' && <DescriptionIcon style={{ color: 'darkblue', height: '25', width: '25' }} /> }
                { fileType === 'pdf' && <PictureAsPdfIcon style={{ color: 'darkblue', height: '25', width: '25' }} />}
                { fileType === 'img' && <ImageIcon style={{ color: 'darkblue', height: '25', width: '25' }} /> }
            </div>
            <div className='fileDescriptionFileNameWrapper'>
                {/* <h3 className='fileDescriptionText'>{file.name}</h3> */}
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
        {/* <FileCard fileName={file.name} fileType={getFileType(file)} /> */}
    </button>
  )
}

export default FileDescription