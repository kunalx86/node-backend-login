const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
    validateUser,
    validateLogin
} = require('./validation');
const User = require('../model/User');

router.post('/signup', async (req, res) => {
    const {
        error
    } = validateUser(req.body);
    if (!error) {
        const emailExist = await User.findOne({
            email: req.body.email
        });

        if (emailExist) return res.status(400).send({
            'message': 'User already exists'
        });

        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPwd
        });
        console.log(user);
        user.save(err => {
            if (err) {
                console.log('Unable to save user');
                res.status(400).send(err);
            } else console.log('User saved!');
            const token = jwt.sign({
                _id: user._id
            }, process.env.TOKEN_SECRET);
            return res.header('auth-token', token).send({
                user: user.name,
                token: token
            });
        })
    } else {
        res.status(400).send(error);
    }
});

router.post('/login', async (req, res) => {
    const {
        error
    } = validateLogin(req.body);

    if (error) return res.status(400).send(error);

    const checkUser = await User.findOne({
        email: req.body.email,
    });

    if (!checkUser) return res.status(400).json({
        'message': 'Email does not exist'
    });

    const pwd = await bcrypt.compare(req.body.password, checkUser.password);

    if (pwd) {
        const token = jwt.sign({
            _id: checkUser._id
        }, process.env.TOKEN_SECRET);
        return res.header('auth-token', token).send({
            user: checkUser.name,
            token: token
        });
    }
    return res.status(400).json({
        'message': 'Password is wrong'
    });
});

module.exports = router;