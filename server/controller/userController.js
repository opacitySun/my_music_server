var ObjectID = require("mongodb").ObjectID,
    fs = require("fs"),
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
        var where = 'name='+req.body.loginName+' and password='+req.body.loginPwd;
        var fields = {};
        dbHelper.findData('user',column,where,fields,function(result){  
            if(result.success == 1 && result.result.type == 0){
                req.session.username=result.result.name;          
                req.session.password=result.result.password;
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
}

/**  
 * get User  
 * @returns {Function}  
 */  
exports.userFindAction = function(req, res) {   
    
}