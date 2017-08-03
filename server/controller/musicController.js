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
        var content = fs.readFileSync(path,"utf-8");
        return content;
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
                    obj.lyric = getFileContent(obj.lyric);
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

    //根据UUID查找用户的音乐列表
    app.all("/getUserMusicList",function(req,res){
        var _callback = req.query.callback,
            uuid = req.query.uuid;
        var column = false,where = 'user_uuid="'+uuid+'"';
        var fields = {};
        dbHelper.findData('user_as_music',column,where,fields,function(UASMResult){
            var id_arr = [];
            UASMResult.result.forEach(function(obj){
                id_arr.push(obj.music_id);
            });
            id_arr = id_arr.join(",");
            where = 'id in ('+id_arr+')';
            dbHelper.findData('music',column,where,fields,function(result){
                res.type('text/javascript');
                res.send(_callback + '(' + JSON.stringify(result) + ')');
            });
        });
    });

    //根据UUID查找是否收藏了该音乐
    app.all("/confirmCollectMusic",function(req,res){
        var _callback = req.query.callback,
            uuid = req.query.uuid,
            music_id = req.query.music_id;
        var column = false,where = 'user_uuid="'+uuid+'" and music_id='+music_id;
        var fields = {};
        dbHelper.findData('user_as_music',column,where,fields,function(UASMResult){
            res.type('text/javascript');
            res.send(_callback + '(' + JSON.stringify(result) + ')');
        });
    });
}