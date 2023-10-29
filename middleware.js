const { issueSchema,reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Streetguard = require('./models/streetguard');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateIssue = (req, res, next) => {
     
    const {error} = issueSchema.validate(req.body);
    if (error) {
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const adminId = '653de89ee48491d90d3029f1';
    const { id } = req.params;
    const issue = await Streetguard.findById(id);
    if (!(issue.author.equals(req.user._id)||(adminId==(req.user._id)))) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/issues/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const adminId = '653de89ee48491d90d3029f1';
    const { id,reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!(review.author.equals(req.user._id)||adminId==(req.user._id))) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/issues/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
     const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    } else {
        next();
    }
}