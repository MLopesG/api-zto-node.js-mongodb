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

module.exports.add = (req, res) => {
	let { check, validationResult } = require('express-validator');
	let errors = validationResult(req);

	if (!errors.isEmpty()) {
		res.status(417).json({
			status: false,
			validation: errors.array()
		});
	} else {
		usersModel.verifyCPF(connectMongoSchemas.createUsers,req.body.cpf.trim(), (error,result) => {
			if (result.length > 0) {
				res.json({
					status: false,
					message: 'CPF já sendo utilizado.'
				});
			} else {

				req.body.senha = md5(req.body.senha);

				let user = connectMongoSchemas.createUsers(req.body);

				usersModel.add(user, (error,result) => {
					if(error){
						res.status(417).json({
							message: 'Falha ao realizar processo, tente novamente.'
						});
					}else{
						res.json({
							status: true,
							message: 'Usuário foi cadastrado com sucesso.'
						});
					}	
				});
			}
		});
	}
};