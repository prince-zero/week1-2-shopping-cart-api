const express = require('express');
const registerCartRoutes = require('./app/routes/cart.server.routes');
const db = require('./config/database');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  db.ready.then(() => next()).catch(next);
});

app.get('/', (req, res) => {
  return res.status(200).send('Hello World!');
});

registerCartRoutes(app);

app.use((req, res) => {
  return res.sendStatus(404);
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Request body must contain valid JSON' });
  }

  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  const port = process.env.PORT || 3333;
  app.listen(port, () => {
    console.log(`ShoppingCart API listening on http://localhost:${port}`);
  });
}

module.exports = app;
