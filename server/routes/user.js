const express = require('express')
const _ = require('lodash')
const {ObjectID} = require('mongodb')
const {User} = require('../models/user')
const {authenticate} = require('../middleware/authenticate')

const router = express.Router()

router.post('/signup', (req,res) => {
    let body = _.pick(req.body, ['email', 'password', 'name'])
    let user = new User(body)

    user.save().then(() => {
        return user.generateAuthToken()
    }).then((token) => {
        res.header('x-auth', token).send(user)
    }).catch((e) => {
        res.status(400).send(e)
    })
})


router.get('/me', authenticate, (req,res) => {
    res.send(req.user)
})

router.post('/login', (req,res) => {
    let body = _.pick(req.body, ['email', 'password'])

    User.findByCredential(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user)
        })
    }).catch((e) => {
        res.status(400).send(e)
    })
})

router.delete('/logout', authenticate, (req,res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send()
    }, () => {
        res.status(400).send()
    })
})

router.patch('/:id', authenticate, (req,res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['name', 'description', 'sex'])

    if(!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    User.findOneAndUpdate({_id: id}, {$set: body}, {new: true}).then((user) => {
        if(!user) {
            return res.status(404).send()
        }

        res.send({user})
    }).catch((e) => {
        return res.status(400).send()
    })
})

module.exports = router
