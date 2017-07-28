var fs = require("fs"),
    dbHelper = require("../DBHelper/dbHelper"),
    uploadHelper = require("../DBHelper/uploadHelper");

/**  
 * 提供操作表的公共路由，以供ajax访问  
 * @returns {Function}  
 */ 
module.exports = function(app){
    var getFileContent = function(path){
        path = "./public/files/"+path;
        fs.open(path, 'r', function(err, fd) {
            if (err) {
                throw err;
            }
            console.log('open file success.');
            var buffer = new Buffer(255);
            // 读取文件
            fs.read(fd, buffer, 0, 10, 0, function(err, bytesRead, buffer) {
                if (err) {
                    throw err;
                }
                // 打印出buffer中存入的数据
                console.log(bytesRead, buffer.slice(0, bytesRead).toString());

                // 关闭文件
                fs.close(fd);
            });
        });
    };

    //查找音乐列表
    app.all("/getMusicList",function(req,res){
        var _callback = req.query.callback;
        var column = false,where = false;
        var fields = {};
        if(req.query.id){
            where = 'id='+req.query.id;
        }
        dbHelper.findData('music',column,where,fields,function(result){
            if(req.query.id){
                result.result.forEach(function(obj){
                    getFileContent(obj.lyric);
                });
            }
            if(_callback){
                res.type('text/javascript');
                res.send(_callback + '(' + JSON.stringify(result) + ')');
            }else{
                res.json(result);
            }
        });
    });
}