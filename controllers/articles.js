const Article = require('../models/Article');

const getArticles = (req, res, next) => {
  let query = {}
  if (req.params.article_id) query = { _id: req.params.article_id };
  return Article.find(query)
    .then(articles => {
      if (!articles[0]) return Promise.reject({ status: 404, msg: 'Page Not Found' })
      if (articles.length === 1) {
        articles = articles[0];
        res.status(200).send({ articles });
      }
      else res.status(200).send({ articles });
    })
    .catch(err => {
      if (err.name === 'CastError') next({ status: 400, msg: 'Bad Request' });
      else next(err);
    })
}


module.exports = { getArticles };