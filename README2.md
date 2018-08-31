###Northcoders News
A restful API that gets data from the Northcoders news database.

https://northcoders-news-jwrc.herokuapp.com/api/

###Getting Started
create config 

e.g 
const ENV = process.env.NODE_ENV || 'development';
const config = {
  development: {
    DB_URL: 'mongodb://localhost:27017/northcoders_news',
    PORT: 9090
  },
  test: {
    DB_URL: 'mongodb://localhost:27017/northcoders_news'
  },
  production: {
    DB_URL: 'address'
  }
}

module.exports = config[ENV];

npm run seed:test to seed database

### Prerequisites
supertest
nodemon
chai
node V10.4.0
mongo v3.6.3

###Examples
api/articles
api/users/:username i.e. api/users/tickle122

###Running the tests
npm test

These tests for the happy case and as some unhappy cases

  describe('Users tests', () => {
    it('GETs all the users', () => {
      return request
        .get('/api/users')
        .expect(200)
        .then(response => {
          expect(response.body.users[0]).to.contain.keys('_id', 'username', 'name', 'avatar_url');
          expect(response.body.users.length).to.equal(usersdata.length);
        })
    })

This tests that the response given has the correct keys and that it returns the correct number of users.

###Built With
body-parser
express
node
mongoose
ejs

###Authors
James 

###Acknowledgments
Northcoders Staff :) 