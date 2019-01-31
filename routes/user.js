const express = require('express');
const router = express.Router()

const User = require('../models/userModel');

router.get('/:userId', (req, res) => {
    User.findById(req.params.userId)
    .select('-password')
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
    let message;
    let notification;
    User.findById(req.params.userId)
    .then(user => {
        let bookLiked = user.books.liked.filter(b => b._id === req.body.book._id)
        if(bookLiked.length > 0){
            let index = user.books.liked.findIndex(x => x._id === req.body.book._id)
            user.books.liked.splice(index ,1)
            message = `${req.body.book.name} was removed from your wishlist!`
        } else {
            user.books.liked.push(req.body.book)
            message = `${req.body.book.name} was added to your wishlist!`
        }
        notification = { category: 'success', message, opened: false, link: req.body.book._id.toString() }
        user.notifications.push(notification)
        return user.save()
    })
    .then(result => {
        console.log(result)
        res.status(200).json({user: result, notification})
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})


router.get('/open-notifications/:userId', (req, res) => {
    User.findById(req.params.userId)
    .then(user => {
        if(user){
            user.notifications.map(n => n.opened = true)
            return user.save()
        }
    })
    .then(result => {
        res.status(200).json({message: "Cleared notifications!"})
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

module.exports = router