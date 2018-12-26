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

module.exports = router