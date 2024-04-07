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

router.get('/getuserinfo', async (req, res) => {

    try {

        const user = await User.findOne({ email: req.query.email });
        const userData = {
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
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

    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        files: []
    });

    try {
        const newUser = await user.save();
        res.status(201).json("success");
    } catch (err) {
        res.status(400).json({ message: err.message });
    }

});

// Sign in
router.post('/signin', async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    try {
        const userFound = await User.findOne({ email: email });
        if (userFound == null) {
            res.status(404).json({ message: "User does not exist" });
        }

        if (userFound.password != password) {
            res.status(400).json({ message: "Password is incorrect" });
        }

        res.status(200).json("success");
    } catch (err) {
        res.status(404).json({ message: "User does not exist" });
    }

});

// Edit User information
router.patch('/editprofile', async (req, res) => {

    try {

        const user = await User.findOne({ email: req.body.originalEmail });

        user.firstname = req.body.firstname;
        user.username = req.body.username;
        user.lastname = req.body.lastname;
        user.email = req.body.email;

        await user.save();
        res.status(200).json("success");

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

// Change User Password
router.patch('/changepassword', async (req, res) => {

    try {

        const user = await User.findOne({ email: req.body.email });
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const reenterNewPassword = req.body.reenterNewPassword;

        if (oldPassword === user.password && newPassword === reenterNewPassword) {
            user.password = newPassword;
        }

        await user.save();
        res.status(200).json("success");

    } catch (err) {
        console.log(err.message);
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

// Get all of a users files
router.get('/getfiles', async (req, res) => {

    const email = req.query.email;

    try {

        const user = await User.findOne({ email: email });
        res.status(200).json(user.files);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

// Upload file
router.patch('/uploadfile', async (req, res) => {

    const email = req.body.email;

    try {

        const user = await User.findOne({ email: email });
        let tempFile = {
            name: req.body.fileName,
            data: req.body.fileData
        };

        user.files.push(tempFile);
        await user.save();

        res.status(200).json("success");

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

// Send file to another user
router.patch('/sendfile', async (req, res) => {

    const senderEmail = req.body.senderEmail;
    const fileName = req.body.fileName;
    const receiverUsername = req.body.username;

    try {

        const sender = await User.findOne({ email: senderEmail });
        const receiver = await User.findOne({ username: receiverUsername });
        const fileToTransfer = sender.files.find((file) => file.name === fileName)
        receiver.files.push(fileToTransfer);

        await receiver.save();

        res.status(200).json("success");

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
        res.status(200).json("success");

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

// Delete a file
router.delete('/deletefile', async (req, res) => {

    try {

        const user = await User.findOne({ email: req.body.email });
        const fileToDelete = user.files.find((file) => file.name === req.body.fileName);
        const fileToDeleteIndex = user.files.indexOf(fileToDelete);
        user.files.splice(fileToDeleteIndex, 1);

        await user.save();
        res.status(200).json("success");

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

module.exports = router;