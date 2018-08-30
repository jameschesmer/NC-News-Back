const topicsRouter = require('express').Router();
const { getTopics, getArticlesByTopic, postANewAtilcleWithTopic } = require('../controllers/topics')


topicsRouter.route('/')
  .get(getTopics);

topicsRouter.route('/:topic_slug/articles')
  .get(getArticlesByTopic)
  .post(postANewAtilcleWithTopic);

module.exports = topicsRouter;