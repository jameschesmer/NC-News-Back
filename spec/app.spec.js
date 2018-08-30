const app = require('../app');
const mongoose = require('mongoose');
const request = require('supertest')(app);
const seedDB = require('../seed/seed');
const { expect } = require('chai');
const { users, topics, articles, comments } = require('../seed/testData');


describe('Northcoders News API', () => {
  let usersdata, topicsdata, articlesdata, commentsdata;
  beforeEach(() => {
    return seedDB(users, topics, articles, comments)
      .then(docs => {
        [usersdata, topicsdata, articlesdata, commentsdata] = docs;
      })
  })
  after(() => {
    mongoose.disconnect();
  })
  describe('Users tests', () => {
    it('GETs all the users', () => {
      return request
        .get('/api/users')
        .expect(200)
        .then(response => {
          expect(response.body.users[0]).to.contain.keys('_id', 'username', 'name', 'avatar_url');
          expect(response.body.users.length).to.equal(2);
        })
    })
    it('GETs a specific user if a valid user is used', () => {
      return request
        .get('/api/users/butter_bridge')
        .expect(200)
        .then(response => {
          expect(response.body.user).to.contain.keys('_id', 'username', 'name', 'avatar_url');
        })
    })
    it('GETs returns a 404 if a invalid user is used', () => {
      return request
        .get(`/api/users/meeee`)
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('Page Not Found');
        })
    })
  })
  describe('topic test', () => {
    it('GETs all the topics', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(response => {
          expect(response.body.topics[0]).to.contain.keys('_id', 'title', 'slug');
          expect(response.body.topics.length).to.equal(2);
        })
    })
    it('GETs all the articles for a certain topic', () => {
      return request
        .get('/api/topics/cats/articles')
        .expect(200)
        .then(response => {
          expect(response.body.articles[0]).to.contain.keys('_id', 'title', 'votes', 'created_by', 'body', 'created_at', 'belongs_to');
          expect(response.body.topics.length).to.equal(2);
        })
    })
  })
  describe('article test', () => {
    it('GETs all the articles', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(response => {
          expect(response.body.articles[0]).to.contain.keys('_id', 'title', 'votes', 'created_by', 'body', 'created_at', 'belongs_to');
          expect(response.body.articles.length).to.equal(4);
        })
    })
    it('GETs a specific article if a valid id is used', () => {
      const article1 = articlesdata[0];
      return request
        .get(`/api/articles/${article1._id}`)
        .expect(200)
        .then(response => {
          expect(response.body.articles).to.contain.keys('_id', 'title', 'votes', 'created_by', 'body', 'created_at', 'belongs_to');
        })
    })
    it('GETs returns a 400 if a invalid id is used', () => {
      return request
        .get(`/api/articles/sausages`)
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request');
        })
    })
    it('GETs returns a 404 if a valid id is used but does not exsist in this set', () => {
      const article1 = commentsdata[0];
      return request
        .get(`/api/articles/${article1._id}`)
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('Page Not Found');
        })
    })
  })
})