const Joi = require('joi')

module.exports = Joi.object({
    id: Joi.number().required(),
    title: Joi.string().required(),
    content: Joi.string().required(),
    date: Joi.date().required(),
})
