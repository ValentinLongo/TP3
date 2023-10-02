const http = require('http');
const express = require('express');
const cors = require('cors');
const db = require('./db.js');
const indexRouter = require('./src/routes/index.route.js');
const bodyParser = require('body-parser');
const temperaturaService = require('./src/services/temperatura.service.js');

const app = express();
const corsOptions = {
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders:
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  credentials: true,
};

app.use(cors(corsOptions));
const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: { origin: '*' },
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

app.use('/', indexRouter(io));

io.on('connection', async (socket) => {
  console.log('Se ha conectado un cliente');

  socket.broadcast.emit('chat_message', {
    usuario: 'INFO',
    mensaje: 'Se ha conectado un nuevo usuario',
  });

  // try {
  //   const temperaturaData = await temperaturaService.getTemperaturas();
  //   // Suponiendo que temperaturaData.data es un objeto con datos de temperatura
  //   socket.emit('temperatura_data', temperaturaData); // Emitir los datos de temperatura al cliente conectado
  // } catch (error) {
  //   console.error('Error al obtener datos de temperatura:', error);
  // }

  socket.on('chat_message', (data) => {
    io.emit('chat_message', data);
  });
});

server.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});

db.connect()
  .then(() => {
    console.log('Conectado');
  })
  .catch((err) => {
    console.log('Error: ', err);
  });
