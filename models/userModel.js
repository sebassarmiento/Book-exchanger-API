const mongoose = require('mongoose');

const User = mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true }
})

module.exports = mongoose.model('User', User);