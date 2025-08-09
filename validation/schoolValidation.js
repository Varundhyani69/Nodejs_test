const Joi = require('joi');

const schoolValidationSchema = Joi.object({
    name: Joi.string().min(1).required(),
    address: Joi.string().min(1).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
});

module.exports = schoolValidationSchema;
