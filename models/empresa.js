'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmpresaSchema = Schema({
    d_identidad: String,
    role: String,
    nombre: String,
    imagen: String,
    descripcion:String,
    razon_social: String,
    l_funcionamiento: String,
    provincia: String,
    distrito: String,
    longitud:String,
    latitud:String,
    ranking:String,
    direccion: String,
    usuario: { type: Schema.ObjectId, ref: 'Usuario' },
    estado: String

});

module.exports = mongoose.model('Empresa', EmpresaSchema);