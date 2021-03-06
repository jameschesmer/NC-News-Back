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
      });
  });
  after(() => {
    mongoose.disconnect();
  });

  /// users tests
  describe('Users tests', () => {
    it('GETs all the users', () => {
      return request
        .get('/api/users')
        .expect(200)
        .then(response => {
          expect(response.body.users[0]).to.contain.keys('_id', 'username', 'name', 'avatar_url');
          expect(response.body.users.length).to.equal(usersdata.length);
        });
    });
    it('GETs a specific user if a valid user is used', () => {
      return request
        .get('/api/users/butter_bridge')
        .expect(200)
        .then(response => {
          expect(response.body.user).to.contain.keys('_id', 'username', 'name', 'avatar_url');
        });
    });
    it('GETs returns a 404 if a invalid user is used', () => {
      return request
        .get('/api/users/meeee')
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('Page Not Found');
        });
    });
  });

  ///topic tests
  describe('topic test', () => {
    it('GETs all the topics', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(response => {
          expect(response.body.topics[0]).to.contain.keys('_id', 'title', 'slug');
          expect(response.body.topics.length).to.equal(topicsdata.length);
        });
    });
    it('GETs all the articles for a certain topic', () => {
      return request
        .get('/api/topics/Cats/articles')
        .expect(200)
        .then(response => {
          expect(response.body.articles[0]).to.contain.keys('_id', 'title', 'votes', 'created_by', 'body', 'created_at', 'belongs_to');
          expect(response.body.articles.length).to.equal(2);
        });
    });
    it('GETs returns a 404 if a valid id is used but does not exsist in this set', () => {
      return request
        .get('/api/topics/Jeff/articles')
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('Page Not Found');
        });
    });
    it('POST a new article for a specific topic', () => {
      let user = usersdata[0]._id;
      return request
        .post('/api/topics/Cats/articles')
        .send({
          title: 'new article', body: 'This is my new article content', created_by: `${user}`
        })
        .expect(201)
        .then(response => {
          expect(response.body.article).to.contain.keys('_id', 'title', 'votes', 'created_by', 'body', 'created_at', 'belongs_to');
        });
    });
  });

  ///article tests
  describe('article test', () => {
    it('GETs all the articles', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(response => {
          expect(response.body.articles[0]).to.contain.keys('_id', 'title', 'votes', 'created_by', 'body', 'created_at', 'belongs_to');
          expect(response.body.articles.length).to.equal(articlesdata.length);
        });
    });
    it('GETs a specific article if a valid id is used', () => {
      const article1 = articlesdata[0];
      return request
        .get(`/api/articles/${article1._id}`)
        .expect(200)
        .then(response => {
          expect(response.body.articles._id).to.equal(`${article1._id}`);
          expect(response.body.articles).to.contain.keys('_id', 'title', 'votes', 'created_by', 'body', 'created_at', 'belongs_to');
        });
    });
    it('GETs returns a 400 if a invalid id is used', () => {
      return request
        .get('/api/articles/sausages')
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request');
        });
    });
    it('GETs returns a 404 if a valid id is used but does not exsist in this set', () => {
      const article1 = commentsdata[0];
      return request
        .get(`/api/articles/${article1._id}`)
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('Page Not Found');
        });
    });
    it('GETs all the comments for a individual article', () => {
      const article1 = articlesdata[0];
      return request
        .get(`/api/articles/${article1._id}/comments`)
        .expect(200)
        .then(response => {
          expect(response.body.comments[0]).to.contain.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by');
          expect(response.body.comments.length).to.equal(2);
        });
    });
    it('GETs returns a 400 if an invalid article is used', () => {
      return request
        .get('/api/articles/jeff/comments')
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request');
        });
    });
    it('POST a new comment for a specific article', () => {
      let userID = usersdata[0]._id;
      let articleID = articlesdata[0]._id;
      return request
        .post(`/api/articles/${articleID}/comments`)
        .send({
          body: 'This is my new comment', created_by: `${userID}`
        })
        .expect(201)
        .then(response => {
          expect(response.body.comment).to.contain.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by');
        });
    });
    it('PATCH can Increment the votes of an article by one', () => {
      let articleID = articlesdata[0]._id;
      return request
        .patch(`/api/articles/${articleID}?vote=up`)
        .expect(200)
        .then(response => {
          expect(response.body.article._id).to.equal(`${articleID}`);
          expect(response.body.article).to.contain.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by');
          expect(response.body.article.votes).to.equal(articlesdata[0].votes + 1);
        });
    });
    it('PATCH can Decrement the votes of an article by one', () => {
      let articleID = articlesdata[0]._id;
      return request
        .patch(`/api/articles/${articleID}?vote=down`)
        .expect(200)
        .then(response => {
          expect(response.body.article._id).to.equal(`${articleID}`);
          expect(response.body.article).to.contain.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by');
          expect(response.body.article.votes).to.equal(articlesdata[0].votes - 1);
        });
    });
  });

  ///comments tests
  describe('comments tests', () => {
    it('PATCH updates the number of votes of a comment', () => {
      let commentID = commentsdata[0]._id;
      return request
        .patch(`/api/comments/${commentID}?vote=up`)
        .expect(200)
        .then(response => {
          expect(response.body.comment._id).to.equal(`${commentID}`);
          expect(response.body.comment).to.contain.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by');
          expect(response.body.comment.votes).to.equal(commentsdata[0].votes + 1);
        });
    });
    it('PATCH updates the number of votes of a comment', () => {
      let commentID = commentsdata[0]._id;
      return request
        .patch(`/api/comments/${commentID}?vote=down`)
        .expect(200)
        .then(response => {
          expect(response.body.comment._id).to.equal(`${commentID}`);
          expect(response.body.comment).to.contain.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by');
          expect(response.body.comment.votes).to.equal(commentsdata[0].votes - 1);
        });
    });
    it('DELETE removes a comment', () => {
      let commentID = commentsdata[0]._id;
      return request
        .delete(`/api/comments/${commentID}`)
        .expect(200)
        .then(response => {
          expect(response.body.comment).to.contain.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by');
          expect(response.body.comment._id).to.equal(`${commentID}`);
          return request
            .get(`/api/comments/${commentID}`)
            .expect(404)
            .then(response => {
              expect(response.body.msg).to.equal('Page Not Found');
            });
        });
    });
    it('GETs all comments', () => {
      return request
        .get('/api/comments')
        .expect(200)
        .then(response => {
          expect(response.body.comment[0]).to.contain.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by');
          expect(response.body.comment.length).to.equal(commentsdata.length);
        });
    });
    it('GETs a comment by id', () => {
      let commentID = commentsdata[0]._id;
      return request
        .get(`/api/comments/${commentID}`)
        .expect(200)
        .then(response => {
          expect(response.body.comment).to.contain.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by');
          expect(response.body.comment._id).to.equal(`${commentID}`);
        });
    });
  });
});
