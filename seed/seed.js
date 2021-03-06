const mongoose = require('mongoose');
const { User, Article, Comment, Topic } = require('../models');
const { createRef, formattArticleData, formattedComments } = require('../utils');

const seedDB = (usersData, topicsData, articlesData, commentsData) => {
  return mongoose.connection.dropDatabase()
    .then(() => {
      /// insert users and topics
      return Promise.all([
        User.insertMany(usersData),
        Topic.insertMany(topicsData)
      ]);
    })
    ///then insert articles
    .then(([users, topics]) => {
      const usernameLink = createRef(usersData, users, 'username', '_id');
      const slugLink = createRef(topicsData, topics, 'slug', 'title');
      return Promise.all([
        formattArticleData(articlesData, usernameLink, slugLink),
        users,
        topics
      ]);
    })
    .then(([formattedArticle, users, topics]) => {
      return Promise.all([
        Article.insertMany(formattedArticle),
        users,
        topics
      ]);
    })
    ///then insert comments
    .then(([articles, users, topics]) => {
      return Promise.all([
        users,
        topics,
        articles,
        Comment.insertMany(formattedComments(users, articles, commentsData))
      ]);
    })
    .catch(console.log);
};

module.exports = seedDB;