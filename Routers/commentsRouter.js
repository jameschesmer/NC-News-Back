const commentsRouter = require('express').Router();
const { changeVotes, removeComment, getComments } = require('../controllers/comments');

commentsRouter.route('/')
  .get(getComments);

commentsRouter.route('/:comment_id')
  .get(getComments)
  .patch(changeVotes)
  .delete(removeComment);


module.exports = commentsRouter;