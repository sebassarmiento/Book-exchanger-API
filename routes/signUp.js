const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/userModel');

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
    User.findOne({email: req.body.email})
    .then(result => {
        if(result){
            res.status(500).json({message: "User email is already taken."})
        } else {
            bcrypt.hash(req.body.password, 10 , (err, hash) => {
                if(err){
                    console.log('Entra en error', err)
                    return res.status(500).json(err)
                } else {
                    let notification = { type: 'success', message: `Hey there ${req.body.username}! You have 1 message from Sebas Sarmiento.`, opened: false, link: "5c3384e3f728c50d5a46984e" }
                    const user = new User({
                        email: req.body.email,
                        password: hash,
                        username: req.body.username,
                        description: req.body.description,
                        location: req.body.location,
                        chats: [],
                        books: {
                            published: [],
                            liked: []
                        },
                        notifications: [notification]
                    })
                    user.save()
                    .then(result => {
                        res.status(200).json({message: "User added successfully!", user: result})
                    })
                    .catch(err => {
                        res.status(500).json({message: "Could not add user", error: err})
                    })
                }
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

module.exports = router;