const mongoose = require('mongoose');

const Chat = mongoose.Schema({
    messages: [{ userId: String, text: String }]
})

module.exports = mongoose.model('Chat', Chat);