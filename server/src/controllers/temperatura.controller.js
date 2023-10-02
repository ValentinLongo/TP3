const temperaturaService = require("../services/temperatura.service.js");

const getTemperaturas = (req,res) =>{
    temperaturaService
    .getTemperaturas()
    .then((result) => {
        res.status(200).json({
            message: "temperatura retrieved successfully",
            data: result[0],
        })
    })
    .catch((err) => {
        res.status(500).send(err)
    })
};

const getTemperatura = (req,res) =>{
    const {id} = req.params; 
    temperaturaService
    .getTemperatura(id)
    .then((result) => {
        res.status(200).json({
            message: "temperatura retrieved successfully",
            data: result[0],
        })
    })
    .catch((err) => {
        res.status(500).send(err)
    })
};

// const createTemperatura = (req,res) =>{
//     const temperatura = req.body;
//     temperaturaService
//     .PostTemperatura(temperatura)
//     .then(() => {
//         res.status(200).json({
//             message: "temperatura created successfully",
//             data: temperatura,
//         })
//     })
//     .catch((err) => {
//         res.status(500).send(err)
//     })
// };

const createTemperatura = (io) => {
    return async (req, res) => {
      const temperatura = req.body;

      temperaturaService
        .PostTemperatura(temperatura)
        .then(() => {
          // Emitir los datos de temperatura a través de WebSockets a todos los usuarios conectados
          io.emit('temperatura_data', temperatura);

          res.status(200).json({
            message: "temperatura created successfully",
            data: temperatura,
          });
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    };
  };

module.exports = {
    getTemperaturas,
    getTemperatura,
    createTemperatura
};
