const express = require('express');
const router = express.Router();

const User = require('../models/userModel');

router.post('/', (req, res) => {
    User.find({email: req.body.email})
    .then(result => {
        if(result && result.length !== 0){
            if(result[0].password === req.body.password){
                res.status(200).json({message: "Access granted", user: result[0] })
            } else {
                res.status(500).json({message: "Invalid data"})
            }
        } else {
            res.status(500).json({message: "Invalid data"})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
})

module.exports = router