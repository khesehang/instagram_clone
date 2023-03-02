const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user')
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
// const transporter = require('../middleware/nodemailer')

// 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

const JWT_SECRET = process.env.JWT_SECRET

const testAccount = nodemailer.createTestAccount();

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: "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"
    }
}))
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
                            // transporter.sendMail({
                            //     fron:'instagram_clone@support.com',
                            //     to:user.email,
                            //     subject:'signup success',
                            //     html:'<p>Welcome to Instagram clone project</p>'
                            // })
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

router.post('/reset-password', (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) console.log(err)
        const token = buffer.toString('hex')
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) return res.status(422).json({ error: 'User dont exist with that wmail' })
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save().then((result) => {
                    transporter.sendMail({
                        to: user.email,
                        from: 'samsohangkhesehang@gmail.com',
                        subject: 'Password reset',
                        html: `
                <p>You requrested for password reset</p>
                <h5>click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
                `
                    })
                    res.json({ message: 'check your email' })
                })
            })
    })
})

router.post('/new-password', (req, res, next) => {
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: 'Try again session expired' })
            }
            bcrypt.hash(newPassword, 12)
                .then(hashedPassword => {
                    user.password = hashedPassword
                    user.resetToken = undefined
                    user.expireToken = undefined
                    user.save().then((saveduser) => {
                        res.json({ message: 'password update success' })
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        })
})

module.exports = router;