const Streetguard = require('../models/streetguard');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
module.exports.index = async (req, res) => {
    const issues = await Streetguard.find({});
    res.render('issues/index', { issues })
}

module.exports.renderDashboard = async(req, res) => {
    const issues = await Streetguard.find({});
    res.render('issues/dashboard',{issues});
}

module.exports.renderNewForm=(req, res) => {
    res.render('issues/new');
}


module.exports.createIssue=async (req, res, next) => { 
    const geoData=await geocoder.forwardGeocode({
        query: req.body.issue.location,
        limit:1
    }).send()
    
    
    const issue = new Streetguard(req.body.issue);
    issue.geometry = geoData.body.features[0].geometry;
    issue.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    issue.author = req.user._id;
    issue.adminId = '653de89ee48491d90d3029f1';//for admin 
    await issue.save();
    
    req.flash('success','Successfully made a new issue')
    res.redirect(`/issues/${issue._id}`)
}

module.exports.showIssue=async (req, res) => {
    const issue = await Streetguard.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path:'author'
        }  
    }).populate('author');
    if (!issue) {
        req.flash('error', 'Cannot find that Issue');
        return res.redirect('/issues');
    }
    res.render('issues/show', { issue });
}

module.exports.renderEditForm=async (req, res) => {
    const { id } = req.params;
    const issue = await Streetguard.findById(id)
    if (!issue) {
        req.flash('error', 'Cannot find that Issue');
        return res.redirect('/issues');
    }
   
    res.render('issues/edit', { issue });
}

module.exports.updateIssue=async (req, res) => {
    const { id } = req.params;
    
    const issue = await Streetguard.findByIdAndUpdate(id, { ...req.body.issue });
    const imgs=req.files.map(f => ({ url: f.path, filename: f.filename }))
    issue.images.push(...imgs);
    await issue.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await issue.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully updated an issue')
    res.redirect(`/issues/${issue._id}`)
}

module.exports.deleteIssue=async (req, res) => {
    const { id } = req.params;
    await Streetguard.findByIdAndDelete(id);
    req.flash('success','Successfully deleted an Issue!')
    res.redirect('/issues');
}