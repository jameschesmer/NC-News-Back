const app = require('./app');
const { PORT = require('./config').PORT } = process.env;

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`server listening on ${PORT}...`);
});