const express = require('express');
const app = express();
const router = express.Router();
const {
  User,
  Sequelize,
  Sequelize: { Op }
} = require('../models');
const h = require('../helpers');
const url = require('url');


const _unprotectedRoutes = [
  { get: h.newUserPath() },
  { get: h.loginPath() },
  { get: h.logoutPath() },
  { delete: h.logoutPath() },
  { post: '/sessions' },
  { post: '/users' }
];
const _isUnprotected = req => {
  for (let i = 0; i < _unprotectedRoutes.length; i++) {
    const route = _unprotectedRoutes[i];
    const method = req.method.toLowerCase();
    const path = req.path;
    if (route[method] === path) {
      return true;
    }
  }
  return false;
};



// ----------------------------------------
// Auth
// ----------------------------------------
app.use(async (req, res, next) => {
  if (_isUnprotected(req)) {
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
      where: {
        [Op.or]: [{ email: req.body.user }, { username: req.body.user }]
      }
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
