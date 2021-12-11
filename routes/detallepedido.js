var express = require('express');
var api = express.Router();
var DetallePedidoController = require('../controllers/detallepedido');
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/usuarios' });

api.post('/save-detallepedido', md_auth.ensureAuth, DetallePedidoController.saveDetallePedido);
api.get('/get-detalle-pedido/:idEmpresa',md_auth.ensureAuth, DetallePedidoController.getDetallePedido);
api.put('/update-detalle-pedido/:iddetallepedido', md_auth.ensureAuth, DetallePedidoController.updateDetallePedido);


module.exports = api;