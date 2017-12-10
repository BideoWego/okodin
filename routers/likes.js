const express = require('express');
const app = express();
const router = express.Router();
const {
  User,
  Profile,
  Like,
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
        as: "Likers",
        include: Profile
      }, {
        model: User,
        as: "Likeds",
        include: Profile
      }],
      order: [
        ["Likers", Like, "createdAt", "DESC"],
        ["Likeds", Like, "createdAt", "DESC"]
      ]
    });
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect(h.rootPath());
    }
    const { Likers: likers, Likeds: likeds } = user;
    res.render('likes/index', { likers, likeds });
  } catch (e) {
    next(e);
  }
});




module.exports = router;
