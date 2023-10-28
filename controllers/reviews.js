const Streetguard = require('../models/streetguard')
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const issue = await Streetguard.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    issue.reviews.push(review);
    await review.save();
    await issue.save();
    req.flash('success','Created a new Review!')
    res.redirect(`/issues/${issue._id}`);
}

module.exports.deleteReview=async (req, res) => {
    const { id, reviewId } = req.params;
    await Streetguard.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted a Review!')
    res.redirect(`/issues/${id}`);
}