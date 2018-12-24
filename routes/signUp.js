const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

router.get('/', (req, res) => {
    User.find()
    .then(result => {
        res.json({message: "Here is the list of users", users: result})
    })
    .catch(err => {
        res.status(404).json({message: "error"})
    })
})

router.get('/check-email/:email', (req, res) => {
    User.find({email: req.params.email})
    .then(result => {
        if(result && result.length !== 0){
            res.json({message: "Email already taken."})
        } else {
            res.json({message: "Email is available!"})
        }
    })
    .catch(err => {
        console.log(err)
    })
})

router.post('/', (req, res) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        gender: req.body.gender,
        age: req.body.age
    })
    user.save()
    .then(result => {
        res.status(200).json({message: "User added successfully!", user: result})
    })
    .catch(err => {
        res.status(500).json({message: "Could not add user", error: err})
    })
})

module.exports = router;