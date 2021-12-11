'use strict';

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Pedido = require('../models/pedido');
var Detallepedido = require('../models/detallepedido');


//Guardar Pedido. de la empresa
function saveDetallePedido(req, res) {
    var userId = req.usuario.sub;
    var params = req.body;
    var detallepedido = new Detallepedido();


    if (params.direccion) {

        detallepedido.fechacreacion = moment().format('LT : DD/MM/YY');
        detallepedido.fechaentrega = null;
        detallepedido.descripcion = null;
        detallepedido.direccion = params.direccion;
        detallepedido.total = params.total;
        detallepedido.usuario = userId;
        detallepedido.empresa = params.empresa;
        detallepedido.estado = '5';


        detallepedido.save((err, detallepedidoStored) => {
            if (err) return res.status(500).send({ message: 'Error al guardar el pedido' });

            if (detallepedidoStored) {
                res.status(200).send({ detallepedido: detallepedidoStored });
            } else {
                res.status(404).send({ message: 'No se ha guardado el detallepedido' });
            }
        });
    } else {
        res.status(404).send({
            message: ' Envia todos los campos necesarios del detallepedido'
        });
    }


};


function getDetallePedido(req, res) {

    const idEmpresa = req.params.idEmpresa;

    Detallepedido.find({ empresa: idEmpresa, 'estado': { $ne: 5 } }).populate('usuario').exec((err, detallePedido) => {
        if (err) return res.status(500).send({ message: 'Error al listar el detalle pedido' });

        if (!detallePedido) return res.status(404).send({ message: 'No se ha lisatdo pedidos de la empresa verificar id' });

        if (detallePedido) {
            res.status(200).send({
                detallepedido: detallePedido
            });
        }
    });


}

function getDetallePedidoEmpresa(req, res) {

    const idEmpresa = req.params.idEmpresa;


    Detallepedido.find({ empresa: idEmpresa }).populate('usuario').exec((err, detallePedido) => {
        if (err) return res.status(500).send({ message: 'Error al listar el detalle pedido' });

        if (!detallePedido) return res.status(404).send({ message: 'No se ha lisatdo pedidos de la empresa verificar id' });

        if (detallePedido) {
            res.status(200).send({
                detallepedido: detallePedido
            });
        }
    });




}


// Edicion de datos de usuario
function updateDetallePedido(req, res) {

    var idDetallePedido = req.params.iddetallepedido;
    var update = req.body;


    update.fechacreacion = moment().format('LT : DD/MM/YY');
    update.estado = '1';


    //Borrar la propiedad 
    delete update._id;
    delete update.fechaentrega;
    delete update.descripcion;
    delete update.empresa;
    
    

    console.log(update);

    Detallepedido.findByIdAndUpdate(idDetallePedido, update, { new: true }, (err, DetallePedidoUpdated) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });

        if (!DetallePedidoUpdated) return res.status(404).send({ message: 'No se a podido actualizar el DetallePedido' });

        return res.status(200).send({ detallepedido: DetallePedidoUpdated });
    });

}




module.exports = {
    saveDetallePedido,
    getDetallePedido,
    updateDetallePedido
}
