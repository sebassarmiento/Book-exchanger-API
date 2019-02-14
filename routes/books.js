const express = require('express');
const router = express.Router()

const Book = require('../models/bookModel');
const User = require('../models/userModel');

const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Entra 1')
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now().toString() + file.originalname)
        console.log('Entra 2')
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true)
        console.log('Entra 3')
    } else {
        cb(null, false)
        console.log('Entra 4')
    }
}

const upload = multer({storage, fileFilter})


router.get('/', (req, res) => {
    let bookCount;
    Book.find()
        .sort({ date: -1 })
        .skip(req.query.search ? parseFloat(req.query.search) : 0)
        .limit(20)
        .then(result => {
            Book.find().countDocuments().then(async count => {
                bookCount = await count
                return res.status(200).json({ data: result, count: bookCount })
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

router.get('/search', (req, res) => {
    Book.find({ name: { "$regex": req.query.name, "$options": "i" } })
        .sort({ date: -1 })
        .then(result => {
            console.log('RESULTADO DE QUERY', result)
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
    Book.find({ category: capitalize(req.params.category) })
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
            console.log('ACACAVACACACACA', result)
            if (result) {
                res.status(200).json(result)
            } else {
                res.status(404).json({ message: "Book not found" })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

router.post('/', upload.single('image'), (req, res) => {
    console.log('ACA MI FILE', req.file)
    const book = new Book({
        name: req.body.name,
        category: req.body.category,
        location: req.body.location,
        image: req.file ? req.file.path : null,
        author: req.body.author,
        description: req.body.description,
        username: req.body.username,
        userId: req.body.userId,
        date: req.body.date,
        pages: req.body.pages,
        ratings: [],
        ratingsNumber: 0
    })
    book.save()
        .then(result => {
            let notification = { type: 'success', message: `Your book ${result.name} was published successfully!`, opened: false, link: result._id }
            User.findById(req.body.userId)
                .then(user => {
                    user.books.published.push(book)
                    user.notifications.push(notification)
                    return user.save()
                })
                .then(result2 => {
                    res.status(200).json({ message: "Book was added!", notification })
                })
                .catch(err => {
                    res.status(500).json({ error: err })
                })
        })
        .catch(err => {
            res.status(500).json({ message: "Could not add book", error: err })
        })
})

router.post('/:bookId/rating', (req, res) => {
    let bookName;
    let bookId;
    Book.findById(req.params.bookId)
        .then(book => {
            bookName = book.name
            bookId = book._id
            let index = book.ratings.findIndex(x => x.userId === req.body.userId)
            if (index !== -1) {
                book.ratings.splice(index, 1)
            }
            book.ratings.push({ userId: req.body.userId, rating: req.body.rating })
            book.ratingsNumber = book.ratings.reduce((a, b) => ({ rating: a.rating + b.rating })).rating / book.ratings.length
            return book.save()
        })
        .then(response => {
            let notification;
            User.findById(req.body.userId)
                .then(user => {
                    notification = { category: 'success', message: `Your rating for ${bookName} was added!`, link: bookId.toString() }
                    user.notifications.push(notification)
                    return user.save()
                })
                .then(userUpdated => {
                    return res.status(200).json({ message: "Rating added!", response, notification })
                })
        })
        .catch(err => {
            console.log('Sale por errro')
            res.status(500).json(err)
        })
})

router.post('/filters', (req, res) => {
    console.log('ACA MI BODY',req.body)
    let categoryFilters = req.body.categoryFilters.length > 0 ? true : null
    let locationFilters = req.body.locationFilters.length > 0 ? true : null
    let ratingsFilter = req.body.ratingsFilter !== 0 ? true : null
    let bookSearch;

    if (categoryFilters && locationFilters && ratingsFilter) {
        // With category, location and ratings filters
        console.log('Entra al 1')
        bookSearch = Book.find({ $and: [{ category: { $in: [...req.body.categoryFilters] } }, { location: { $in: [...req.body.locationFilters] } }, { ratingsNumber: { $gt: req.body.ratingsFilter - 1 } }] })            
    
    } else if(categoryFilters && locationFilters && !ratingsFilter){
        // With category and location filters
        console.log('Entra al 2')
        bookSearch = Book.find({ $and: [{ category: { $in: [...req.body.categoryFilters] } }, { location: { $in: [...req.body.locationFilters] } } ] })

    } else if(categoryFilters && !locationFilters && ratingsFilter){
        // With category and ratings filters
        console.log('Entra al 3')
        bookSearch = Book.find({ $and: [{ category: { $in: [...req.body.categoryFilters] } }, { ratingsNumber: { $gt: req.body.ratingsFilter - 1 } } ] })

    } if(!categoryFilters && locationFilters && ratingsFilter){
        // With location and ratings filters
        console.log('Entra al 4')
        bookSearch = Book.find({ $and: [{ location: { $in: [...req.body.locationFilters] } }, { ratingsNumber: { $gt: req.body.ratingsFilter - 1 } } ] })

    } else if(!categoryFilters && !locationFilters && ratingsFilter){
        // With filters only
        console.log('Entra al 5')
        bookSearch = Book.find({ ratingsNumber: { $gt: req.body.ratingsFilter - 1 } })

    } else if(!categoryFilters && !ratingsFilter && locationFilters){
        // With location filters only
        console.log('Entra al 6')
        bookSearch = Book.find({ location: { $in: [...req.body.locationFilters] } })            
    
    } else if(categoryFilters && !locationFilters && !ratingsFilter){
        // With category filters only
        console.log('Entra al 7')
        bookSearch = Book.find({ category: { $in: [...req.body.categoryFilters] } })            
    
    }
    bookSearch.then(books => {
        res.status(200).json(books)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

module.exports = router