const express = require('express');
const router = express.Router()

const User = require('../models/userModel');

router.use('/:userId', (req, res) => {
    User.findById(req.params.userId)
    .then(user => {
        console.log(user)
        if(user){
            res.status(200).json(user)
        } else {
            res.status(404).json({message: "User was not found"})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

module.exports = router