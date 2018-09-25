const Topic = require('../models/Topic');
const Article = require('../models/Article');
const Comment = require('../models/Comment');


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
    .lean()
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
      } else {
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