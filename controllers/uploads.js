const path = require('path');
const fs = require('fs');

const mongoose = require("mongoose");
const subirArchivo = require('../helpers/subir-archivo');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const Empresa = require('../models/empresa');

const cloudinary = require('cloudinary').v2
//cloudinary.config(process.env.CLOUDINARY_URL);
cloudinary.config({
    cloud_name: 'decmfvpjm',
    api_key: '446226495974258',
    api_secret: 'LW6QQ_LB8rfiR4gKjE4iXWPSe_c'
});



const actualizarImagenCloudinary = async (req, res) => {

    const { coleccion, id } = req.params;
    console.log(id);
    console.log(coleccion);

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }

            break;


        case 'empresas':
            modelo = await Empresa.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe la empresa con el id ${id}`
                });
            }

            break;
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });
    }




    // Limpiar imágenes previas
    console.log(modelo.imagen);
    if (modelo.imagen) {
        console.log("a");
        const nombreArr = modelo.imagen.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }



    try {
        const { tempFilePath } = req.files.archivo;
        console.log(tempFilePath + "Time valio");
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { public_id:`paquesepas/${coleccion}/${modelo.nombre}` });
        console.log(secure_url + "Esta valiendo");
        modelo.imagen = secure_url;

        await modelo.save();


        res.json(modelo);


    } catch (msg) {
        res.status(400).json({ msg });
    }


}

module.exports = {
    actualizarImagenCloudinary
}