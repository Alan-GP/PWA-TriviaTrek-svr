const express = require("express");
const helmet = require('helmet');
const cors = require('cors');
const http = require('http');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const { config } = require('./utils/config');
const { db } = require('./utils/firebase');

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

const puerto = config.PUERTO;
const mensajeArranque = `${new Date()}🚀 Servidor TriviaTrek iniciado | Puerto: ${puerto}`;

let server;
let tipoConexion = '';
try {
	tipoConexion = 'https';
	server = https
		.createServer({
			key: fs.readFileSync(config.RUTA_KEY),
			cert: fs.readFileSync(config.RUTA_CERT),
		},
			app);
		} catch (error) {
	tipoConexion = 'http';
	server = http
		.createServer(app);
}


server.listen(puerto);
server.on('listening', () => console.info(mensajeArranque + ` ${tipoConexion}`));

app.get('/', (req, res) => {
	res.send('🌎 Servidor TriviaTrek');
});

/* Rutas */
require('./routers')(app);

app.use((err, req, res, next) => {
	console.error(err);
    res.status(500).send('Error interno del servidor.');
});

app.use((req, res, next) => {
	res.status(404).send('Petición no válida.');
});