const express = require('express')
const {ObjectID} = require('mongodb')
const _ = require('lodash')

const {Quote} = require('../models/quote')
const {authenticate} = require('../middleware/authenticate')

const router = express.Router()

router.post('/', authenticate, (req,res) => {
    let quote = new Quote({
        quote: req.body.quote,
        quoteBy: req.body.quoteBy,
        type: req.body.type,
        postAt: new Date().getTime(),
        _creator: req.user._id
    })

    quote.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e)
    })
})

router.get('/', authenticate, (req,res) => {
    Quote.find({
        _creator: req.user._id
    }).then((quote) => {
        res.send({quote})
    }, (e) => {
        res.status(400).send(e)
    })
})

router.get('/all', authenticate, (req,res) => {
    Quote.find().then((quote) => {
        res.send({quote})
    }, (e) => {
        res.status(400).send(e)
    })
})

router.get('/:id', authenticate, (req,res) => {
    let id = req.params.id
    if(!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    Quote.findOne({
        _id: id,
        _creator: req.user._id
    }).then((quote) => {
        if(!quote) {
            return res.status(404).send()
        }
        return res.send({quote})
    }).catch((e) => {
        res.status(400).send()
    })
})

router.delete('/:id', authenticate, (req,res) => {
    let id = req.params.id

    if(!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    Quote.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((quote) => {
        if(!quote) {
            return res.status(404).send()
        }
        return res.send({quote})
    }).catch((e) => {
        res.status(400).send()
    })
})

router.patch('/:id', authenticate, (req,res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['quote', 'quoteBy', 'type'])

    if(!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    body.postAt = new Date().getTime()

    Quote.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((quote) => {
        if(!quote) {
            return res.status(404).send()
        }

        res.send({quote})
    }).catch((e) => {
        return res.status(400).send()
    })
})

module.exports = router