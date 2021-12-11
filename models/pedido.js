
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PedidoSchema = Schema({
    cantidad: String,
    subtotal: String,
    empresa: { type: Schema.ObjectId, ref: 'Empresa' },
    detallepedido: { type: Schema.ObjectId, ref: 'Detallepedido' },
    producto: {type:Schema.ObjectId, ref: 'Producto'},
    estado: String,
});

module.exports = mongoose.model('Pedido', PedidoSchema);