const express = require('express');
const router = express.Router();
const catchAsync = require('../errors/catchAsync');
const Campground = require('../models/campground');

const {isLoggedIn,validateCampground,isAuthor} = require('../isLoggedIn');


router.get('/',catchAsync( async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
})) 
router.get('/new',isLoggedIn,(req,res)=>{
    res.render('campgrounds/new')
})
router.post('/',isLoggedIn,validateCampground, catchAsync(async (req,res,next)=>{
   
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success','Sucessfully saved Campground')
    res.redirect(`/campgrounds/${campground._id}`)
    
}))

router.get('/:id',isLoggedIn ,catchAsync (async(req,res,next)=>{
   
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    console.log(campground)
    if(!campground){
        req.flash('error','Cannot find the Campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}))
router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync( async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
     res.render('campgrounds/edit',{campground})
}))
router.put('/:id',isLoggedIn, isAuthor,validateCampground, catchAsync ( async(req,res)=>{
    const {id}=req.params;
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success','Sucessfully updated Campground')
    res.redirect(`/campgrounds/${camp._id}`)
}))
router.delete('/:id',isLoggedIn,isAuthor, catchAsync (async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('del','Sucessfully deleted Campground')
    res.redirect('/campgrounds');

}))


module.exports = router;