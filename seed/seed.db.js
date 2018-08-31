const mongoose = require('mongoose');
const seedDB = require('./seed');
const { DB_URL = require('../config').DB_URL } = process.env;
const usersData = require('./devData/users.json');
const topicsData = require('./devData/topics.json');
const articlesData = require('./devData/articles.json');
const commentsData = require('./devData/comments.json');

mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`Connected to ${DB_URL}...`);
    return seedDB(usersData, topicsData, articlesData, commentsData)
  })
  .then(() => {
    console.log(`Seeded data for database ${DB_URL}`);
    return mongoose.disconnect();
  })
  .then(() => {
    console.log(`Disconnected from ${DB_URL}`);
  })

