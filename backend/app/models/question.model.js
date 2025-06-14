const Joi = require('joi')
const BaseModel = require('../utils/base-model')

module.exports = new BaseModel('Question', {
  type: Joi.string().valid('action-objet', 'succession-taches').required(),
  pairsCount: Joi.number().required(),
  quizId: Joi.number().required(), // This is essential for linking questions to quizzes
  // Note: We don't store pairs directly in the question, they're linked via questionId
})
