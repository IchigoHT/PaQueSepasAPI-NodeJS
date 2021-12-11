
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DetallePedidoSchema = Schema({
    fechacreacion: String,
    fechaentrega: String,
    descripcion: String,
    direccion: String,
    total: String,
    usuario: {type: Schema.ObjectId, ref: 'Usuario'},
    empresa: {type: Schema.ObjectId, ref: 'Empresa'},
    estado: String,
});

module.exports = mongoose.model('Detallepedido', DetallePedidoSchema);