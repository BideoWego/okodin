const express = require('express');
const app = express();
const router = express.Router();
const {
  User,
  Profile,
  sequelize,
  Sequelize: { Op }
} = require('../models');
const h = require('../helpers');


// ----------------------------------------
// Extract User Params
// ----------------------------------------
const _extractUserParams = req => ({
  userParams: {
    username: req.body.user.username,
    email: req.body.user.email
  }
});


// ----------------------------------------
// Extract Profile Params
// ----------------------------------------
const _extractProfileParams = req => ({
  profileParams: {
    birthday: new Date(req.body.birthday),
    city: req.body.city,
    education: req.body.education,
    occupation: req.body.occupation,
    gender: req.body.gender,
    maritalStatus: req.body.marital_status,
    height: req.body.height,
    bodyType: req.body.body_type,
    numChildren: req.body.num_children,
    about: req.body.about,
    talents: req.body.talents,
    favorites: req.body.favorites,
    incentive: req.body.incentive
  }
});


// ----------------------------------------
// Set Default Search Settings
// ----------------------------------------
const _searchSettings = settings => {
  const r = (s, i) => {
    s[i] = true;
    return s;
  };

  const defaults = {
    gender: Profile.GENDERS.reduce(r, {}),
    maritalStatuses: Profile.MARITAL_STATUSES.reduce(r, {}),
    bodyTypes: Profile.BODY_TYPES.reduce(r, {}),
    height: {
      min: 4 * 12,
      max: 6 * 12
    },
    age: {
      min: 20,
      max: 45
    },
    hasChildren: ['yes', 'no'].reduce(r, {})
  };

  return Object.assign(defaults, settings);
};


// ----------------------------------------
// Build Search Query
// ----------------------------------------
const _buildSearchQuery = req => {
  if (h.isEmpty(req.query)) {
    return {};
  }

  const {
    gender: genders = Profile.GENDERS,
    marital_status: maritalStatuses = Profile.MARITAL_STATUSES,
    body_types: bodyTypes = Profile.BODY_TYPES,
    has_children_yes: hasChildrenYes,
    has_children_no: hasChildrenNo,
    age,
    height
  } = req.query;

  let numChildren = 0;
  let numChildrenOp = Op.gte;
  if (hasChildrenYes && !hasChildrenNo) {
    numChildren = 1;
  } else if (!hasChildrenYes && hasChildrenNo) {
    numChildrenOp = Op.eq;
  }

  const birthday = {
    max: h.ago(age.min, 'years').endOf('year').toDate().toISOString().slice(0, 10),
    min: h.ago(age.max, 'years').startOf('year').toDate().toISOString().slice(0, 10)
  };

  return {
    [Op.and]: [
      { userId: { [Op.ne]: req.session.userId } },
      { gender: { [Op.in]: genders } },
      { maritalStatus: { [Op.in]: maritalStatuses } },
      { bodyType: { [Op.in]: bodyTypes } },
      { numChildren: { [numChildrenOp]: numChildren } },
      { birthday: sequelize.where(sequelize.fn('DATE_TRUNC', 'YEAR', sequelize.col('birthday')), '>=', birthday.min) },
      { birthday: sequelize.where(sequelize.fn('DATE_TRUNC', 'YEAR', sequelize.col('birthday')), '<=', birthday.max) },
      { height: { [Op.between]: [+height.min, +height.max] } }
    ]
  };
};


// ----------------------------------------
// Update Search Settings in Session
// ----------------------------------------
const _updateSearchSettings = req => {
  const r = (s, i) => {
    s[i] = true;
    return s;
  };

  const {
    gender=[],
    marital_status: maritalStatuses=[],
    body_types: bodyTypes=[],
    has_children_yes: hasChildrenYes,
    has_children_no: hasChildrenNo,
    age={},
    height={}
  } = req.query;

  const hasChildren = [];
  !(hasChildrenYes) || hasChildren.push('yes');
  !(hasChildrenNo) || hasChildren.push('no');

  const updated = {
    gender: gender.reduce(r, {}),
    maritalStatuses: maritalStatuses.reduce(r, {}),
    bodyTypes: bodyTypes.reduce(r, {}),
    height,
    age,
    hasChildren: hasChildren.reduce(r, {})
  };

  return Object.assign(req.session.searchSettings, updated);
};


// ----------------------------------------
// Search Settings
// ----------------------------------------
app.use((req, res, next) => {
  req.session.searchSettings = _searchSettings(req.session.searchSettings);
  res.locals.searchSettings = req.session.searchSettings;
  next();
});


// ----------------------------------------
// Index
// ----------------------------------------
router.get('/', async (req, res, next) => {
  try {
    const query = _buildSearchQuery(req);
    const users = await User.findAll({
      include: [{
        model: Profile,
        where: query
      }]
    });

    const genders = Profile.GENDERS;
    const maritalStatuses = Profile.MARITAL_STATUSES;
    const bodyTypes = Profile.BODY_TYPES;

    _updateSearchSettings(req);
    res.render('users/index', { users, genders, maritalStatuses, bodyTypes });
  } catch (e) {
    next(e);
  }
});


// ----------------------------------------
// New
// ----------------------------------------
router.get('/new', (req, res) => {
  if (req.session.userId) {
    req.flash('Please log out to sign up');
    return res.redirect(h.rootPath());
  }

  res.render('users/new');
});


// ----------------------------------------
// Edit
// ----------------------------------------
router.get('/edit', async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId, { include: Profile });
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect(h.usersPath());
    }

    const genders = Profile.GENDERS;
    const maritalStatuses = Profile.MARITAL_STATUSES;
    const bodyTypes = Profile.BODY_TYPES;

    res.render('users/edit', { user, genders, maritalStatuses, bodyTypes });
  } catch (e) {
    next(e);
  }
});


// ----------------------------------------
// Show
// ----------------------------------------
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id, { include: Profile });
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
    const { userParams } = _extractUserParams(req);

    await sequelize.transaction(async t => {
      t = { transaction: t };
      const user = await User.create(userParams, t);
      const profile = await Profile.create({ userId: user.id }, t);
      req.flash('success', 'User created! Please login')
      res.redirect(h.loginPath());
    });
  } catch (e) {
    next(e);
  }
});


// ----------------------------------------
// Update
// ----------------------------------------
router.put('/', async (req, res, next) => {
  try {
    const { profileParams } = _extractProfileParams(req);

    await Profile.update(
      profileParams,
      { where: { userId: req.session.userId }, limit: 1 }
    );
    res.redirect(h.userPath(req.session.userId));
  } catch (e) {
    next(e);
  }
});


// ----------------------------------------
// Destroy
// ----------------------------------------
router.delete('/', async (req, res, next) => {
  try {
    await User.destroy({ where: { id: req.session.userId }, limit: 1 });
    res.redirect(h.usersPath());
  } catch (e) {
    next(e);
  }
});




module.exports = { searchSettings: app, router };
