const express = require('express');
const app = express();
const router = express.Router();
const {
  User,
  Profile,
  View,
  sequelize,
  Sequelize: { Op }
} = require('../models');
const h = require('../helpers');


// ----------------------------------------
// Index
// ----------------------------------------
router.get('/', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id, {
      include: [{
        model: User,
        as: "Viewers"
      }, {
        model: User,
        as: "Vieweds"
      }],
      order: [
        ["Viewers", View, "createdAt", "DESC"],
        ["Vieweds", View, "createdAt", "DESC"]
      ]
    });
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect(h.rootPath());
    }
    const { Viewers: viewers, Vieweds: vieweds } = user;
    res.render('views/index', { viewers, vieweds });
  } catch (e) {
    next(e);
  }
});




module.exports = router;
