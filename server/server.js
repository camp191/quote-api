const express = require('express')
const bodyParser = require('body-parser')

const {mongoose} = require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3001

app.use(bodyParser.json())

//routes
const quoteRoute = require('./routes/quote')
const userRoute = require('./routes/user')
app.use('/quotes', quoteRoute)
app.use('/user', userRoute)

app.listen(port, () => {
    console.log(`Started on port ${port}`)
})