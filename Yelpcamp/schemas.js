const Joi = require('joi')
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title:Joi.string().required(),
        price:Joi.number().required().min(0),
        // images: Joi.array().items(
        //     Joi.object({
        //           url: Joi.string().required(),
        //           filename: Joi.string().required()
        //     }).required()
    //   ).required(),
        location:Joi.string().required(),
        description:Joi.string().required(),
    }).required(),
    deleteImages:Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    }).required()
})