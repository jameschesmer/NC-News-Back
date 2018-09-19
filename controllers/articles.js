const Article = require('../models/Article');
const Comment = require('../models/Comment');

const getArticles = (req, res, next) => {
  let query = {};
  if (req.params.article_id) query = { _id: req.params.article_id };
  return Article.find(query)
    .lean()
    .populate('created_by')
    .then(articles => {
      const commentsPerArticle = articles.map(article => {
        return Comment.count({ belongs_to: article._id });
      });
      return Promise.all([
        articles,
        Promise.all(commentsPerArticle)
      ]);
    })
    .then(([articles, comment_count]) => {
      if (!articles[0]) return Promise.reject({ status: 404, msg: 'Page Not Found' });
      if (articles.length === 1) {
        articles = articles[0];
        res.status(200).send({ articles: { ...articles, comment_count: comment_count[0] } });
      }
      else {
        const obj = [];
        for (let i = 0; i < articles.length; i++) {
          obj.push({ ...articles[i], comment_count: comment_count[i] });
        }
        res.status(200).send({ articles: obj });
      }
    })
    .catch(err => {
      if (err.name === 'CastError') next({ status: 400, msg: 'Bad Request' });
      else next(err);
    });
};

const getCommentsForAnArticle = (req, res, next) => {
  let query = {};
  if (req.params.article_id) query = { belongs_to: req.params.article_id };
  return Comment.find(query)
    .then(comments => {
      if (!comments[0]) return Promise.reject({ status: 404, msg: 'Page Not Found' });
      else res.status(200).send({ comments });
    })
    .catch(err => {
      if (err.name === 'CastError') next({ status: 400, msg: 'Bad Request' });
      else next(err);
    });
};

const postANewCommentForAnArticle = (req, res, next) => {
  Comment.create({ ...req.body, belongs_to: req.params.article_id })
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(err => {
      next(err);
    });
};

const changeVotes = (req, res, next) => {
  let option;
  if (req.query.vote === 'up') {
    option = { $inc: { votes: 1 } };
  } else if (req.query.vote === 'down') {
    option = { $inc: { votes: -1 } };
  } else option = null;
  return Article.findByIdAndUpdate(req.params.article_id, option, { new: true })
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => {
      next(err);
    });
};


module.exports = { getArticles, getCommentsForAnArticle, postANewCommentForAnArticle, changeVotes };