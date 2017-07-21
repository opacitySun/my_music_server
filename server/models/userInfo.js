var mongodb = require('mongodb');
var server  = new mongodb.Server('123.57.50.14', 10001, {auto_reconnect:true});
var db = new mongodb.Db('my_blog', server, {safe:true});

db.open(function(err){
	if(!err){
		console.log('connect db user_info');
	}else{
		console.log(err);
		return false;
	}
});

module.exports = {
	getModel : function(){
		return _getModel();
	},
	closeModel : function(){
		db.close();
	}
};

var _getModel = function(type,err){
	var dbModel = db.collection('user_info');
	return dbModel;
}