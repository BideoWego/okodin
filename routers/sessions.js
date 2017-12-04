const express = require('express');
const app = express();
const router = express.Router();
const {
  User,
  Sequelize,
  Sequelize: { Op }
} = require('../models');
const h = require('../helpers');


const _unprotectedPaths = [
  h.rootPath(),
  h.newUserPath(),
  h.loginPath(),
  h.logoutPath(),
  '/sessions'
];
const _isUnprotected = path => _unprotectedPaths.includes(path);



// ----------------------------------------
// Auth
// ----------------------------------------
app.use(async (req, res, next) => {
  if (_isUnprotected(req.path)) {
    return next();
  }

  if (!req.session.userId) {
    req.flash('error', 'Please log in first');
    return res.redirect(h.loginPath());
  }

  const user = await User.findById(req.session.userId);
  if (!user) {
    req.flash('error', 'Please log in first');
    return res.redirect(h.loginPath());
  }

  req.user = user;
  res.locals.currentUser = user;
  next();
});


// ----------------------------------------
// New
// ----------------------------------------
router.get('/login', (req, res) => {
  res.render('sessions/new');
});


// ----------------------------------------
// Create
// ----------------------------------------
router.post('/sessions', async (req, res, next) => {
  try {
    const query = {
      [Op.or]: [{ email: req.body.user }, { username: req.body.user }]
    };
    const user = await User.findOne(query);
    if (!user) {
      req.flash('error', 'User not found');
      res.redirect(h.loginPath());
    }
    req.session.userId = user.id;
    res.redirect(h.rootPath());
  } catch (e) {
    next(e);
  }
});


// ----------------------------------------
// Destroy
// ----------------------------------------
const logout = (req, res, next) => {
  delete req.session.userId;
  if (req.session.userId) {
    req.flash('error', 'Unable to log out');
    res.redirect(req.session.backUrl);
  }
  res.redirect(h.loginPath());
};
router.get('/logout', logout);
router.delete('/logout', logout);




module.exports = { auth: app, router };
