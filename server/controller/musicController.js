var fs = require("fs"),
    dbHelper = require("../DBHelper/dbHelper"),
    uploadHelper = require("../DBHelper/uploadHelper");

/**  
 * 提供操作表的公共路由，以供ajax访问  
 * @returns {Function}  
 */ 
module.exports = function(app){
    //查找音乐列表
    app.all("/getMusicList",function(req,res){
        var column = false,where = false;
        var fields = {};
        if(req.query.id){
            where = 'id='+req.query.id;
        }
        dbHelper.findData('music',column,where,fields,function(result){
            result['callback'] = req.query.callback;
            res.json(result);
        });
    });
}