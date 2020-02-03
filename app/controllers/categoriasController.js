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

		let urlNew = new Date().getTime() + req.files.file.name;

		let categoria = {
			"categoria": req.body.categoria,
			"imagem": '/imagens/' + urlNew
		}

		categoria = connectMongoSchemas.createCategorias(categoria)

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
			categoriaModel.view(connectMongoSchemas.createCategorias, (error, result) => {
				if (error) {
					res.status(417).json({
						status: false,
						message: 'Categoria não encontrada.'
					});
				} else {
					res.json({
						status: true,
						categoria: result
					});
				}
			},
				{ '_id': ObjectId(categoriaEditId) }
			);
		}
	} else {
		if (!errors.isEmpty()) {
			res.status(417).json({
				status: false,
				validation: errors.array()
			});
		} else {
			let categoriaEdit = {
				"categoria": req.body.categoria,
			}

			if(req.files && req.files.file && req.files.file.name != null){;
				categoriaModel.view(connectMongoSchemas.createCategorias, (error, result) => {
					if (error) {
						res.json({
							status: true,
							message: 'Categoria não encontrada.'
						});
					} else {
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
								categoriaEdit['imagem'] =  '/imagens/' + urlNew;
								categoriaModel.edit(connectMongoSchemas.createCategorias, { '_id': ObjectId(categoriaEditId) }, categoriaEdit, (error, result) => {	

									if (error) {
										return res.json({
											status: false,
											message: 'Não foi possivel realizar alteração, tente novamente.'
										});
									} else {
										res.json({
											status: true,
											message: 'Categoria editado com sucesso'
										});
									}
								});
							}
						});
					}		
				},
					{ '_id': ObjectId(categoriaEditId) }
				);
			}else{
				categoriaModel.edit(connectMongoSchemas.createCategorias, { '_id': ObjectId(categoriaEditId) }, categoriaEdit, (error, result) => {
					console.log('entrou 1');
					if (error) {
						res.json({
							status: false,
							message: 'Não foi possivel realizar alteração, tente novamente.'
						});
					} else {
						res.json({
							status: true,
							message: 'Categoria editado com sucesso'
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
		categoriaModel.view(connectMongoSchemas.createCategorias, (errorView, result) => {
			if (errorView) {
				res.status(417).json({
					status: false,
					message: 'Não foi possivel excluir categoria, tente novamente.'
				});
				return;
			}
			fs.unlink('./app/public' + result[0].imagem, (err) => {
				categoriaModel.delete(connectMongoSchemas.createCategorias, { "_id": ObjectId(paramsId) }, (error, result) => {
					if (!result && err) {
						res.status(417).json({
							status: false,
							message: 'Não foi possivel excluir categoria, tente novamente.'
						});
					} else {
							categoriaModel.view(connectMongoSchemas.createSimbolos, (errorView, result1) => {
							if (errorView) {
								res.status(417).json({
									status: false,
									message: 'Não foi possivel excluir simbolo, tente novamente.'
								});
							}

							if(result1.length === 0){
								return res.json({
									status: true,
									message: 'Categoria excluida sucesso.'
								});
							}

							fs.unlink('./app/public' + result1[0].imagem, (err) => {
								categoriaModel.delete(connectMongoSchemas.createSimbolos, { "_id": ObjectId(paramsId) }, (error, result2) => {
									if (!result2 && err) {
										res.status(417).json({
											status: false,
											message: 'Não foi possivel excluir simbolo, tente novamente.'
										});
									} else {
										categoriaModel.delete(connectMongoSchemas.createlistSimbolos, { "idSimbolo": paramsId }, (errorList, result3) => {
											if (errorList) {
												res.status(417).json({
													status: false,
													message: 'Não foi possivel excluir simbolo, tente novamente.'
												});
											} else {
												res.json({
													status: true,
													message: 'Categoria, simbolos e lista de soluções e causas, foram excluidas com sucesso.'
												});
											}
										});
									}
								});
							});
						}, { 'idCategoria': ObjectId(paramsId) });
					}
				});
			});
		}, { '_id': ObjectId(paramsId) });
	}
};

module.exports.view = (req, res) => {
	let idCateFilter = req.params.idCategoria;
	let filter = !idCateFilter ? {} : { '_id': ObjectId(idCateFilter) };

	categoriaModel.view(connectMongoSchemas.createCategorias, (error, result) => {
		if (error) {
			res.status(417).json({
				message: 'Falha ao listar usuário.'
			});
		} else {
			res.json({
				status: true,
				categoria: result
			});
		}
	}, filter);
};

module.exports.search = (req, res) => {

	let search = req.body.search;

	categoriaModel.search(connectMongoSchemas.createCategorias, (error, result) => {
		if (error) {
			res.status(417).json({
				status: false,
				message: 'Falha ao listar usuário.'
			});
		} else {
			res.json({
				status: true,
				categoria: result
			});
		}
	}, { categoria: { '$regex': search } });
};