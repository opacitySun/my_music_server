/*
 *此文件用于让express关联不同的控制器
 *sun create in 2016.7.19
 */

var user = require("./userController"),
	music = require("./musicController"),
	tools = require("./toolsController");

module.exports = function(app){
	app.all('*',function (req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
		res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

		if (req.method == 'OPTIONS') {
			res.send(200); /让options请求快速返回/
		}
		else {
			next();
		}
	});

	user(app);
	music(app);
	tools(app);
}