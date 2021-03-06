
var express = require('express');
var EmpresaController = require('../controllers/empresa');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/empresas' });

api.post('/empresa', md_auth.ensureAuth, EmpresaController.saveEmpresa);
api.get('/empresa/:idempresa', EmpresaController.getEmpresa)

api.delete('/empresa/:id', md_auth.ensureAuth, EmpresaController.deleteEmpresa);
api.get('/empresas-usuario', md_auth.ensureAuth, EmpresaController.getEmpresaUsuario);

api.post('/upload-imagen-emp/:id', [md_auth.ensureAuth, md_upload], EmpresaController.uploadImagenEmpresa);

api.get('/get-imagen-emp/:imageFile', EmpresaController.getImagenFileEmpresa);

api.get('/empresas/:page?', EmpresaController.getEmpresasUbicacion);

api.get('/get-counters/:idEmpresa', md_auth.ensureAuth, EmpresaController.getCountersEmpresa);

module.exports = api;