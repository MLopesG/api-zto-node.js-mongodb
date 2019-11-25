class ConfigAdmin {
	dropDatabase(schema,callback){
	   return schema.remove(callback);
	};
}

module.exports = new ConfigAdmin();