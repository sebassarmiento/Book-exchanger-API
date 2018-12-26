const express = require('express');
const router = express.Router()

const Book = require('../models/bookModel');

router.get('/', (req, res) => {
    Book.find()
    .then(result => {
        console.log(result)
        res.status(200).json(result)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

router.post('/', (req, res) => {
    const book = new Book({
        name: req.body.name,
        category: req.body.category,
        place: req.body.place,
        pages: req.body.pages
    })
    book.save()
    .then(result => {
        res.status(200).json({message: "Book was added!", book: result})
    })
    .catch(err => {
        res.status(500).json({message: "Could not add book", error: err})
    })
})

module.exports = router