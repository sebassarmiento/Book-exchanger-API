const express = require('express');
const router = express.Router()

const Chat = require('../models/chatModel');
const User = require('../models/userModel');

router.post('/newChat', (req, res) => {
    const chat = new Chat({
        users: req.body.users,
        messages: req.body.messages
    })
    chat.save()
    .then(result => {
        User.findById(result.users[0])
        .then(user1 => {
            user1.chats.push({ userId: result.users[1], chatId: result._id })
            return user1.save()
        })
        .then(res1 => {
            return User.findById(result.users[1])
        })
        .then(user2 => {
            user2.chats.push({ userId: result.users[0], chatId: result._id })
            return user2.save()
        })
        .then(res2 => {
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

router.post('/:chatId', (req, res) => {
    Chat.findById(req.params.chatId)
    .then(chat => {
        chat.messages = req.body.messages
        return chat.save()
    })
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json(err)
    })
})

router.get('/:chatId', (req, res) => {
    Chat.findById(req.params.chatId)
    .then(chat => {
        console.log('Chat => ', chat)
        res.status(200).json(chat)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})


module.exports = router