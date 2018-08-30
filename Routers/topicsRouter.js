const topicsRouter = require('express').Router();
const { getTopics, getArticlesByTopic } = require('../controllers/topics')


topicsRouter.route('/')
  .get(getTopics);

topicsRouter.route('/:topic_slug/articles')
  .get(getArticlesByTopic)

module.exports = topicsRouter;