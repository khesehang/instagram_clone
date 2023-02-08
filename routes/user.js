const express = require('express');
const requireLogin = require('../middleware/requireLogin');
const Post = require('../models/post');
const User = require('../models/user');
const router = express.Router();

router.get('/:id', requireLogin, (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .select('-password')
        .then(user => {
            Post.find({ postedBy: req.params.id })
                .populate('postedBy', '_id name')
                .exec((err, posts) => {
                    if (err) return next(err)
                    res.json({ user, posts })
                })
        })
        .catch(err => {
            return next(err)
        })
})

router.put('/follow', requireLogin, (req, res, next) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, (err, result) => {
        if (err) return next(err)
        User.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }
        }, { new: true }).select('-password')
            .then(result => {
                res.json(result)
            })
            .catch(err => {
                return next(err)
            })
    })
})

router.put('/unfollow', requireLogin, (req, res, next) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: { followers: req.user._id }
    }, (err, result) => {
        if (err) return next({ error: err })
        User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.unfollowId }
        }, { new: true }).select('-password')
            .then(result => {
                res.json(result)
            })
            .catch(err => {
                return next({ error: err })
            })
    })
})

router.put('/updatepic', requireLogin, (req, res, next) => {
    User.findByIdAndUpdate(req.user._id, { $set: { pic: req.body.pic } }, { new: true },
        (err, result) => {
            if (err) return next({ error: "Pic post failed" })
            res.json(result)
        }).select('-password')
})

router.post('/search-users', (req, res, next) => {
    let userPattren = new RegExp('^' + req.body.query)
    User.find({ email: { $regex: userPattren }})
        .select('_id email')
        .then(user => {
            res.json({ user })
        })
        .catch(err => {
            return next(err)
        })
})

module.exports = router;