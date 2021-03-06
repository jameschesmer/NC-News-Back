const express = require('express');
const mongoose = require('mongoose');
const apiRouter = require('./Routers/apiRouter');
const bodyParser = require('body-parser');
const { DB_URL = require('./config.js').DB_URL } = process.env;
const cors = require('cors');


const app = express();
app.use((cors({
  methods: ['POST', 'GET', 'DELETE', 'PATCH']
})));
app.use(bodyParser.json());
mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`connected to ${DB_URL}...`);
  });

app.use('/api', apiRouter);

app.get('/*', (req, res, next) => {
  next({ status: 404, msg: 'Page Not Found' });
});

app.use((err, req, res, next) => {
  if (err.status) res.status(err.status).send(err);
  else res.status(500).send({ msg: 'Internal server error', status: 500 });
});

module.exports = app;