const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')
const {ObjectID} = require('mongodb')

const {mongoose} = require('./db/mongoose')
const {Quote} = require('./models/quote')

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())

app.post('/quotes', (req,res) => {
    let quote = new Quote({
        quote: req.body.quote,
        type: req.body.type,
        postAt: new Date().getTime()
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

app.patch('/quotes/:id', (req,res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['quote', 'type'])

    if(!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    body.postAt = new Date().getTime()

    Quote.findByIdAndUpdate(id, {$set: body}, {new: true}).then((quote) => {
        if(!quote) {
            return res.status(404).send()
        }

        res.send({quote})
    }).catch((e) => {
        return res.status(400).send()
    })
})

app.listen(port, () => {
    console.log(`Started on port ${port}`)
})