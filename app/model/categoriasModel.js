class Categorias{

	add(schema,callback){
	   return schema.save(callback);
	};

	edit(schema,id,user,callback){
		return schema.update(id,{ $set:user},callback);
	};

	delete(schema,where,callback){
	  	return schema.deleteMany(where,callback);
	};

	view(schema,callback,id = {}){
		return schema.find(id).sort({_id: -1}).exec(callback);
	};

	search(schema,callback,search = {}){
		return schema.find(search).sort({_id: -1}).exec(callback);
	};
};

module.exports = new Categorias();
