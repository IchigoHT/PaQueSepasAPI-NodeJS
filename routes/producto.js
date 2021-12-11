'use strict';

var express = require('express');
var api = express.Router();
var ProductoController = require('../controllers/producto');
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/productos' });

api.post('/save-producto/:idEmpresa', md_auth.ensureAuth, ProductoController.saveProducto);
//listad los productos de todas las empresas
api.get('/get-productos-empresas/:page?', ProductoController.getProductosEmpresas);

//listad los productos de una las empresas
api.get('/get-productos-empresa/:idEmpresa', md_auth.ensureAuth, ProductoController.getProductosEmpresa);

api.put('/update-producto-empresa/:idEmpresa/:idProducto', md_auth.ensureAuth, ProductoController.updateProducto);

api.post('/upload-imagen-pro/:id', [md_auth.ensureAuth, md_upload], ProductoController.uploadImagenProducto);

api.get('/get-imagen-pro/:imageFile', ProductoController.getImagenFileProducto);

module.exports = api;