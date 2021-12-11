'use stric';

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
const fileUpload = require('express-fileupload');

var app = express();

//cargar rutas
var usuario_routes = require('./routes/usuario');
var empresa_routes = require('./routes/empresa');
var producto_routes = require('./routes/producto');
var detallepedidos_routes = require('./routes/detallepedido');
var pedido_routes = require('./routes/pedido');
var uploads_routes = require('./routes/uploads');




//middelwares
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// cors // configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});


// Fileupload - Carga de archivos
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true
}));

//rutas
app.use('/api', usuario_routes);
app.use('/api', empresa_routes);
app.use('/api', producto_routes);
app.use('/api', detallepedidos_routes);
app.use('/api', pedido_routes);
app.use('/api/uploads/', uploads_routes);


//Exportar
module.exports = app;