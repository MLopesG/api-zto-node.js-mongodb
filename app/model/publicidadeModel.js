class Publicidade {
	add(schema,callback){
	   return schema.save(callback);
	};

	edit(schema,id,user,callback){
		return schema.update(id,{ $set:user},callback);
	};

	delete(schema,where,callback){
	  	return schema.deleteOne(where,callback);
	};

	view(schema,callback,id = {}){
		return schema.find(id).sort({_id: -1}).exec(callback);
	};
}

module.exports = new Publicidade();