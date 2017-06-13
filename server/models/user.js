const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        unique: true,
        validate: {
            isAsync: true,
            validator: validator.isEmail,
            message: '{value} is not a email.'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    name: {
        type: String,
        required: true,
        minlength: 5,
        trim: true
    },
    sex: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: null,
        trim: true
    },
    image: {
        type: Buffer,
        default: null
    }
})

UserSchema.methods.toJSON = function() {
    let user = this
    let userObject = user.toObject()

    return _.pick(userObject, ['_id', 'email', 'name', 'sex'])
}

UserSchema.methods.generateAuthToken = function() {
    let user = this
    let access = 'auth'
    let token = jwt.sign({_id: user._id.toHexString(), access}, 'quotesss').toString()

    user.tokens.push({access, token})

    return user.save().then(() => {
        return token
    })
}

UserSchema.statics.findByToken = function(token) {
    let User = this
    let decoded

    try {
        decoded = jwt.verify(token, 'quotesss')
    } catch (e) {
        return Promise.reject()
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

UserSchema.statics.findByCredential = function(email, password) {
    let User = this

    return User.findOne({email}).then((user) => {
        if(!user) {
            return Promise.reject()
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err,res) => {
                if(res) {
                    resolve(user)
                } else {
                    reject()
                }
            })
        })
    })
}

UserSchema.pre('save', function (next) {
    var user = this

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

let User = mongoose.model('User', UserSchema)

module.exports = { User }