const articlesRouter = require('express').Router();
const { getArticles, getCommentsForAnArticle, postANewCommentForAnArticle, changeVotes } = require('../controllers/articles');

articlesRouter.route('/')
  .get(getArticles);

articlesRouter.route('/:article_id')
  .get(getArticles)
  .patch(changeVotes);

articlesRouter.route('/:article_id/comments')
  .get(getCommentsForAnArticle)
  .post(postANewCommentForAnArticle);

module.exports = articlesRouter;