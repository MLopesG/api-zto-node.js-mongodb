const categoriaModel = require('./../model/categoriasModel.js');
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

		let categoria = {
			"categoria": req.body.categoria,
			"imagem": '/imagens/' + req.files.file.name
		}

		categoria = connectMongoSchemas.createCategorias(categoria)

		categoriaModel.add(categoria, (error,result) => {
			req.files.file.mv('app/public/imagens/' + req.files.file.name, (err) => {
				if (err || error) {
					res.status(417).json({
						status: false,
						validation: [
							{ value: "", msg: "Imagem não pode ser salva, tente novamente.", param: "file", location: "body" }
						]
					});
					return;
				}
				res.json({
					status: true,
					message: 'Categoria foi cadastrada com sucesso.'
				});
			});
		});
	}
};

module.exports.edit = (req, res) => {
	let { check, validationResult } = require('express-validator');
	let errors = validationResult(req);
	let categoriaEditId = req.params.id;

	if (req.method === 'GET') {

		if (!categoriaEditId) {
			res.status(417).json({
				status: false,
				message: 'Categoria não encontrada.'
			});
		} else {
			categoriaModel.view(connectMongoSchemas.createCategorias,(error,result) => {
				if(error){
					res.status(417).json({
						status: false,
						message: 'Categoria não encontrada.'
					});
				}else{
					res.json({
						status: true,
						categoria: result
					});
				}
			},
				{'_id': ObjectId(categoriaEditId)}
			);
		}
	} else {
		if (!errors.isEmpty()) {
			res.status(417).json({
				status: false,
				validation: errors.array()
			});
		} else {
			categoriaModel.edit(connectMongoSchemas.createCategorias,{'_id': ObjectId(categoriaEditId)}, req.body,(error,result)=>{
				if (error) {
					res.status(417).json({
						status: false,
						message: 'Não foi possivel realizar alteração, tente novamente.'
					});
				} else {
					res.json({
						status: true,
						message: 'Categoria editada com sucesso'
					});
				}
			},{'_id': ObjectId(categoriaEditId)});
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
		categoriaModel.view(connectMongoSchemas.createCategorias,(errorView,result) => {
			if (errorView) {
				res.status(417).json({
					status: false,
					message: 'Não foi possivel excluir categoria, tente novamente.'
				});
				return;
			}
			fs.unlink('./app/public' + result.imagem, (err) => {
				categoriaModel.delete(connectMongoSchemas.createCategorias,{"_id" : ObjectId(paramsId)},(error,result)=>{
					if (err && !result) {
						res.status(417).json({
							status: false,
							message: 'Não foi possivel excluir categoria, tente novamente.'
						});
					} else {
						res.json({
							status: true,
							message: 'Usuário foi excluida com sucesso.'
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

	categoriaModel.view(connectMongoSchemas.createCategorias,(error,result) => {
		if(error){
			res.status(417).json({
				message: 'Falha ao listar usuário.'
			});
		}else{
			res.json({
				status: true,
				categoria: result
			});
		}
	}, filter);
};

module.exports.search = (req, res) => {

	let search = req.body.search;

	categoriaModel.search(connectMongoSchemas.createCategorias,(error,result) => {
		if(error){
			res.status(417).json({
				status: false,
				message: 'Falha ao listar usuário.'
			});
		}else{
			res.json({
				status: true,
				categoria: result
			});
		}
	}, {categoria:search});
};