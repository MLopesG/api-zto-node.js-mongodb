const mongoose = require('mongoose');

mongoose.connect('mongodb://kamino.mongodb.umbler.com:40611/api-zto',{useNewUrlParser: true}).then().catch((err)=>{
   console.log('Ocorreu um erro ao conectar ao banco');
});

const userAdminSchema = new mongoose.Schema({
	email:{
		type:String,
		require:true
	},
	senha:{
		type:String,
		require:true 
	}});
const usersSchema = new mongoose.Schema({
	cpf:{
		type:Number,
		require:true
	},
	empresa:{
		type : String,
		require: true,
	},
	marcaVeiculo:{
		type : String,
		require: true,
	},
	tipoVeiculo:{
		type : String,
		require: true,
	},
	nomeCompleto:{
		type : String,
		require: true,
	},
	senha:{
		type:String,
		require:true 
	}});
const publicidadesSchema = new mongoose.Schema({
	imagem:{
		type:String,
		require:true
	},
	linkPost:{
		type : String,
		require: true,
	},
	timePost:{
		type : Number,
		require: true,
	}});
const categoriasSchema = new mongoose.Schema({
	categoria:{
		type:String,
		require:true
	},
	imagem:{
		type : String,
		require: true,
	}});
const simbolosSchema = new mongoose.Schema({
	descricaoSimbolo:{
		type:String,
		require:true
	},
	idCategoria:{
		type : String,
		require: true,
	},
	imagem:{
		type : String,
		require: true,
	},
	tituloSimbolo:{
		type : String,
		require: true,
	},
	causasSimbolo:{
		type : Array,
		require: true,
	},
	solucoesSimbolo:{
		type : Array,
		require: true,
	}});

const createUserAdmin = mongoose.model('UserAdmin', userAdminSchema);
const createUsers = mongoose.model('Users', usersSchema);
const createPublicidades = mongoose.model('Publicidades', publicidadesSchema);
const createCategorias = mongoose.model('Categorias', categoriasSchema);
const createSimbolos = mongoose.model('Simbolos', simbolosSchema);

module.exports = {
	createUserAdmin,
	createUsers,
	createPublicidades,
	createCategorias,
	createSimbolos
};
