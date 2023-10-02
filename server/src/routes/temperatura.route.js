const express = require('express');
const { getTemperaturas, createTemperatura } = require('../controllers/temperatura.controller.js');

const temperaturaRouter = (io) => {
  const router = express.Router();

  router.get('/', getTemperaturas);
  router.post('/', createTemperatura(io));

  return router;
};

module.exports = temperaturaRouter;
