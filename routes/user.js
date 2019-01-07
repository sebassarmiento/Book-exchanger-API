const express = require('express');
const router = express.Router()

const User = require('../models/userModel');

router.get('/:userId', (req, res) => {
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

router.post('/wishlist/:userId', (req, res) => {
    User.findById(req.params.userId)
    .then(user => {
        let bookLiked = user.books.liked.filter(b => b._id === req.body.book._id)
        if(bookLiked.length > 0){
            console.log('Entra al primero')
            console.log(`COMPARANDOOOO => ${user.books.liked[0]._id} === ${req.body.book._id}`)
            let index = user.books.liked.findIndex(x => x._id === req.body.book._id)
            console.log( 'INDEXXXXXXX',index)
            user.books.liked.splice(index ,1)
        } else {
            console.log('Entra al segundo')
            user.books.liked.push(req.body.book)
        }
        return user.save()
    })
    .then(result => {
        console.log(result)
        res.status(200).json({message: "Book added to wishlist", user: result})
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

module.exports = router