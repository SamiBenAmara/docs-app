const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Get all of a users files
router.get('/getfiles', async (req, res) => {

    const email = req.query.email;

    try {

        const user = await User.findOne({ email: email });

        // Add a "viewable" property to the files before sending them to the frontend

        let userFiles = user.files.filter((file) => file.binNumber === 0);
        let userInboxFiles = user.files.filter((file) => file.binNumber === 1);
        let userRecycleFiles = user.files.filter((file) => file.binNumber === 2 || file.binNumber === 3);

        const allFiles = {
            myFiles: userFiles,
            inboxFiles: userInboxFiles,
            recycledFiles: userRecycleFiles
        }

        res.status(200).json(allFiles);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Upload file
router.patch('/uploadfile', async (req, res) => {

    const email = req.body.email;
    const fileName = req.body.fileName;

    try {

        const user = await User.findOne({ email: email });
        let tempFile = {
            name: fileName,
            data: req.body.fileData,
            date: req.body.date,
            type: getFileType(req.body.fileData),
            isViewable: 2,
            extension: fileName.split('.')[1],
            binNumber: 0
        };

        // If the new file has the same name as an existing file, add "_copy" to the end of its name
        if (user.files.filter((file) => file.name === fileName).length > 0) {
            let splitFileName = fileName.split('.');
            splitFileName[0] = splitFileName[0].concat("_copy");
            tempFile.name = splitFileName.join('.');
        }

        user.files.push(tempFile);
        await user.save();

        return res.status(200).json(1);

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Send file to another user
router.patch('/sendfile', async (req, res) => {

    const senderEmail = req.body.email;
    const fileName = req.body.fileName;
    const receiverUsernames = req.body.usernamesList;
    
    try {

        const sender = await User.findOne({ email: senderEmail });
        const fileToTransfer = sender.files.find((file) => file.name === fileName)

        let fileToTransferObject = {
            name: fileToTransfer.name,
            data: fileToTransfer.data,
            date: new Date(),
            sender: sender.userName,
            type: fileToTransfer.type,
            isViewable: 2,
            extension: fileToTransfer.extension,
            binNumber: 1
        }

        // Send the selected file to each of the selected users
        receiverUsernames.forEach(async (user) => {

            const receiver = await User.findOne({ userName: user });

            receiver.files.push(fileToTransferObject);
            await receiver.save();

        });

        return res.status(200).json(1);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

// Edit a file
router.patch('/savefilechanges', async (req, res) => {

    try {

        const user = await User.findOne({ email: req.body.email });
        const fileToUpdate = user.files.find((file) => file.name === req.body.fileName);
        fileToUpdate.data = req.body.fileData;

        await user.save();
        return res.status(200).json(1);

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

});

// Delete a file
router.delete('/deletefile', async (req, res) => {

    try {

        const user = await User.findOne({ email: req.body.email });
        
        const fileToDelete = user.files.find((file) => file.name === req.body.fileName);
        
        // Send the selected file to the recycling bin, or delete it completely based on where it currently is
        if (fileToDelete.binNumber === 0) {
            fileToDelete.binNumber = 2;
        } else if (fileToDelete.binNumber === 1) {
            fileToDelete.binNumber = 3;
        } else if (fileToDelete.binNumber === 2 || fileToDelete.binNumber === 3) {
            const fileToDeleteIndex = user.files.indexOf(fileToDelete);
            user.files.splice(fileToDeleteIndex, 1);
        } else {
            res.status(500).json({ message: err.message });
        }    
        
        await user.save();
        res.status(200).json(1);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Accept a file from a users inbox
router.patch('/acceptfile', async (req, res) => {

    try {

        const user = await User.findOne({ email: req.body.email });

        let fileToAccept = user.files.find((file) => file.name === req.body.fileName);
        fileToAccept.binNumber = 0;
        
        await user.save();
        res.status(200).json(1);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

// Delete a file from a users inbox
router.delete('/rejectfile', async (req, res) => {

    try {
        const user = await User.findOne({ email: req.body.email });

        let fileToDelete = user.files.find((file) => file.name === req.body.fileName);
        fileToDelete.binNumber = 3;
        
        await user.save();
        res.status(200).json(1);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

// Restore a file from the recycling bin
router.patch('/restorefile', async (req, res) => {

    try {

        const user = await User.findOne({ email: req.body.email });

        let fileToRestore = user.files.find((file) => file.name === req.body.fileName);

        // Restore a file either to the inbox or my files bin depending on where it came from
        if (fileToRestore.binNumber === 2) {
            fileToRestore.binNumber = 0;
        } else if (fileToRestore.binNumber === 3) {
            fileToRestore.binNumber = 1;
        }

        await user.save();
        res.status(200).json(1);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

router.patch('/editfilename', async (req, res) => {

    try {
        
        const newFileName = req.body.newFileName;
        const user = await User.findOne({ email: req.body.email });
        const fileToChangeName = user.files.find((file) => file.name === req.body.fileName);
        
        // Check if an exising file already has the new file name
        if (user.files.filter((file) => file.name === newFileName).length > 0) {
            return res.status(400).json(2); 
        }

        fileToChangeName.name = newFileName;
        await user.save();
        return res.status(200).json(1);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

router.get('/getfileextensions', async (req, res) => {

    try {

        const user = await User.findOne({ email: req.query.email });
        
        // Get the files from each bin
        let myFilesFileList = user.files.filter((file) => file.binNumber === 0);
        let inboxFileList = user.files.filter((file) => file.binNumber === 1);
        let recycleFileList = user.files.filter((file) => file.binNumber === 2 || file.binNumber === 3);

        // Get the extensions from each of the files in each bin
        myFilesFileList = Array.from(new Set(myFilesFileList.map((file) => file = file.name.split('.')[1])));
        inboxFileList = Array.from(new Set(inboxFileList.map((file) => file = file.name.split('.')[1])));
        recycleFileList = Array.from(new Set(recycleFileList.map((file) => file = file.name.split('.')[1])));

        // Add an isSelected options to each file extension option
        let myFilesExtensionObjectList = {};
        myFilesFileList.forEach((file) => {
            myFilesExtensionObjectList[file] = { isSelected: 0 };
        });
        
        let inboxExtensionsObjectList = {};
        inboxFileList.forEach((file) => {
            inboxExtensionsObjectList[file] = { isSelected: 0 };
        })

        let recycleExtensionsObjectList = {};
        recycleFileList.forEach((file) => {
            recycleExtensionsObjectList[file] = { isSelected: 0 };
        });
    
        const extensionObj = {
            myFiles: myFilesExtensionObjectList,
            inbox: inboxExtensionsObjectList,
            recycle: recycleExtensionsObjectList
        };

        res.status(200).json(extensionObj);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

const getFileType = (localFileData) => {

    const fileIdentifierRegex = "(base64)";

    let base64Position = localFileData.search(fileIdentifierRegex);

    let fileIdentiferInfo = localFileData.substring(5, base64Position - 1);

    if (fileIdentiferInfo.substring(0, 4) === 'text') {
        return "txt";
    } else if (fileIdentiferInfo.substring(0, 5) === 'image') {
        return "img";
    } else if (fileIdentiferInfo === 'application/pdf') {
        return "pdf";
    }    
}

module.exports = router;