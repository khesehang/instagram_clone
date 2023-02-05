const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET
router.post('/signup', (req, res, next) => {
    console.log('req data in signup are', req.body)
    console.log('files req data in signup are', req.files)
    const { name, email, password, pic } = req.body;
    if (!email || !password || !name) {
        return next("Please add all the fileds")
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (savedUser) return next('User already exists with that email')
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email,
                        password: hashedPassword,
                        name,
                        pic,
                    })
                    user.save()
                        .then(user => {
                            res.json(user)
                        })
                })
        })
        .catch(err => {
            return next(err)
            console.log(err)
        })
})

router.post('/signin', (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return res.next({ error: 'Please add email or passwrod' })
    User.findOne({ email })
        .then(savedUser => {
            if (!savedUser) return next({ error: 'Invalid Email or Password' })
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        const { _id, name, email, followers, following, pic } = savedUser
                        res.json({ token, User: { _id, name, email, followers, following, pic } })
                    } else {
                        return next({ error: 'Invalid email or password' })
                    }
                })
        })
        .catch(err => {
            return next(err)
        })
})

module.exports = router;