const User = require('../models/User');

const getUsers = (req, res, next) => {
  let query = {};
  if (req.params.user_id) query = { username: req.params.user_id };
  return User.find(query)
    .then(users => {
      if (!users[0]) return Promise.reject({ status: 404, msg: 'Page Not Found' });
      if (users.length === 1) {
        let user = users[0];
        res.status(200).send({ user });
      }
      else res.status(200).send({ users });
    })
    .catch(err => {
      if (err.name === 'CastError') next({ status: 400, msg: 'Bad Request' });
      else next(err);
    });
};


module.exports = { getUsers };