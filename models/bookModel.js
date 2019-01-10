const mongoose = require('mongoose');

const Book = mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    place: { type: String, required: true },
    image: { type: String, required: true },
    username: { type: String, required: true },
    userId: { type: String, required: true },
    date: { type: Number, required: true },
    author: String,
    description: String,
    pages: Number,
    ratings: [Object]
})

module.exports = mongoose.model('Book', Book);