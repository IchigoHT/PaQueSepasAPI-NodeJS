'use strict';

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');


var Usuario = require('../models/usuario');
var Empresa = require('../models/empresa');
var Productos = require('../models/producto');
var Pedidos = require('../models/pedido');


//crear una empresa para las empresas
function saveEmpresa(req, res) {
    var userId = req.usuario.sub;
    var params = req.body;
    var empresa = new Empresa();

    Usuario.findById(userId, (err, usuario) => {
        if (err) return res.status(500).send({ menssage: 'Error al autenticar el usuario en saveEmpresa' });

        if (!usuario) return res.status(404).send({ message: 'El usaurio del token no existe' });

        if (params.nombre && params.d_identidad && params.provincia && params.distrito && params.direccion && params.rol && params.longitud && params.latitud && params.ranking) {

            empresa.nombre = params.nombre;
            empresa.d_identidad = params.d_identidad;
            empresa.provincia = params.provincia;
            empresa.distrito = params.distrito;
            empresa.direccion = params.direccion;
            empresa.rol = params.rol;
            empresa.descripcion = params.descripcion;
            empresa.imagen = null;
            empresa.longitud = params.longitud;
            empresa.latitud = params.latitud;
            empresa.ranking = params.ranking;
            empresa.estado = '1';
            empresa.razon_social = null;
            empresa.l_funcionamiento = null;

            empresa.usuario = usuario;


            empresa.save((err, empresaStored) => {
                if (err) return res.status(500).send({ message: 'Error al guardar la empresa' });

                if (empresaStored) {
                    res.status(200).send({ empresa: empresaStored });
                } else {
                    res.status(404).send({ message: 'no se ha registrado la empresa' });
                }
            });

        } else {
            res.status(404).send({
                message: 'Envia todos los campos necesarios'
            });
        }
    });



}



//lista la empresa del usuario de manera paginada para el admin la empresa
function getEmpresaUsuario(req, res) {
    var userId = req.usuario.sub;
    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 6;

    Empresa.find({ usuario: userId }, { "__v": 0 }).paginate(page, itemsPerPage, (err, empresas, total) => {
        if (err) return res.status(500).send({ message: 'Error en el servidor' });

        if (!empresas) return res.status(404).send({ message: 'No te tiene ninguan empresa con este usuario' });

        let todosMisIds = empresas.map(x => x._id)
        console.log(todosMisIds);

        getCountPorductosPedidos(todosMisIds).then((value) => {

            return res.status(200).send({
                total: total,
                pages: Math.ceil(total / itemsPerPage),
                empresas: empresas,
                pedidos: value.pedidos,
                productos: value.productos
            });
        })




    });

}


/*Get Empresas usuarios ??ra el home*/
function getEmpresasUbicacion(req, res) {

    var paramsprovincia = req.query.provincia;
    var paramsdistrito = req.query.distrito;

    console.log(paramsprovincia);
    console.log(paramsdistrito);

    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 12;

    Empresa.find({ 'provincia': paramsprovincia, 'distrito': paramsdistrito }).sort({ ranking: -1 }).paginate(page, itemsPerPage, (err, empresaFind, total) => {
        if (err) return res.status(500).send({ menssage: 'Erro en el servidor get empresas' });

        if (!empresaFind) return res.status(404).send({ message: 'Error al listar las empresas' });

        console.log(empresaFind);
        if (empresaFind) {

            let topEmpresaUbicacion = [];
            let EmpresasUbicacion = [];

            empresaFind.forEach((emp) => {

                if (topEmpresaUbicacion.length < 3) {
                    topEmpresaUbicacion.push(emp);
                }
                if (topEmpresaUbicacion.length > 2) {
                    EmpresasUbicacion.push(emp);
                }

                console.log(emp);
            });


            return res.status(200).send({
                total: total,
                pages: Math.ceil(total / itemsPerPage),
                topEmpresas: topEmpresaUbicacion,
                notopempresas: EmpresasUbicacion
            });
        }
    });
}


/**/
function getCountersEmpresa(req, res) {
    var idEmpresa = req.params.idEmpresa;

    getCountPorductosPedidos(idEmpresa).then((value) => {
        res.status(200).send({
            pedidos: value.pedidos,
            productos: value.productos
        });
    });
}


/*Contar los Pedidos de la empresa y sus productos*/

async function getCountPorductosPedidos(empresa_id) {
    console.log("empresa: id  " + empresa_id);

    if (empresa_id) {

        var productos = await Productos.find({ empresa: { $in: empresa_id } }).exec().then((count) => {
            console.log("count: p " + count);
            return count;

        }).catch((err) => {
            return handleError(err);
        });

        var pedidos = await Pedidos.find({ empresa: { $in: empresa_id } }).exec().then((count) => {
            console.log("count: pedidos " + count);
            return count;

        }).catch((err) => {
            return handleError(err);
        });

        return {
            productos: productos,
            pedidos: pedidos
        }
    }

}





/* function getEmpresas(req, res) {

} */


//elimina la empresa para el admin
function deleteEmpresa(req, res) {
    var userId = req.usuario.sub;
    var empresaId = req.params.id;

    Empresa.find({ 'usuario': userId, '_id': empresaId }).deleteOne((err, empresaRemoved) => {
        if (err) return res.status(500).send({ message: 'Error al borrar la empresa' });

        if (empresaRemoved.deletedCount == 0) {
            return res.status(404).send({ message: 'no se ha borrado la empresa' });
        } else {
            return res.status(200).send({ message: 'se ha borrado la empresa correctamente' });
        }
    });
}


//subir imagenes de la empresa..
function uploadImagenEmpresa(req, res) {
    var empresaId = req.params.id;

    if (req.files) {
        var file_path = req.files.imagen.path;
        console.log(file_path);

        var file_split = file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[2];
        console.log(file_name);

        var ext_split = file_name.split('\.');
        console.log(ext_split);

        var file_ext = ext_split[1];
        console.log(file_ext);

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {

            Empresa.findOne({ 'usuario': req.usuario.sub, '_id': empresaId }).exec((err, empresa) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion' });
                console.log(empresa);

                if (empresa) {
                    //actulizar la imagen de la empresa.
                    Empresa.findByIdAndUpdate(empresaId, { 'imagen': file_name }, { new: true }, (err, empresaUpdate) => {
                        if (err) return res.status(500).send({ message: 'Error en la peticion' });

                        if (!empresaUpdate) return res.status(404).send({ message: 'No se ha podido actualizar la imagen de la empresa' });

                        return res.status(200).send({ empresa: empresaUpdate });
                    });

                } else {
                    return removeFileOfUploads(res, file_path, "No tienes permisos para actulizar esta empresa.");
                }

            });
        } else {
            return removeFileOfUploads(res, file_path, "Extencion no valida");
        }

    } else {
        return res.status.send({ message: 'No se han subido imagenes' });
    }
}

//Fncion para eliminar la imagen subida
function removeFileOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message });
    });
}

function getImagenFileEmpresa(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './uploads/empresas/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'Np existe la imagen' });
        }
    });
}

function getEmpresa(req, res) {

    const idEmpresa = req.params.idempresa;

    Empresa.findById(idEmpresa, (error, empresa) => {
        if (error) return res.status(500).send({ message: 'Error en el servidor' });

        if (!empresa) return res.status(404).send({ menssage: 'No se encontro ninguna empresa' });

        if (empresa) {
            return res.status(200).send({ empresa })
        }
    });
}

module.exports = {
    saveEmpresa,
    deleteEmpresa,
    getEmpresaUsuario,
    getEmpresasUbicacion,
    uploadImagenEmpresa,
    getImagenFileEmpresa,
    getCountersEmpresa,
    getEmpresa

}