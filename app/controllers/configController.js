const configModel = require('./../model/configModel.js');
const connectMongoSchemas = require('../../config/connect');
const fs = require('fs');
const path = require('path');

module.exports.deleteDatabase = (req, res) => {

	let senha = req.body.senha;

	if (senha == '@2019sosmaquinasdelete') {
		configModel.dropDatabase(connectMongoSchemas.createUsers, (error, result) => {
			if (error) {
				res.status(417).json({
					status: false,
					message: 'Não foi possivel limpar os dados, tem novamente.'
				});
				return;
			}
		});

		configModel.dropDatabase(connectMongoSchemas.createlistSimbolos, (error, result) => {
			if (error) {
				res.status(417).json({
					status: false,
					message: 'Não foi possivel limpar os dados, tem novamente.'
				});
				return;
			}
		});

		configModel.dropDatabase(connectMongoSchemas.createSimbolos, (error, result) => {
			if (error) {
				res.status(417).json({
					status: false,
					message: 'Não foi possivel limpar os dados, tem novamente.'
				});
				return;
			}
		});

		configModel.dropDatabase(connectMongoSchemas.createCategorias, (error, result) => {
			if (error) {
				res.status(417).json({
					status: false,
					message: 'Não foi possivel limpar os dados, tem novamente.'
				});
				return;
			}
		});

		configModel.dropDatabase(connectMongoSchemas.createPublicidades, (error, result) => {
			if (error) {
				res.status(417).json({
					status: false,
					message: 'Não foi possivel limpar os dados, tem novamente.'
				});
				return;
			}
		});


		fs.readdir('./app/public/imagens/', (err, files) => {

			if (err) {
				res.status(417).json({
					status: false,
					message: 'Não foi possivel limpar os dados, tem novamente.'
				});
				return;
			}

			if (files.length === 0) return;

			for (let i = 0; i < files.length; i++) {
				fs.unlink(path.join('./app/public/imagens/', files[i]), err => {
					if (err) {
						res.status(417).json({
							status: false,
							message: 'Não foi possivel limpar os dados, tem novamente.'
						});
						return;
					}
				});
			}
		});

		res.json({
			status: true,
			message: 'Database e imagens apagadas!'
		});
	} else {
		res.json({
			status: false,
			message: 'Senha inválida, não foi possivel prosseguir o processo.'
		});
	}
};