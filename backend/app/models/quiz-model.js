// backend/app/models/quiz-model.js
const Joi = require('joi')
const BaseModel = require('../utils/base-model')
const QuizConfig = require('./quiz-config.model')

module.exports = new BaseModel('Quiz', {
    name: Joi.string().required(),
    theme: Joi.string().required(),
    config: QuizConfig.required(),
    // questions is not stored directly in the quiz, they're linked via quizId
    // so we don't include it in the schema
})
