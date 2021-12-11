const { Router } = require('express');
const { validarArchivoSubir } = require('../middlewares/validar-archivo');
const { actualizarImagenCloudinary } = require('../controllers/uploads');
const md_auth = require('../middlewares/authenticated');

const router = Router();

router.put('/:coleccion/:id', [md_auth.ensureAuth,validarArchivoSubir,], actualizarImagenCloudinary);

module.exports = router;