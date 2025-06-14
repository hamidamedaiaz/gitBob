// backend/app/models/pair.model.js
const Joi = require('joi')
const BaseModel = require('../utils/base-model')

const ImageWithPreview = Joi.object({
  file: Joi.string().required(), // Now stores the file path
  preview: Joi.string().required(), // Also stores the file path
})

module.exports = new BaseModel('Pair', {
  sourceImage: ImageWithPreview.required(),
  targetImage: ImageWithPreview.required(),
  description: Joi.string().allow('').required(), // Allow empty string
  questionId: Joi.number().required(), // This is crucial for linking pairs to questions
})
