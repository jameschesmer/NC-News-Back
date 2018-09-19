const Topic = require('../models/Topic');
const Article = require('../models/Article');

const getTopics = (req, res, next) => {
  let query = {};
  //if (req.params.topic_id) query = { _id: req.params.topic_id };
  return Topic.find(query)
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(err => {
      if (err.name === 'CastError') next({ status: 400, msg: 'Bad Request' });
      else next(err);
    });
};

const getArticlesByTopic = (req, res, next) => {
  let query = {};
  if (req.params.topic_slug) query = { belongs_to: req.params.topic_slug };
  return Article.find(query)
    .then(articles => {
      if (!articles[0]) return Promise.reject({ status: 404, msg: 'Page Not Found' });
      else res.status(200).send({ articles });
    })
    .catch(err => {
      if (err.name === 'CastError') next({ status: 400, msg: 'Bad Request' });
      else next(err);
    });
};

const postANewAtilcleWithTopic = (req, res, next) => {
  Article.create({ ...req.body, belongs_to: req.params.topic_slug })
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(err => {
      next(err);
    });
};

module.exports = { getTopics, getArticlesByTopic, postANewAtilcleWithTopic };