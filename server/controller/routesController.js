/*
 *此文件用于让express关联不同的控制器
 *sun create in 2016.7.19
 */

var user = require("./userController").outerConnectAction;
var index = require("./indexController");

module.exports = function(app){
	user(app);
	index(app);
}