const jwt = require('jsonwebtoken')
const User = require('../models/user')
module.exports = (req, res, next) => {
    const { authorization } = req.headers
    // authorization === Bearer sldkjfq
    if (!authorization) return next({ error: 'You must be logged in' })
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) return next({ error: 'You must be logged in' })
        const { _id } = payload
        User.findById(_id)
            .then(userData => {
                req.user = userData
                next()
            })
            .catch(err => {
                return next(err)
            })
    })
}