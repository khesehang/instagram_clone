const router = require('express').Router();
const requireLogin = require('../middleware/requireLogin');
const Post = require('../models/post')

router.get('/allpost', requireLogin, (req, res, next) => {
    Post.find()
        .populate('postedBy', "_id name")
        .populate('comments.postedBy', '_id name')
        .sort('-createdAt')
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            return next(err)
        })
})

router.get('/getsubpost', requireLogin, (req, res, next) => {
    // if postedBy in following
    Post.find({ postedBy: { $in: req.user.following } })
        .populate('postedBy', '_id name')
        .populate('comments.postedBy', '_id name')
        .sort('-createdAt')
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            return next(err)
        })
})

router.post('/createpost', requireLogin, (req, res, next) => {
    const { title, body, pic } = req.body;
    if (!title || !body || !pic) return next({ error: 'Please add all the fields' })
    req.user.passwrod = undefined;
    const post = new Post({
        title,
        body,
        photo: pic,
        postedBy: (req.user)
    })
    post.save().then(result => {
        res.json({ post: result })
    })
        .catch(err => {
            return next(err)
        })
})

module.exports = router;