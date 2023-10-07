const db = require('../../db.js');

const getTemperaturas = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM Temperatura';

    db.execute(query)
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

const getTemperatura = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM Articulo WHERE art_codigo = ?';

    db.execute(query, [id])
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

const PostTemperatura = (temperatura) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO Temperatura (IdPlaca, Temperatura, TimeStamp, Humedad) VALUES (?, ?, ?, ?)';
    console.log(query);
    const { IdPlaca, Temperatura, TimeStamp, Humedad } = temperatura;

    db.execute(query, [IdPlaca, Temperatura, TimeStamp, Humedad])
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
};

module.exports = {
  getTemperaturas,
  getTemperatura,
  PostTemperatura,
};
