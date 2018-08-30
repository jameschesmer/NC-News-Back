const Topic = require('../models/Topic');

const getTopics = (req, res, next) => {
  let query = {}
  //if (req.params.user_id) query = { _id: req.params.actor_id };
  return Topic.find(query)
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(err => {
      if (err.name === 'CastError') next({ status: 400, msg: 'Bad Request' });
      else next(err);
    })
}

const getArticlesByTopic = (req, res, next) => {
  let query = {}
  if (req.params.topic_slug) query = { belongs_to: req.params.topic_slug };
  console.log(query)
  return Article.find(query)
    .then(articles => {
      console.log(articles)
      res.status(200).send({ articles });
    })
    .catch(err => {
      console.log(err)
      if (err.name === 'CastError') next({ status: 400, msg: 'Bad Request' });
      else next(err);
    })
}


module.exports = { getTopics, getArticlesByTopic };