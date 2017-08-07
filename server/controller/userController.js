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
        var where = 'name="'+name+'" and pwd="'+pwd+'"';
        var fields = {};
        dbHelper.findData('user',column,where,fields,function(result){  
            res.type('text/javascript');
            res.send(_callback + '(' + JSON.stringify(result) + ')');
        });
    });
    //注册
    app.all("/registerAction",function(req,res){
        var _callback = req.query.callback,
            name = req.query.mobile,
            pwd = req.query.pwd,
            mcode = req.query.mcode;
        if(mcode != req.session.mcode){
            req.session.mcode = 'EFnj!Q&9teH8a8td';
            var result = {success: 0, flag: '验证码不正确,此次验证码已失效，请重新获取验证码进行提交'};
            res.type('text/javascript');
            res.send(_callback + '(' + JSON.stringify(result) + ')');
            return false;
        }
        var column = false;
        var where = 'name='+name;
        var fields = {};
        dbHelper.findData('user',column,where,fields,function(FindResult){
            if(FindResult.success == 1){
                var result = {success: 0, flag: '此用户已存在'};
                res.type('text/javascript');
                res.send(_callback + '(' + JSON.stringify(result) + ')');
            }else{
                column = ['uuid','name','pwd','auth','createtime','updatetime'];
                var values = [];
                var this_time = new Date().getTime();
                values.push('uuid()');
                values.push('"'+name+'"');
                values.push('"'+pwd+'"');
                values.push(1);
                values.push(this_time);
                values.push(this_time);
                dbHelper.addData('user',column,values,function(AddResult){
                    if(AddResult.success == 1){
                        column = false,where = 'name="'+name+'" and pwd="'+pwd+'"';
                        dbHelper.findData('user',column,where,fields,function(FindResult2){
                            if(FindResult2.success == 1){
                                column = ['user_uuid','createtime','updatetime'];
                                values = [];
                                values.push('"'+FindResult2.result[0].uuid+'"');
                                values.push(this_time);
                                values.push(this_time);
                                dbHelper.addData('user_info',column,values,function(AddInfoResult){
                                    console.log(AddInfoResult);
                                    res.type('text/javascript');
                                    res.send(_callback + '(' + JSON.stringify(FindResult2) + ')');
                                });
                            }else{
                                res.type('text/javascript');
                                res.send(_callback + '(' + JSON.stringify(FindResult2) + ')');
                            } 
                        });
                    }else{
                        res.type('text/javascript');
                        res.send(_callback + '(' + JSON.stringify(AddResult) + ')');
                    }
                });
            }
        });
    });
    //修改密码
    app.all("/editPwdAction",function(req,res){
        res.header("Access-Control-Allow-Origin", "*");   //设置跨域访问  
        var uuid = req.body.uuid,
            pwd = req.body.pwd,
            vcode = req.body.vcode;
        if(vcode != req.session.vcode){
            req.session.vcode = 'S#S3EyD6M5g#U&ty';
            var result = {success: 0, flag: '验证码不正确,此次验证码已失效，请重新生成验证码进行提交'};
            res.json(result);
            return false;
        }
        var column = ['pwd','createtime','updatetime'],
            values = [];
        var this_time = new Date().getTime();
        values.push('"'+pwd+'"');
        values.push(this_time);
        values.push(this_time);
        var where = 'uuid="'+uuid+'"';
        dbHelper.updateData('user',column,values,where,function(result){  
            res.json(result);
        });
    });
    //查找用户
    app.all("/getUserAction",function(req,res){
        var _callback = req.query.callback;
        var column = false,where = 'uuid="'+req.query.uuid+'"';
        var fields = {};
        var result = {};
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
        dbHelper.findData('user_info',column,where,fields,function(result){
            res.type('text/javascript');
            res.send(_callback + '(' + JSON.stringify(result) + ')');
        });
    });
    //上传用户头像
    app.all("/uploadHeadImgAction",function(req,res){
        res.header("Access-Control-Allow-Origin", "*");   //设置跨域访问  
        uploadHelper.fileSingle(req,res,"userinfo-img",function(result){
            if(result.success == 1){
                var fileUrl = "/files/";
                var imgUrl = fileUrl + result.result.file.filename;
                result = {success: 1, flag: '上传成功', img:imgUrl};
            }
            res.json(result);
        });   
    });
    //保存用户信息
    app.all("/saveUserInfoActive",function(req,res){
        var _callback = req.query.callback,
            uuid = req.query.uuid,
            name = req.query.name,
            sex = req.query.sex;
        var column = ['name','sex','createtime','updatetime'],
            values = [];
        var this_time = new Date().getTime();
        values.push('"'+name+'"');
        values.push(sex);
        values.push(this_time);
        values.push(this_time);
        if(req.query.img){
            column.push('img');
            values.push('"'+req.query.img+'"');
        }
        where = 'user_uuid="'+uuid+'"';
        dbHelper.updateData('user_info',column,values,where,function(result){
            res.type('text/javascript');
            res.send(_callback + '(' + JSON.stringify(result) + ')');
        });
    });
}