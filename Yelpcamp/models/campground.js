const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')
const {cloudinary} = require('../cloudinary')
const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');

});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title : String,
    price : Number,
    images : [ImageSchema],
    description : String,
    geometry: {
      type: {
          type: String,
          enum: ['Point'],
          required: true
      },
      coordinates: {
          type: [Number],
          required: true
      }
  },
   location: String,
    author : {
     type: Schema.Types.ObjectId,
     ref:'User'
    },
    reviews:[{
     type:Schema.Types.ObjectId,
     ref:'Review'
    }]
},opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
     return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});

CampgroundSchema.post('findOneAndDelete', async function(
    campground
  ) {
    if (campground.reviews) {
      await Review.deleteMany({
        _id : { $in: campground.reviews }
      });
    }
    if (campground.images) {
      for (const img of campground.images) {
        await cloudinary.uploader.destroy(img.filename);
      }
    }
  });

module.exports= mongoose.model('Camp',CampgroundSchema);