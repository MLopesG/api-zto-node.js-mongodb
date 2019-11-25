const connectMongoSchemas = require('../../config/connect');
const usersModel = require('./../model/usersModel.js');
const jwt = require('jsonwebtoken');
const config = require('../../secret.js');
const md5 = require('md5');

module.exports.token = (req, res, next) => {
	let token = req.headers['authorization'];

	if (token) {
		if (token.startsWith('Bearer')) {
			token = token.slice(7, token.length);
		}
		jwt.verify(token, config.secret, (err, decoded) => {
			if (err) {
				return res.status(417).json({
					success: false,
					message: 'Token inválido'
				});
			} else {
				return res.json({
					success: true,
					message: 'Token válido',
					user: decoded
				});
			}
		});
	} else {
		res.status(417).json({
			success: false,
			message: 'Token de autenticação não foi fornecido'
		});
	}
};

module.exports.login = (req, res) => {
	let { check, validationResult } = require('express-validator');
	let errors = validationResult(req);

	if (!errors.isEmpty()) {
		res.status(417).json({
			status: false,
			validation: errors.array()
		});
	} else {
		usersModel.login(connectMongoSchemas.createUsers,{cpf:req.body.cpf,senha:md5(req.body.senha)}, (error,result) => {

			if (error) {
				res.status(417).json({
					status: false,
					message: 'Error ao realizar conexão.'
				});
				return;
			}

			if (result.length === 0) {
				res.json({
					status: false,
					message: 'Nenhum usuário encontrado'
				});
				return;
			}

			result.forEach((user) => {
				if (md5(req.body.senha) != user.senha) {
					res.json({
						status: false,
						message: 'Senha incorreta, tente novamente'
					});
				} else {
					let userLogin = {
						id: user._id,
						nome: user.nomeCompleto
					};

					let token = jwt.sign(userLogin, config.secret);

					res.json({
						status: true,
						token: token,
						userLogin: userLogin
					});
				}
			});
		});
	}
};