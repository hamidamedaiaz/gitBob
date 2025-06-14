// backend/app/models/quiz-config.model.js
const Joi = require('joi')

const HintSchema = Joi.object({
  text: Joi.string().allow('', null).optional(),  // Allow empty string and null
  image: Joi.string().uri().allow(null, '').optional(), // Allow null and empty string
  audio: Joi.string().uri().allow(null, '').optional(),
  video: Joi.string().uri().allow(null, '').optional(),
})

const QuizConfigSchema = Joi.object({
  taillePolice: Joi.number().required(),
  tailleImage: Joi.number().required(),
  luminosite: Joi.number().required(),
  feedbackSucces: Joi.string().required(),
  feedbackEchec: Joi.string().required(),
  typeIndice: Joi.boolean().required(),
  chronometre: Joi.boolean().required(),
  ordreAleatoire: Joi.boolean().required(),
  background: Joi.object({
    type: Joi.string().valid('color', 'image', 'video').required(),
    value: Joi.string().required(), // ex: code couleur, chemin image, URL vidéo
  }).required(),
  hint: HintSchema.required(),
})

module.exports = QuizConfigSchema
