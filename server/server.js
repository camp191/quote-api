const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')

const {mongoose} = require('./db/mongoose')
const {Quote} = require('./models/quote')

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())

app.post('/quotes', (req,res) => {
    let quote = new Quote({
        quote: req.body.quote,
        type: req.body.type
    })

    quote.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e)
    })
})

app.get('/quotes', (req,res) => {
    Quote.find().then((quote) => {
        res.send({quote})
    }, (e) => {
        res.status(400).send(e)
    })
})

app.get('/quotes/:id', (req,res) => {
    let id = req.params.id
    if(!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    Quote.findById(id).then((quote) => {
        if(!quote) {
            return res.status(404).send()
        }
        return res.send({quote})
    }).catch((e) => {
        res.status(400).send()
    })
})

app.delete('/quotes/:id', (req,res) => {
    let id = req.params.id

    if(!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    Quote.findByIdAndRemove(id).then((quote) => {
        if(!quote) {
            return res.status(404).send()
        }
        return res.send({quote})
    }).catch((e) => {
        res.status(400).send()
    })
})

app.listen(port, () => {
    console.log(`Started on port ${port}`)
})