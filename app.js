const express = require('express');
const app = express()
const cors = require('cors');
const mongoose = require('mongoose');

const signUpRouter = require('./routes/signUp');
const loginRouter = require('./routes/login');

mongoose.connect('mongodb+srv://sebastian:sarmiento@cluster0-ok6xa.mongodb.net/book-exchange?retryWrites=true', {useNewUrlParser: true})

app.use(express.json())
app.use(cors())

app.use('/signup', signUpRouter)
app.use('/login', loginRouter)

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