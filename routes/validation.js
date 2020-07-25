const Joi = require('@hapi/joi');

const validateUser = data => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).regex(/^[a-zA-Z]\w{3,14}$/).required()
    });
    return schema.validate(data);
}

const validateLogin = data => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).regex(/^[a-zA-Z]\w{3,14}$/).required()
    });
    return schema.validate(data);
}

module.exports.validateUser = validateUser;
module.exports.validateLogin = validateLogin;