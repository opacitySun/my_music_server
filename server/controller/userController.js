var fs = require("fs"),
    dbHelper = require("../DBHelper/dbHelper"),
    uploadHelper = require("../DBHelper/uploadHelper");

/**  
 * 提供操作表的公共路由，以供ajax访问  
 * @returns {Function}  
 */ 
module.exports = function(app){
    //登录
    app.all("/loginAction",function(req,res){
        var _callback = req.query.callback,
            name = req.query.name,
            pwd = req.query.pwd,
            vcode = req.query.vcode;
        if(vcode != req.session.vcode){
            req.session.vcode = 'S#S3EyD6M5g#U&ty';
            var result = {success: 0, flag: '验证码不正确,此次验证码已失效，请重新生成验证码进行提交'};
            res.type('text/javascript');
            res.send(_callback + '(' + JSON.stringify(result) + ')');
            return false;
        }
        var column = false;
        var where = 'name='+name+' and pwd='+pwd;
        var fields = {};
        dbHelper.findData('user',column,where,fields,function(result){  
            res.type('text/javascript');
            res.send(_callback + '(' + JSON.stringify(result) + ')');
        });
    });
    //查找用户信息
    app.all("/getUserInfoAction",function(req,res){
        var _callback = req.query.callback;
        var column = false,where = 'user_uuid="'+req.query.uuid+'"';
        var fields = {};
        var result = {};
        dbHelper.findData('user_info',column,where,fields,function(userInfoResult){
            result['result'] = userInfoResult.result[0];
            if(!result.result.name){
                where = 'uuid='+req.query.uuid;
                dbHelper.findData('user',column,where,fields,function(userResult){  
                    result.result.name = userResult.result[0].name;
                    if(_callback){
                        res.type('text/javascript');
                        res.send(_callback + '(' + JSON.stringify(result) + ')');
                    }else{
                        res.json(result);
                    }
                });    
            }else{
                if(_callback){
                    res.type('text/javascript');
                    res.send(_callback + '(' + JSON.stringify(result) + ')');
                }else{
                    res.json(result);
                }
            }  
        });
    });
}