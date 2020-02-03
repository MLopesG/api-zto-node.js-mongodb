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
		let urlNew = new Date().getTime() + req.files.file.name;

		let publicidade = {
			"linkPost": req.body.linkPost,
			"imagem": '/imagens/' + urlNew,
			"timePost": req.body.timePost,
			"empresaCliente": req.body.empresaCliente
		}

		categoria = connectMongoSchemas.createPublicidades(publicidade);

		categoriaModel.add(categoria, (error, result) => {
			req.files.file.mv('app/public/imagens/' + urlNew, (err) => {
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
					message: 'Publicidade foi cadastrada com sucesso.'
				});
			});
		});
	}
};

module.exports.edit = (req, res) => {
	let { check, validationResult } = require('express-validator');
	let errors = validationResult(req);
	let publicidadeEditId = req.params.id;

	if (req.method === 'GET') {

		if (!categoriaEditId) {
			res.status(417).json({
				status: false,
				message: 'Publicidade não encontrada.'
			});
		} else {
			categoriaModel.view(connectMongoSchemas.createPublicidades, (error, result) => {
				if (error) {
					res.json({
						status: true,
						categoria: result.val()
					});
				} else {
					res.status(417).json({
						status: false,
						message: 'Publicidade não encontrada.'
					});
				}
			},
				{ '_id': ObjectId(publicidadeEditId) }
			);
		}
	} else {
		if (!errors.isEmpty()) {
			res.status(417).json({
				status: false,
				validation: errors.array()
			});
		} else {
			let publicidadeEdit = {
				"linkPost": req.body.linkPost,
				"timePost": req.body.timePost,
				"empresaCliente": req.body.empresaCliente
			};

			if(req.files && req.files.file && req.files.file.name != null ){
				categoriaModel.view(connectMongoSchemas.createPublicidades, (errorView, result) => {
					if (errorView) {
						res.status(417).json({
							status: false,
							message: 'Não foi possivel encontrar imagem da publicidade, tente novamente.'
						});
					}
					if(result.length >= 1){
						fs.unlink('./app/public' + result[0].imagem, (err) => {
							if(err){
								console.log(err);
							}
						});
					}

					let urlNew = new Date().getTime() + req.files.file.name;

					req.files.file.mv('app/public/imagens/' + urlNew, (err) => {
						if (err) {
							console.log(err);
						}else{
							publicidadeEdit['imagem'] =  '/imagens/' + urlNew;

							categoriaModel.edit(connectMongoSchemas.createPublicidades, { '_id': ObjectId(publicidadeEditId) }, publicidadeEdit, (error, result) => {
								if (error) {
									res.json({
										status: false,
										message: 'Não foi possivel realizar alteração, tente novamente.'
									});
								} else {
									res.json({
										status: true,
										message: 'Publicidade editada com sucesso'
									});
								}
							});
						}
					});

				},{ '_id': ObjectId(publicidadeEditId) });
			}else{
				categoriaModel.edit(connectMongoSchemas.createPublicidades, { '_id': ObjectId(publicidadeEditId) }, publicidadeEdit, (error, result) => {
					if (error) {
						res.json({
							status: false,
							message: 'Não foi possivel realizar alteração, tente novamente.'
						});
					} else {
						res.json({
							status: true,
							message: 'Categoria editada com sucesso'
						});
					}
				});	
			}
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
		categoriaModel.view(connectMongoSchemas.createPublicidades, (errorView, result) => {
			if (errorView) {
				res.status(417).json({
					status: false,
					message: 'Não foi possivel excluir categoria, tente novamente.'
				});
				return;
			}
			fs.unlink('./app/public' + result[0].imagem, (err) => {
				categoriaModel.delete(connectMongoSchemas.createPublicidades, { "_id": ObjectId(paramsId) }, (error, result) => {
					if (!result && err) {
						res.status(417).json({
							status: false,
							message: 'Não foi possivel excluir publicidade, tente novamente.'
						});
					} else {
						res.json({
							status: true,
							message: 'publicidade foi excluida com sucesso.'
						});
					}
				});
			});
		}, { '_id': ObjectId(paramsId) });
	}
};
