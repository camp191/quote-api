const express = require('express')
const {ObjectID} = require('mongodb')
const _ = require('lodash')

const {Quote} = require('../models/quote')

const router = express.Router()

router.post('/', (req,res) => {
    let quote = new Quote({
        quote: req.body.quote,
        quoteBy: req.body.quoteBy,
        type: req.body.type,
        postAt: new Date().getTime()
    })

    quote.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e)
    })
})

router.get('/', (req,res) => {
    Quote.find().then((quote) => {
        res.send({quote})
    }, (e) => {
        res.status(400).send(e)
    })
})

router.get('/:id', (req,res) => {
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

router.delete('/:id', (req,res) => {
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

router.patch('/:id', (req,res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['quote', 'quoteBy', 'type'])

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

module.exports = router