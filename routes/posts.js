const router = require('express').Router();
const User = require('../model/User');
const auth = require('./verifyToken');

router.get('/', auth, async (req, res) => {
    const posts = await User.find({_id: req.user._id});
    res.json(posts);
});
 
module.exports = router;