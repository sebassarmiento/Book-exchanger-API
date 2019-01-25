const mongoose = require('mongoose');

const User = mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    gender: { type: String, required: true },
    location: { type: String, required: false },
    chats: [ { userId: String , chatId: String } ],
    books: {
        published: Array,
        liked: Array
    },
    image: String
})

module.exports = mongoose.model('User', User);