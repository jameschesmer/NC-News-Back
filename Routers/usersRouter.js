const usersRouter = require('express').Router();
const { getUsers } = require('../controllers/users');


usersRouter.route('/')
  .get(getUsers);

usersRouter.route('/:user_id')
  .get(getUsers);

module.exports = usersRouter;