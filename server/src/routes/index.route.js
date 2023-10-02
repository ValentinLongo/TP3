const express = require('express');
const temperaturaRouter = require('./temperatura.route.js');

const indexRouter = (io) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.send('Inicio a API');
  });

  router.use('/temperatura', temperaturaRouter(io));

  return router;
};

module.exports = indexRouter;
