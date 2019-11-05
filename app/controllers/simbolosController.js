const simbolosModel = require('./../model/simbolosModel.js');
const connectMongoSchemas = require('../../config/connect');
let ObjectId = require('mongodb').ObjectID;
const fs = require('fs');

module.exports.add = (req, res) => {
	let { check, validationResult } = require('express-validator');
	let errors = validationResult(req);

	if (!errors.isEmpty()) {
		res.status(417).json({
			status: false,
			validation: errors.array()
		});
	} else {
		if (!req.files) {
			res.status(417).json({
				status: false,
				validation: [
					{ value: "", msg: "Imagem não pode ser salva, tente novamente.", param: "file", location: "body" }
				]
			});
			return;
		}

		let simbolos = {
			"descricaoSimbolo": req.body.descricaoSimbolo,
			"idCategoria": req.body.idCategoria,
			"tituloSimbolo": req.body.tituloSimbolo,
			"causasSimbolo": req.body.causasSimbolo,
			"solucoesSimbolo":req.body.solucoesSimbolo,
			"imagem": '/imagens/' + req.files.file.name
		}

		simbolos = connectMongoSchemas.createSimbolos(simbolos);

		simbolosModel.add(simbolos, (error,result) => {
			req.files.file.mv('app/public/imagens/' + req.files.file.name, (err) => {
				if (err || error) {
					res.status(417).json({
						status: false,
						validation: [
							{ value: "", msg: "Imagem ou simbolo não pode ser salva , tente novamente.", param: "file", location: "body" }
						]
					});
					return;
				}
				res.json({
					status: true,
					message: 'Simbolo foi cadastrada com sucesso.'
				});
			});
		});
	}
};

module.exports.edit = (req, res) => {
	let { check, validationResult } = require('express-validator');
	let errors = validationResult(req);
	let simbolosEditId = req.params.id;

	if (req.method === 'GET') {

		if (!categoriaEditId) {
			res.status(417).json({
				status: false,
				message: 'Simbolo não encontrada.'
			});
		} else {
			simbolosModel.view(connectMongoSchemas.createSimbolos,(error,result) => {
				if(error){
					res.status(417).json({
						status: false,
						message: 'Simbolo não encontrada.'
					});
				}else{
					res.json({
						status: true,
						simbolos: result
					});
				}
			},
				{'_id': ObjectId(simbolosEditId)}
			);
		}
	} else {
		if (!errors.isEmpty()) {
			res.status(417).json({
				status: false,
				validation: errors.array()
			});
		} else {
			simbolosModel.edit(connectMongoSchemas.createSimbolos,{'_id': ObjectId(simbolosEditId)}, req.body,(error,result)=>{
				if (error) {
					res.status(417).json({
						status: false,
						message: 'Não foi possivel realizar alteração, tente novamente.'
					});
				} else {
					res.json({
						status: true,
						message: 'Simbolo editada com sucesso'
					});
				}
			},{'_id': ObjectId(simbolosEditId)});
		}
	}
};

module.exports.delete = (req, res) => {
	let paramsId = req.params.id;

	if (!paramsId) {
		res.status(417).json({
			status: false,
			message: 'Informe categoria para continuar o processo de exclusão.'
		});
	} else {
		simbolosModel.view(connectMongoSchemas.createSimbolos,(errorView,result) => {
			if (errorView) {
				res.status(417).json({
					status: false,
					message: 'Não foi possivel excluir simbolo, tente novamente.'
				});
				return;
			}
			fs.unlink('./app/public' + result.imagem, (err) => {
				simbolosModel.delete(connectMongoSchemas.createSimbolos,{"_id" : ObjectId(paramsId)},(error,result)=>{
					if (!result && err) {
						res.status(417).json({
							status: false,
							message: 'Não foi possivel excluir simbolo, tente novamente.'
						});
					} else {
						res.json({
							status: true,
							message: 'Simbolo foi excluida com sucesso.'
						});
					}
				});
			});
		},{'_id': ObjectId(paramsId)});
	}
};

module.exports.view = (req, res) => {
	let idCateFilter = req.params.idCategoria;
	let filter = !idCateFilter ? {} : {'_id': ObjectId(idCateFilter)};

	simbolosModel.view(connectMongoSchemas.createSimbolos,(error,result) => {
		if(error){
			res.status(417).json({
				message: 'Falha ao listar simbolos.'
			});
		}else{
			res.json({
				status: true,
				simbolos: result
			});
		}
	}, filter);
};

module.exports.search = (req, res) => {

	let search = req.body.search;

	simbolosModel.search(connectMongoSchemas.createSimbolos,(error,result) => {
		if(error){
			res.status(417).json({
				message: 'Falha ao listar simbolo.'
			});
		}else{
			res.json({
				status: true,
				simbolos: result
			});
		}
	}, {tituloSimbolo:search});
};

module.exports.subCategorias = (req, res) => {
	let idCategoriaFilter = req.params.idCategoria;

	simbolosModel.search(connectMongoSchemas.createSimbolos,(error,result) => {
		if(error){
			res.status(417).json({
				message: 'Falha ao listar subcategorias.'
			});
		}else{
			res.json({
				status: true,
				simbolos: result
			});
		}
	},
		{'idCategoria':idCategoriaFilter}
	);
};