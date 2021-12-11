
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Pedido = require('../models/pedido');
var Producto = require('../models/producto');

//Guardar Pedido. de la empresa
function savePedido(req, res) {

    var userId = req.usuario.sub;
    var productoId = req.body.producto;
    var params = req.body;
    var pedido = new Pedido();

    Producto.findOne({ '_id': productoId }).populate('empresa').exec((err, productoEncontrado) => {
        if (err) return res.status(500).send({ message: 'Error al listar producto del pedido' });

        if (!productoEncontrado) return res.status(404).send({ message: 'El producto del pedido no existe' });

        console.log(productoEncontrado);
        if (productoEncontrado) {

            if (params.cantidad && params.subtotal) {

                pedido.cantidad = params.cantidad;
                pedido.subtotal = params.subtotal;
                pedido.producto = productoEncontrado;
                pedido.detallepedido = params.detallepedido;
                pedido.producto = productoId;
                pedido.estado = '1';


                pedido.save((err, PedidoStored) => {
                    if (err) return res.status(500).send({ message: 'Error al guardar el Pedido' });

                    if (PedidoStored) {
                        res.status(200).send({ pedido: PedidoStored });
                    } else {
                        res.status(404).send({ message: 'No se ha guardado el Pedido' });
                    }
                });
            } else {
                res.status(404).send({
                    message: ' Envia todos los campos necesarios del Detalle Pedido'
                });
            }
        } else {
            return res.status(404).send({ message: 'No te tiene ninguna Producto  con este ID' });
        }

    });

}


function EliminarPedido(req, res) {
    var userId = req.usuario.sub;
    var PedidoId = req.params.idpedido;

    Pedido.findByIdAndDelete(PedidoId, (err, pedidoStored) => {
        if (err) return res.status(500).send({ message: 'Error al listar producto del pedido' });

        if (!pedidoStored) return res.status(404).send({ message: 'El producto del pedido no existe' });

        if (pedidoStored) {
            return res.status(200).send({ message: 'Se elimino el Pedido' });
        }
    });
}

function getPedidos(req, res) {
    var idDetallePedido = req.params.idpetallepedido;
    var userId = req.usuario.sub;

    Pedido.find({ 'detallepedido': idDetallePedido}).populate('producto').exec((err, pedidoStored) => {
        if (err) return res.status(500).send({ message: 'Error al listar pedido de detalle pedido' });

        if (!pedidoStored) return res.status(404).send({ message: 'El detalle no tiene ningun pedido ' });

        if (pedidoStored) {
            return res.status(200).send({ pedidos: pedidoStored });
        }

    });
}

module.exports = {
    savePedido,
    EliminarPedido,
    getPedidos
}