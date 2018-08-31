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

  /// users tests
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

  ///topic tests
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
        .get('/api/topics/Cats/articles')
        .expect(200)
        .then(response => {
          expect(response.body.articles[0]).to.contain.keys('_id', 'title', 'votes', 'created_by', 'body', 'created_at', 'belongs_to');
          expect(response.body.articles.length).to.equal(2);
        })
    })
    it('GETs returns a 404 if a valid id is used but does not exsist in this set', () => {
      return request
        .get(`/api/topics/Jeff/articles`)
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.equal('Page Not Found');
        })
    })
    it('POST a new article for a specific topic', () => {
      user = usersdata[0]._id
      return request
        .post('/api/topics/Cats/articles')
        .send({
          title: "new article", body: "This is my new article content", created_by: `${user}`
        })
        .expect(201)
        .then(response => {
          expect(response.body.article).to.contain.keys('_id', 'title', 'votes', 'created_by', 'body', 'created_at', 'belongs_to');
        })
    });
  })

  ///article tests
  describe('article test', () => {
    it('GETs all the articles', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(response => {
          console.log(response.body, '<<<<<<<<')
          console.log(response.body.articles)
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
          console.log(response.body.articles)
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
    it('GETs all the comments for a individual article', () => {
      const article1 = articlesdata[0];
      return request
        .get(`/api/articles/${article1._id}/comments`)
        .expect(200)
        .then(response => {
          expect(response.body.comments[0]).to.contain.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by');
          expect(response.body.comments.length).to.equal(2);
        })
    })
    it('GETs returns a 400 if an invalid article is used', () => {
      return request
        .get(`/api/articles/jeff/comments`)
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.equal('Bad Request');
        })
    })
    it('POST a new comment for a specific article', () => {
      userID = usersdata[0]._id
      articleID = articlesdata[0]._id
      return request
        .post(`/api/articles/${articleID}/comments`)
        .send({
          body: "This is my new comment", created_by: `${userID}`
        })
        .expect(201)
        .then(response => {
          expect(response.body.comment).to.contain.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by');
        })
    });
    it('PATCH can Increment the votes of an article by one', () => {
      articleID = articlesdata[0]._id
      return request
        .patch(`/api/articles/${articleID}?vote=up`)
        .expect(200)
        //.then(request.patch(`/api/articles/${articleID}?vote=up`))
        .then(response => {
          expect(response.body.article).to.contain.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by');
          expect(response.body.article.votes).to.equal(1);
        })
    });
    it('PATCH can Decrement the votes of an article by one', () => {
      articleID = articlesdata[0]._id
      return request
        .patch(`/api/articles/${articleID}?vote=down`)
        .expect(200)
        .then(response => {
          expect(response.body.article).to.contain.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by');
          expect(response.body.article.votes).to.equal(-1);
        })
    });

    ///comments tests
    describe('comments tests', () => {
      it('PATCH updates the number of votes of a comment', () => {
        commentID = commentsdata[0]._id
        return request
          .patch(`/api/comments/${commentID}?vote=up`)
          .expect(200)
          .then(response => {
            expect(response.body.comment).to.contain.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by');
            expect(response.body.comment.votes).to.equal(8);
          })
      })
      it('PATCH updates the number of votes of a comment', () => {
        commentID = commentsdata[0]._id
        return request
          .patch(`/api/comments/${commentID}?vote=down`)
          .expect(200)
          .then(response => {
            expect(response.body.comment).to.contain.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by');
            expect(response.body.comment.votes).to.equal(6);
          })
      })
      it('DELETE removes a comment', () => {
        commentID = commentsdata[0]._id
        return request
          .delete(`/api/comments/${commentID}`)
          .expect(200)
          .then(response => {
            expect(response.body.comment).to.contain.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by');
            return request
              .get(`/api/comments/${commentID}`)
              .expect(404)
              .then(response => {
                expect(response.body.msg).to.equal('Page Not Found');
              })
          })
      })
      it('GETs all comments', () => {
        return request
          .get('/api/comments')
          .expect(200)
          .then(response => {
            expect(response.body.comment[0]).to.contain.keys('_id', 'body', 'votes', 'created_at', 'belongs_to', 'created_by');
            expect(response.body.comment.length).to.equal(8);
          })
      })
    })
  })
})