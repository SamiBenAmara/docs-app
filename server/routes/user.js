const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Get all users
router.get('/', async (req, res) => {

    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get names of all the users on the system
// Format each item as { value: NAME, data: NAME } to use in react-select
router.get('/getusernames', async (req, res) => {

    try {

        const currentUser = await User.findOne({ email: req.query.email });
        const currentUsername = currentUser.userName;
        const users = await User.find();
        let nameArray = users.map((item) => ({ "value": item.username, "label": item.username }));
        nameArray = nameArray.filter((username) => username.value !== currentUsername);

        res.status(200).json(nameArray);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

router.get('/getuserinfo', async (req, res) => {

    try {

        const user = await User.findOne({ email: req.query.email });
        const userData = {
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
            password: user.password
        }
        res.status(200).json(userData);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

// Sign up
router.post('/signup', async (req, res) => {

    try {
        // const newUser = await user.save();

        const checkUserEmail = await User.findOne({ email: req.body.email });
        if (checkUserEmail !== null) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const checkUserUserName = await User.findOne({ userName: req.body.userName });
        if (checkUserUserName !== null) {
            return res.status(400).json({ message: "Username already in use" });
        }

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password,
            files: []
        });

        await user.save();
        return res.status(201).json({ message: "Sucessfully created new user" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }

});

// Sign in
router.post('/signin', async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    try {
        const userFound = await User.findOne({ email: email });
        if (userFound === null) {
            return res.status(404).json({ message: "Email does not exist" });
        }

        if (userFound.password !== password) {
            return res.status(400).json({ message: "Password is incorrect" });
        }

        let loginData = {
            firstName: userFound.firstName,
            lastName: userFound.lastName,
            userName: userFound.userName,
            email: userFound.email
        }
        return res.status(200).json(loginData);
    } catch (err) {
        return res.status(404).json({ message: "User does not exist" });
    }

});

// Edit User information
router.patch('/editprofile', async (req, res) => {

    try {

        // Get the users information
        const user = await User.findOne({ email: req.body.originalEmail });
        // const originalUserName = user.userName;

        if (req.body.originalEmail !== req.body.email) {
            const checkUserEmail = await User.findOne({ email: req.body.email });
            if (checkUserEmail !== null) {
                return res.status(400).json(1);
            }
        }

        if (req.body.originalUserName !== req.body.userName) {
            const checkUserUserName = await User.findOne({ userName: req.body.userName });
            if (checkUserUserName !== null) {
                return res.status(400).json(2);
            }
        }

        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.userName = req.body.userName;
        user.email = req.body.email;

        await user.save();
        return res.status(200).json(3);

        // const newUserName = req.body.username;
        // const newEmail = req.body.email;

        // Get a list of the existing information of other users to make sure that there are no duplicates
        // const userList = await User.find();
        // let userEmailList = userList.map((user) => {
        //     if (user.email !== req.body.originalEmail) {
        //         return user.email;
        //     }
        // });
        // let userNameList = userList.map((user) => {
        //     if (user.username !== originalUserName) {
        //         return user.username;
        //     }
        // });

        // console.log("userEmailList: ", userEmailList);
        // console.log("userNameList: ", userNameList);

        // const emailFilterLength = userEmailList.filter((email) => email === newEmail).length;
        // const usernameFilterLength = userNameList.filter((username) => username === newUserName).length;

        // if (emailFilterLength > 0 && usernameFilterLength > 0) {
        //     return res.json(4)
        // } else if (emailFilterLength > 0) {
        //     return res.json(3);
        // } else if (usernameFilterLength > 0) {
        //     return res.json(2);
        // }

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

});

// Change User Password
router.patch('/changepassword', async (req, res) => {

    try {

        const user = await User.findOne({ email: req.body.email });
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const reenterNewPassword = req.body.reenterNewPassword;

        if (oldPassword !== user.password) {
            return res.status(400).json(1);
        } 
        
        if (newPassword !== reenterNewPassword) {
            return res.status(400).json(2);
        }

        if (oldPassword === newPassword) {
            return res.status(400).json(3);
        }

        user.password = newPassword;

        await user.save();
        res.status(200).json(4);

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

});

// Delete user
router.delete('/', async (req, res) => {

    const email = req.body.email;
    const user = await User.findOne({ email: email });

    try {
        await user.deleteOne();
        res.status(200).json({ message: "Successfully deleted user" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

// Delete all users
router.delete('/deleteall', async (req, res) => {
  
    try {
        await User.deleteMany();
        res.status(200).json({ message: 'Deleted all users' });
    } catch (err) {
        res.status(500).json({ err: err.message })
    }

});

// Get all of a users files
router.get('/getfiles', async (req, res) => {

    const email = req.query.email;

    try {

        const user = await User.findOne({ email: email });

        // Add a "viewable" property to the files before sending them to the fr

        let userFiles = user.files.filter((file) => file.binNumber === 0);
        let userInboxFiles = user.files.filter((file) => file.binNumber === 1);
        let userRecycleFiles = user.files.filter((file) => file.binNumber === 2 || file.binNumber === 3);

        // userFiles = userFiles.map(file => {
        //     file = file.toObject();
        //     file.isViewable = 2;
        //     file.extension = file.name.split('.')[1];
        //     return file;
        // });

        // userInboxFiles = userInboxFiles.map(file => {
        //     file = file.toObject();
        //     file.isViewable = 2;
        //     file.extension = file.name.split('.')[1];
        //     return file;
        // });

        // userRecycleFiles = userRecycleFiles.map(file => {
        //     file = file.toObject();
        //     file.isViewable = 2;
        //     file.extension = file.name.split('.')[1];
        //     return file;
        // });

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

// Get all files in user inbox
// router.get('/getinbox', async (req, res) => {

//     const email = req.query.email;

//     try {
        
//         const user = await User.findOne({ email: email });
//         res.status(200).json(user.inbox);

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }

// });

// Get all files in user recycle bin
// router.get('/getrecycle', async (req, res) => {

//     const email = req.query.email;

//     try {
        
//         const user = await User.findOne({ email: email });
//         res.status(200).json(user.recycleBin);

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }

// });

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
            sender: sender.username,
            type: fileToTransfer.type,
            isViewable: 2,
            extension: fileToTransfer.extension,
            binNumber: 1
        }

        receiverUsernames.forEach(async (user) => {

            const receiver = await User.findOne({ username: user });

            receiver.files.push(fileToTransferObject);
            await receiver.save();

        });

        return res.status(200).json(1);

        // const receiver = await User.findOne({ username: receiverUsername });
        // const fileToTransfer = sender.files.find((file) => file.name === fileName)
        
        // let fileToTransferObject = {
        //     name: fileToTransfer.name,
        //     data: fileToTransfer.data,
        //     date: new Date(),
        //     sender: sender.username,
        //     binNumber: 1
        // }
        
        // receiver.files.push(fileToTransferObject);

        // await receiver.save();

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

router.get('/getsenders', async (req, res) => {

    try {

      const user = await User.findOne({ email: req.query.email });

      let userSenderArr = user.files.filter((file) => file.binNumber === 1);
      userSenderArr = Array.from(new Set(userSenderArr.map((file) => file = file?.sender)));
    //   userSenderArr = userSenderArr.map((sender) => sender = { name: sender, isSelected: 0 });
      
      let userSenderObj = {};
      userSenderArr.forEach((sender) => {
        userSenderObj[sender] = { isSelected: 0 };
      });
      
      return res.status(200).json(userSenderObj);

    } catch (err) {
      res.status(500).json({ message: err.message });
    }

});

router.get('/getfileextensions', async (req, res) => {

    try {

        const user = await User.findOne({ email: req.query.email });
        
        let myFilesFileList = user.files.filter((file) => file.binNumber === 0);
        let inboxFileList = user.files.filter((file) => file.binNumber === 1);
        let recycleFileList = user.files.filter((file) => file.binNumber === 2 || file.binNumber === 3);

        myFilesFileList = Array.from(new Set(myFilesFileList.map((file) => file = file.name.split('.')[1])));
        inboxFileList = Array.from(new Set(inboxFileList.map((file) => file = file.name.split('.')[1])));
        recycleFileList = Array.from(new Set(recycleFileList.map((file) => file = file.name.split('.')[1])));

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

// -------------------------------------

// Check if a file has the same name as an existing file on the system

// Delete a file from a users inbox
// router.delete('/deleteinboxfile', async (req, res) => {

//     try {

//         const user = await User.findOne({ email: req.body.email });
//         const fileToDelete = user.inbox.find((file) => file.name === req.body.fileName);
//         const fileToDeleteIndex = user.inbox.indexOf(fileToDelete);
//         user.inbox.splice(fileToDeleteIndex, 1);

//         await user.save();
//         res.status(200).json("success");

//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }

// });

const getFileType = (/* localFile*/ localFileData) => {

    const fileIdentifierRegex = "(base64)";
    // const localFileAllData = localFile.data;

    // let base64Position = localFileAllData.search(fileIdentifierRegex);
    let base64Position = localFileData.search(fileIdentifierRegex);

    // let fileIdentiferInfo = localFileAllData.substring(5, base64Position - 1);
    let fileIdentiferInfo = localFileData.substring(5, base64Position - 1);

    // let localFileData = localFileAllData.substring(base64Position + 7, localFileAllData.length);

    if (fileIdentiferInfo.substring(0, 4) === 'text') {
        return "txt";
    } else if (fileIdentiferInfo.substring(0, 5) === 'image') {
        return "img";
    } else if (fileIdentiferInfo === 'application/pdf') {
        return "pdf";
    }    
}

module.exports = router;