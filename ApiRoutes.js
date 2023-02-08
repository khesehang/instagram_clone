const router = require('express').Router();

const AuthRoute = require('./routes/auth')
const UserRoute = require('./routes/user')
const PostRoute = require('./routes/post')

router.use('/auth', AuthRoute)
router.use('/user', UserRoute)
router.use('/post', PostRoute)

module.exports = router