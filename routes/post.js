const router = require('express').Router();
const requireLogin = require('../middleware/requireLogin');
const Post = require('../models/post')

router.get('/allpost', requireLogin, (req, res, next) => {
    Post.find()
        .populate('postedBy', "_id name")
        .populate('comments.postedBy')
        .populate('comments.postedBy', '_id name')
        .sort('-createdAt')
        .then(posts => {
            console.log('req user id',req.user._id)
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

router.get('/mypost', requireLogin, (req, res, next) => {
    Post.find({ postedBy: req.user._id })
        .populate('postedBy', '_id name')
        .then(mypost => {
            res.json({ mypost })
        })
        .catch(err => {
            return next(err)
        })
})

router.put('/like', requireLogin, (req, res, next) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) return next({ error: err })
        res.json(result)
    })
})
router.put('/unlike', requireLogin, (req, res, next) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).exec((err, result) => {
        if (err) return next({ error: err })
        console.log('result are', result)
        res.json(result)
    })
})

router.put('/comment', requireLogin, (req, res, next) => {
    console.log('data in comment are', req.body)
    console.log('data in comment are', req.user._id)
    const comment = {
        text: req.body.text,
        postedby: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, { new: true })
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, result) => {
            if (err) return next({ error: err })
            res.json(result)
        })
})

router.delete('/deletepost/:postId', requireLogin, (req, res, next) => {
    Post.findOne({ _id: req.params.postId })
        .populate('postedBy', '_id')
        .exec((err, post) => {
            if (err || !post) return next({error: err})
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove()
                    .then(result => {
                        res.json(result)
                    })
                    .catch(err => {
                        return next({ error: err })
                    })
            }
        })
})

module.exports = router;