const express = require('express');
const app = express()
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const validToken = require('./middleware/validToken');

const signUpRouter = require('./routes/signUp');
const loginRouter = require('./routes/login');
const booksRouter = require('./routes/books');
const userRouter = require('./routes/user');
const chatsRouter = require('./routes/chat');

mongoose.connect('mongodb+srv://sebastian:cacafea@cluster0-ok6xa.mongodb.net/book-exchange?retryWrites=true', {useNewUrlParser: true})
        .then(() => {
            console.log("Connected to Database");
            })
        .catch((err) => {
            console.log("Not Connected to Database ERROR! ", err);
        })

app.use(express.json())
app.use(cors())

app.use('/signup', signUpRouter)
app.use('/login', loginRouter)
app.use('/app/books', booksRouter)
app.use('/app/user', userRouter)
app.use('/app/chats', chatsRouter)

process.env.PWD = process.cwd()

app.use('/public', express.static(path.join(process.env.PWD + '/public')))

app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: error.message
    })
})

module.exports = app