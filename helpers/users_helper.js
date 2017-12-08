

const UsersHelper = {};


UsersHelper.usersPath = () => '/users';
UsersHelper.userPath = id => `/users/${ id }`;
UsersHelper.newUserPath = () => '/users/new';
UsersHelper.editUserPath = () => `/users/edit`;
UsersHelper.destroyUserPath = id => `/users/${ id }/?_method=delete`;

UsersHelper.userImagePath = user => `/assets/images/viking_${ user.Profile.gender === 'male' ? 'guy' : 'girl' }.jpg`;
UsersHelper.feetInches = inches => {
  const foot = 12;
  const feet = Math.floor(inches / foot);
  const remainder = inches % foot;
  let feetInches = `${ feet }'`;
  feetInches += remainder ? ` ${ inches % foot }"` : '';
  return feetInches;
};



module.exports = UsersHelper;
