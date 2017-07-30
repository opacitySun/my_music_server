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
        var column = false;
        var where = 'name='+req.body.loginName+' and pwd='+req.body.loginPwd;
        var fields = {};
        dbHelper.findData('user',column,where,fields,function(result){  
            if(result.success == 1 && result.result.auth == 0){
                req.session.username=result.result.name;          
                req.session.password=result.result.pwd;
                req.session.regenerate(function (err) {
                    if(err){
                        console.log("session重新初始化失败.");
                    }else{
                        console.log("session被重新初始化.");
                    } 
                });   
                return res.redirect('/');
            }else{
                console.log(JSON.stringify(result));
                req.session.destroy(function (err) {
                    if(err){
                        console.log("session销毁失败.");
                    }else{
                        console.log("session被销毁.");
                    }
                });
                return res.redirect('/login');
            }
        });    
    });
    //查找用户列表
    app.all("/userListAction",function(req,res){
        var column = false,where = false;
        var fields = {};
        dbHelper.findData('user',column,where,fields,function(userResult){
            result = userResult;
            dbHelper.findData('user_type',column,where,fields,function(userTypeResult){  
                result.result.forEach(function(obj){
                    userTypeResult.result.forEach(function(o){
                        if(obj.type == o.type){
                            obj["typeName"] = o.name;
                        }
                    });
                });
                res.json(result);
            });    
        });     
    });
    //查找用户信息
    app.all("/getUserInfoAction",function(req,res){
        var _callback = req.query.callback;
        var column = false,where = 'user_uuid='+req.query.uuid;
        var fields = {};
        dbHelper.findData('user_info',column,where,fields,function(userInfoResult){
            result.result = userInfoResult.result[0];
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