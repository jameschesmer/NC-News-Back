const Comment = require('../models/Comment');

const getComments = (req, res, next) => {
  let query = {};
  if (req.params.comment_id) query = { _id: req.params.comment_id };
  return Comment.find(query)
    .then(comment => {
      if (!comment[0]) return Promise.reject({ status: 404, msg: 'Page Not Found' });
      if (comment.length === 1) {
        comment = comment[0];
        res.status(200).send({ comment });
      }
      else res.status(200).send({ comment });
    })
    .catch(err => {
      if (err.name === 'CastError') next({ status: 400, msg: 'Bad Request' });
      else next(err);
    });
};

const changeVotes = (req, res, next) => {
  let option;
  if (req.query.vote === 'up') {
    option = { $inc: { votes: 1 } };
  } else if (req.query.vote === 'down') {
    option = { $inc: { votes: -1 } };
  } else option = null;
  return Comment.findByIdAndUpdate(req.params.comment_id, option, { new: true })
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(err => {
      next(err);
    });
};

const removeComment = (req, res, next) => {
  return Comment.findByIdAndDelete(req.params.comment_id)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(err => {
      next(err);
    });
};

module.exports = { changeVotes, removeComment, getComments };