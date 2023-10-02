const temperaturaService = require('../services/temperatura.service.js');

const getTemperaturas = (req, res) => {
  temperaturaService
    .getTemperaturas()
    .then((result) => {
      res.status(200).json({
        message: 'Temperatura recuperada exitosamente',
        data: result[0],
      });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

const createTemperatura = (io) => {
  return async (req, res) => {
    const temperatura = req.body;

    try {
      await temperaturaService.PostTemperatura(temperatura);

      // Emitir los datos de temperatura a través de WebSockets solo después del POST
      io.emit('temperatura_data', temperatura);

      res.status(200).json({
        message: 'Temperatura creada exitosamente',
        data: temperatura,
      });
    } catch (err) {
      res.status(500).send(err);
    }
  };
};

module.exports = {
  getTemperaturas,
  createTemperatura,
};
