const Joi = require('joi')
const BaseModel = require('../utils/base-model.js')

module.exports = new BaseModel('Profile', {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    age: Joi.number().integer().required(),
    photoUrl: Joi.string().default('assets/default-profile.jpg'),
    registrationDate: Joi.date().default(() => new Date(), 'Current date'),
    quizzesDone: Joi.number().integer().min(0).default(0),
    specialNeeds: Joi.string().allow('').optional(),
    diagnosisNotes: Joi.string().allow('').optional(),
    therapyGoals: Joi.string().allow('').optional(),
    favoriteQuizIds: Joi.array().items(Joi.number()).default([]),
})
