const express = require('express');
const router = express.Router()

const Book = require('../models/bookModel');
const User = require('../models/userModel');

router.get('/', (req, res) => {
    Book.find()
    .sort({date: -1})
    .skip(req.query.search ? parseFloat(req.query.search) : 0)
    .limit(10)
    .then(result => {
        console.log(result)
        res.status(200).json(result)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

router.get('/id/:bookId', (req, res) => {
    Book.findById(req.params.bookId)
    .select('-__v')
    .then(result => {
        console.log(result)
        res.status(200).json(result)
    })
    .catch(err => {
        console.log(result)
        res.status(500).json(err)
    })
})

router.post('/', (req, res) => {
    const book = new Book({
        name: req.body.name,
        category: req.body.category,
        place: req.body.place,
        image: req.body.image,
        author: req.body.author,
        description: req.body.description,
        username: req.body.username,
        userId: req.body.userId,
        date: req.body.date,
        pages: req.body.pages
    })
    book.save()
    .then(result => {
        User.findById(req.body.userId)
        .then(user => {
            user.books.published.push(book)
            return user.save()
        })
        .then(result2 => {
            res.status(200).json({message: "Book was added!", book: result})
        })
    })
    .catch(err => {
        res.status(500).json({message: "Could not add book", error: err})
    })
})

module.exports = router