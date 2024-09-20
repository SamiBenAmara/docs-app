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
        let nameArray = users.map((item) => ({ "value": item.userName, "label": item.userName }));
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

        // Make sure the new email isn't already in use
        if (req.body.originalEmail !== req.body.email) {
            const checkUserEmail = await User.findOne({ email: req.body.email });
            if (checkUserEmail !== null) {
                return res.status(400).json(1);
            }
        }

        // Make sure the new username isn't already in use
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

router.get('/getsenders', async (req, res) => {

    try {

      const user = await User.findOne({ email: req.query.email });

      // Get the senders from the files in the user's inbox bin
      let userSenderArr = user.files.filter((file) => file.binNumber === 1);
      userSenderArr = Array.from(new Set(userSenderArr.map((file) => file = file?.sender)));
      
      let userSenderObj = {};
      userSenderArr.forEach((sender) => {
        userSenderObj[sender] = { isSelected: 0 };
      });
      
      return res.status(200).json(userSenderObj);

    } catch (err) {
      res.status(500).json({ message: err.message });
    }

});

module.exports = router;