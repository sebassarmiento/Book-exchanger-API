const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

router.post('/', (req, res) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if(user){
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if(err){
                    return res.status(500).json({
                        message: "Invalid login data",
                        error: err
                    })
                } else {
                    const token = jwt.sign({
                        email: user.email,
                        id: user._id
                    }, 'secret', {expiresIn: "1h"})
                    return res.status(200).json({
                        message: "Auth successful",
                        token,
                        user
                    })
                }
            })
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