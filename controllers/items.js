
const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

router.get('/new', (req, res) => {
    res.render('new.ejs')
});
router.get('/items', (req, res) => {
  res.render('/items.ejs')
});
router.post('/', async (req, res) => {
  try {
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Push req.body (the new form data object) to the
    // applications array of the current user
    currentUser.items.push(req.body);
    // Save changes to the user
    await currentUser.save();
    // Redirect back to the applications index view
    res.redirect(`/items`);
  } catch (error) {
    // If any errors, log them and redirect back home
    console.log(error);
    res.redirect('/');
  }
});
// controllers/applications.js

router.get('/', async (req, res) => {
  try {
    // Look up the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Render index.ejs, passing in all of the current user's
    // applications as data in the context object.
    res.render('items.ejs', {
      items: currentUser.items,
    });
  } catch (error) {
    // If any errors, log them and redirect back home
    console.log(error);
    res.redirect('/');
  }
});
router.put('/items', async (req, res) => {
  try {
    // Find the user from req.session
    const currentUser = await User.findById(req.session.user._id);
    // Find the current application from the id supplied by req.params
    const itemDatabase = currentUser.items.id(req.params.item);
    // Use the Mongoose .set() method
    // this method updates the current application to reflect the new form
    // data on `req.body`
    application.set(req.body);
    // Save the current user
    await currentUser.save();
    // Redirect back to the show view of the current application
    res.redirect(
      `/users/${currentUser._id}/items/${req.params.itemDatabase}`
    );
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});
// controllers/applications.js

router.get('/items/:itemId/edit', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const item = currentUser.items.id(req.params.applicationId);
    res.render('items/edit.ejs', {
      items: 'price,description,sellers Agreement, name, color,'
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});
router.delete('/items/:itemId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.items.id(req.params.itemId).deleteOne();
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/items`);
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;
