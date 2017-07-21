var mongodb = require('mongodb');
var server  = new mongodb.Server('123.57.50.14', 27017, {auto_reconnect:true});

var _getDB = function(){
	var db = new mongodb.Db('my_blog', server, {safe:true});
	return db;
}

module.exports = {
	getDB : function(){
		return _getDB();
	}
}