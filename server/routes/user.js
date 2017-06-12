const express = require('express')
const _ = require('lodash')
const {User} = require('../models/user')

const router = express.Router()

router.post('/', (req,res) => {
    let body = _.pick(req.body, ['email', 'password', 'name', 'sex'])
    let user = new User(body)

    user.save().then(() => {
        return user.generateAuthToken()
    }).then((token) => {
        res.header('x-auth', token).send(user)
    }).catch((e) => {
        res.status(400).send(e)
    })
})


module.exports = router