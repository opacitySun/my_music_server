var ObjectID = require("mongodb").ObjectID,
    fs = require("fs"),
    dbHelper = require("../DBHelper/dbHelper"),
    uploadHelper = require("../DBHelper/uploadHelper"),
    userDao = require("../DBSql/userDao"),
    userTypeDao = require("../DBSql/userTypeDao"),
    userInfoDao = require("../DBSql/userInfoDao"),
    fairyDao = require("../DBSql/fairyDao"),
    fairyTypeDao = require("../DBSql/fairyTypeDao");

/**  
 * 提供操作表的公共路由，以供ajax访问  
 * @returns {Function}  
 */ 
exports.outerConnectAction = function(app){
    //查找用户列表
    app.all("/outerUserListAction",function(req,res){
        var conditions ={};   
        userDao.findUser(conditions,dbHelper,function(userResult){  
            result = userResult;
            userTypeDao.findUserType(conditions,dbHelper,function(userTypeResult){  
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
    //获取权限列表
    app.all("/outerUserTypeListFindAction",function(req,res){
        var conditions = {};
        userTypeDao.findUserType(conditions,dbHelper,function(result){  
            res.json(result);
        });    
    });
    //获取精灵列表
    app.all("/outerFairyTypeListFindAction",function(req,res){
        var conditions = {};
        var fields = {};
        fairyTypeDao.findFairyType(conditions,fields,dbHelper,function(result){  
            res.json(result);
        });    
    });
    //查找用户
    app.all("/outerUserFindAction",function(req,res){
        var conditions ={'name':req.body.name,'password':req.body.password};  
        userDao.findOneUser(conditions,dbHelper,function(result){  
            res.json(result); 
        });    
    });
    //根据id查找用户
    app.all("/outerUserFindByIdAction",function(req,res){
        var id = req.body.id;
        var conditions ={"_id":ObjectID(id)};  
        userDao.findOneUser(conditions,dbHelper,function(result){  
            res.json(result); 
        });    
    });
    //查找用户信息
    app.all("/outerUserInfoFindAction",function(req,res){
        var id = req.body.id;
        var conditions ={"userId":id};  
        userInfoDao.findOneUserInfo(conditions,dbHelper,function(result){  
            res.json(result); 
        });    
    });
    //添加用户
    app.all("/outerAddUserAction",function(req,res){
        var thisTime = new Date().getTime();
        var conditions0 ={
            "name":req.body.name,
            "password":req.body.password,
            "type":Number(req.body.type),
            "createTime":thisTime,
            "updateTime":thisTime
        };  
        userDao.addUser(conditions0,dbHelper,function(result0){  
            if(result0.success == 1){
                var conditions1 = {"createTime":thisTime};
                userDao.findOneUser(conditions1,dbHelper,function(result1){
                    if(result1.success == 1){
                        var conditions2 ={
                            "userId":result1.result._id.toString(),
                            "name":req.body.fairyName,
                            "type":Number(req.body.fairyType),
                            "level":1,
                            "exp":0,
                            "createTime":thisTime,
                            "updateTime":thisTime
                        };
                        fairyDao.addFairy(conditions2,dbHelper,function(result2){
                            res.json(result2); 
                        });
                    }else{
                        res.json(result1); 
                    }
                });
            }else{
                res.json(result0); 
            }
        });    
    });
    //修改用户密码
    app.all("/outerUpdateUserPwdAction",function(req,res){
        var thisTime = new Date().getTime();
        var conditions ={"_id":ObjectID(req.body.id)};  
        var update ={
            "password":req.body.password,
            "type":Number(req.body.type),
            "updateTime":thisTime
        };  
        userDao.updateUser(conditions,update,dbHelper,function(result){  
            res.json(result); 
        });    
    });
    //修改用户信息（无图片时）
    app.all("/outerEditUserInfoNoImgAction",function(req,res){
        var thisTime = new Date().getTime();
        var desc = req.body.desc;
        desc = desc.replace(/\r\n/g,"<br>");
        desc = desc.replace(/\n/g,"<br>");
        desc = desc.replace(/ /g,"&nbsp;");
        var conditions ={"userId":req.body.userId};
        var update ={
            "name":req.body.name,
            "desc":desc,
            "updateTime":thisTime
        };  
        userInfoDao.updateUserInfo(conditions,update,dbHelper,function(result){  
            res.json(result); 
        });    
    });
    //编辑用户信息
    app.all("/outerEditUserInfoAction",function(req,res){
        uploadHelper.fileSingle(req,res,"userImg",function(result0){
            var thisTime = new Date().getTime();
            var resourcesUrl = "/resources/";
            var imgUrl = resourcesUrl + result0.file.filename;
            var find = {"userId":result0.body.userId};
            userInfoDao.findOneUserInfo(find,dbHelper,function(result1){  
                var desc = result0.body.userDesc;
                desc = desc.replace(/\r\n/g,"<br>");
                desc = desc.replace(/\n/g,"<br>");
                desc = desc.replace(/ /g,"&nbsp;");
                if(result1.success == 1){
                    var conditions = {"userId":result0.body.userId};
                    var update = {
                        "name":result0.body.userName,
                        "desc":desc,
                        "image":imgUrl,
                        "updateTime":thisTime
                    };
                    userInfoDao.updateUserInfo(conditions,update,dbHelper,function(result3){  
                        var oldImg = result1.result.image;
                        fs.unlinkSync('./public'+oldImg);   //删除老图片
                        res.json(result3);
                    }); 
                }else{
                    var conditions = {
                        "userId":result0.body.userId,
                        "name":result0.body.userName,
                        "desc":desc,
                        "image":imgUrl,
                        "createTime":thisTime,
                        "updateTime":thisTime
                    };
                    userInfoDao.addUserInfo(conditions,dbHelper,function(result2){  
                        res.json(result2);
                    });    
                }
            });  
        });   
    });
    //删除用户
    app.all("/outerDeleteUserAction",function(req,res){
        var id = req.body.id;
        var conditions0 ={"_id":ObjectID(id)};  
        userDao.removeUser(conditions0,dbHelper,function(result0){  
            if(result0.success == 1){
                var conditions1 ={"userId":id};  
                userInfoDao.findOneUserInfo(conditions1,dbHelper,function(result1){
                    if(result1.success == 1){
                        var imgUrl = result1.result.image;
                        userInfoDao.removeUserInfo(conditions1,dbHelper,function(result2){
                            if(result2.success == 1){
                                if(imgUrl != ''){
                                    fs.unlinkSync('./public'+imgUrl);
                                }
                                fairyDao.removeFairy(conditions1,dbHelper,function(result3){
                                    res.json(result3);
                                });
                            }else{
                                res.json(result2);
                            } 
                        });
                    }else{
                        fairyDao.removeFairy(conditions1,dbHelper,function(result3){
                            res.json(result3);
                        });
                    }
                });  
            }else{
                res.json(result0); 
            }
        });    
    });
    //获取session信息
    app.all("/outerGetSessionAction",function(req,res){
        var result = req.session;
        res.json(result); 
    });
    //获取用户信息
    app.all("/outerUserInfoFindAction",function(req,res){
        var conditions = {"userId":req.body.userId};
        userInfoDao.findOneUserInfo(conditions,dbHelper,function(result){  
            console.log(JSON.stringify(result));
            res.json(result);
        });    
    });
    //退出登录
    app.all("/outerLogOut",function(req,res){
        req.session.destroy(function (err) {
            if(err){
                console.log("session销毁失败.");
            }else{
                console.log("session被销毁.");
            } 
        });   
        return res.redirect('/login');
    });
}

/**  
 * add user  
 * @returns {Function}  
 */  
exports.userAddAction = function() {  
    return function(req, res) {  
        var user = {
        	_id   : new global.mongoose.Types.ObjectId(),  
            name  : req.name,
            password : req.password
        };  
        /*
        for(var i=0;i<10;i++){  
            user.push({  
                _id   : new global.mongoose.Types.ObjectId(),  
                name  : req.name,
                password : req.password
            });  
        }  
        */
        userDao.addUser(user,dbHelper,function(result){  
            res.json(result);  
        });  
    }  
}  

/**  
 * get User  
 * @returns {Function}  
 */  
exports.userFindAction = function(req, res) {   
    var conditions ={'name':req.body.loginName,'password':req.body.loginPwd};  
    userDao.findOneUser(conditions,dbHelper,function(result){  
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
        //res.json(result);  
    });    
}  

/**  
 * remove User  
 * @returns {Function}  
 */  
exports.userRemoveAction = function() {  
    return function(req, res) {  
        var conditions ={};  
        userDao.removeUser(conditions,dbHelper,function(result){  
            res.json(result);  
        });  
    }  
}  

/**  
 * update User  
 * @returns {Function}  
 */  
exports.userUpdateAction = function() {  
    return function (req, res) {    
        var conditions = {};  
        var update = {}//{$set : {userName:xxx}};  
        var options = {}//{upsert:false};  
        userDao.updateUser(conditions, update, options, dbHelper, function (result) {  
            res.json(result);  
        });  
    }  
}  