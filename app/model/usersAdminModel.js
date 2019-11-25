class UsersAdmin {
	add(schema, callback) {
		return schema.save(callback);
	};

	edit(schema, id = {}, user, callback) {
		return schema.update({}, { $set: user }, callback);
	};

	delete(schema, where, callback) {
		return schema.deleteOne(where, callback);
	};

	view(schema, callback, id = {}) {
		return schema.find(id).sort({ _id: -1 }).exec(callback);
	};

	login(schema, user = {}, callback) {
		return schema.find(user).exec(callback);
	};

	verifyEMAIL(schema, email = null, callback) {
		return schema.find({ email: email }).exec(callback);
	};
}

module.exports = new UsersAdmin();