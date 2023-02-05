const router = require('express').Router();

const AuthRoute = require('./routes/auth')

router.use('/auth', AuthRoute)

module.exports = router