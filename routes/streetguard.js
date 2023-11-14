const express = require('express');
const router = express.Router();
const issues = require('../controllers/issues');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn,isAuthor,validateIssue } = require('../middleware');
const Streetguard = require('../models/streetguard');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })





router.route('/')
    .get( catchAsync(issues.index))
    .post(isLoggedIn,upload.array('image'), validateIssue, catchAsync(issues.createIssue))

router.get('/dashboard',isLoggedIn,issues.renderDashboard,catchAsync(issues.index))
router.get('/new', isLoggedIn, issues.renderNewForm)



router.route('/:id')
    .get(isLoggedIn, catchAsync(issues.showIssue))
    .put(isLoggedIn,isAuthor,upload.array('image'), validateIssue, catchAsync(issues.updateIssue))
    .delete(isLoggedIn,isAuthor, catchAsync(issues.deleteIssue))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(issues.renderEditForm));




module.exports = router;