const Joi = require('joi')

module.exports = Joi.object({
    // Le fichier image devient un nom de fichier ou URL
    file: Joi.string().required(), // ex: "image123.jpg" ou "/uploads/image.jpg"
    preview: Joi.string().uri().optional(), // ex: URL ou blob, selon ton backend
})
