const express = require('express');
const router = express.Router();
const {
  User,
  sequelize
} = require('../models');
const h = require('../helpers');


const _extractParams = req => ({
  userParams: {
    username: req.body.user.username,
    email: req.body.user.email
  }
});


// ----------------------------------------
// Index
// ----------------------------------------
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.render('users/index', { users });
  } catch (e) {
    next(e);
  }
});


// ----------------------------------------
// New
// ----------------------------------------
router.get('/new', (req, res) => {
  res.render('users/new');
});


// ----------------------------------------
// Edit
// ----------------------------------------
router.get('/:id/edit', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect(h.usersPath());
    }
    res.render('users/edit', { user })
  } catch (e) {
    next(e);
  }
});


// ----------------------------------------
// Show
// ----------------------------------------
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect(h.usersPath());
    }
    res.render('users/show', { user })
  } catch (e) {
    next(e);
  }
});


// ----------------------------------------
// Create
// ----------------------------------------
router.post('/', async (req, res, next) => {
  try {
    const { userParams } = _extractParams(req);

    const user = await User.create(userParams);
    res.redirect(h.userPath(user.id));
  } catch (e) {
    next(e);
  }
});


// ----------------------------------------
// Update
// ----------------------------------------
router.put('/:id', async (req, res, next) => {
  try {
    const { userParams } = _extractParams(req);

    await User.update(
      userParams,
      { where: { id: req.params.id }, limit: 1 }
    );
    res.redirect(h.userPath(req.params.id));
  } catch (e) {
    next(e);
  }
});


// ----------------------------------------
// Destroy
// ----------------------------------------
router.delete('/:id', async (req, res, next) => {
  try {
    await User.destroy({ where: { id: req.params.id }, limit: 1 });
    res.redirect(h.usersPath());
  } catch (e) {
    next(e);
  }
});




module.exports = router;
