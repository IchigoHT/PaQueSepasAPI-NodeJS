var express = require('express');
var PedidoController = require('../controllers/pedido');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/empresas' });


api.post('/save-pedido', md_auth.ensureAuth, PedidoController.savePedido);
api.delete('/delete-pedido/:idpedido', md_auth.ensureAuth, PedidoController.EliminarPedido);
api.get('/get-pedido/:idpetallepedido', md_auth.ensureAuth, PedidoController.getPedidos);


module.exports = api;