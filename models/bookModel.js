const mongoose = require('mongoose');

const Book = mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    place: { type: String, required: true },
    pages: Number
})

module.exports = mongoose.model('Book', Book);