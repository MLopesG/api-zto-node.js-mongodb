const categoriaModel = require('./../model/publicidadeModel.js');
const connectMongoSchemas = require('../../config/connect');
const fs = require('fs');
let ObjectId = require('mongodb').ObjectID;

module.exports.view = (req, res) => {
	let idPublicidadeFilter = req.params.idPublicidade;
	let filter = !idPublicidadeFilter ? {} : { '_id': ObjectId(idPublicidadeFilter) };

	categoriaModel.view(connectMongoSchemas.createPublicidades, (error, result) => {
		if (error) {
			res.status(417).json({
				status: false,
				message: 'Falha ao listar publicidade.'
			});
		} else {
			res.json({
				status: true,
				publicidades: result
			});
		}
	}, filter);
};
