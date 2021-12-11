const { Usuario } = require('../models/usuario');
const { Producto } = require('../models/producto');
const { Empresa } = require('../models/empresa');



/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La colección ${coleccion} no es permitida, ${colecciones}`);
    }
    return true;
}



module.exports = {

    coleccionesPermitidas
}

