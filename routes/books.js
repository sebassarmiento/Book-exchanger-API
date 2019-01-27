const express = require('express');
const router = express.Router()

const Book = require('../models/bookModel');
const User = require('../models/userModel');

router.get('/', (req, res) => {
    let bookCount;
    Book.find()
    .sort({date: -1})
    .skip(req.query.search ? parseFloat(req.query.search) : 0)
    .limit(10)
    .then(result => {
        Book.find().countDocuments().then(async count => {
            bookCount = await count
            console.log(result, bookCount, 'Se manda la data')
            return res.status(200).json({ data: result, count: bookCount })
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

router.get('/search', (req, res) => {
    console.log('Entraaaa', req.query.name)
    Book.find({name: { "$regex": req.query.name, "$options": "i" } })
    .sort({date: -1})
    .countDocuments((err, count) => console.log('Count!',count))
    .then(result => {
        console.log(result)
        res.status(200).json(result)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

router.get('/category/:category', (req, res) => {
    let capitalize = string => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    Book.find({category: capitalize(req.params.category)})
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
    console.log('Aquiiiii', req.body.location, typeof req.body.location)
    const book = new Book({
        name: req.body.name,
        category: req.body.category,
        location: req.body.location,
        image: req.body.image,
        author: req.body.author,
        description: req.body.description,
        username: req.body.username,
        userId: req.body.userId,
        date: req.body.date,
        pages: req.body.pages,
        ratings: []
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
        .catch(err => {
            res.status(500).json({error: err})
        })
    })
    .catch(err => {
        res.status(500).json({message: "Could not add book", error: err})
    })
})

router.post('/:bookId/rating', (req, res) => {
    console.log("AQUI AQUI AQUI", req.body.rating)
    Book.findById(req.params.bookId)
    .then(book => {
        console.log('BOOK', book)
        let index = book.ratings.findIndex(x => x.userId === req.body.userId)
        if(index !== -1){
            book.ratings.splice(index, 1)
        }
        book.ratings.push({ userId: req.body.userId, rating: req.body.rating })
        return book.save()
    })
    .then(response => {
        res.status(200).json({ message: "Rating added!", response })
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

module.exports = router