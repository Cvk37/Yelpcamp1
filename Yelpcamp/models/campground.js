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
const CampgroundSchema = new Schema({
    title : String,
    price : Number,
    images : [ImageSchema],
    description : String,
    location : String,
    author : {
     type: Schema.Types.ObjectId,
     ref:'User'
    },
    reviews:[{
     type:Schema.Types.ObjectId,
     ref:'Review'
    }]
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