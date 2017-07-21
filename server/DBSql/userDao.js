var user = require("../models/user");

/** 
 * 调用公共add方法并且传入操作数据库的模型user 
 * @returns {Function} 
 */  
exports.addUser = function(conditions,dbHelper,callback) {  
    //获取user模型  
    var userModel =user.getModel();  
    dbHelper.addData(userModel,conditions,function(result) {  
        callback(result); 
    });  
};  

/** 
 * 调用公共find方法并且传入操作数据库的模型user 
 * @param conditions 
 * @param dbHelper 
 * @param callback 
 */  
exports.findUser = function(conditions,dbHelper,callback) {  
    var userModel =user.getModel();  
    var fields   = {};  
    var options  = {};  
    dbHelper.findData(userModel,conditions,fields,options,function(result){  
        callback(result);
    });  
}  

/** 
 * 调用公共findOne方法并且传入操作数据库的模型user 
 * @param conditions 
 * @param dbHelper 
 * @param callback 
 */  
exports.findOneUser = function(conditions,dbHelper,callback) {  
    var userModel =user.getModel();  
    var fields   = {};  
    var options  = {};  
    dbHelper.findOneData(userModel,conditions,fields,options,function(result){  
        callback(result);
    });  
} 

/** 
 * 调用公共remove方法并且传入操作数据库的模型user 
 * @param conditions 
 * @param dbHelper 
 * @param callback 
 */  
exports.removeUser = function(conditions,dbHelper,callback) {  
    var userModel =user.getModel();  
    dbHelper.removeData(userModel,conditions,function(result){  
        callback(result); 
    });  
}  

/** 
 * 调用公共update方法并且传入操作数据库的模型user 
 * @param conditions 
 * @param update 
 * @param options 
 * @param dbHelper 
 * @param callback 
 */  
exports.updateUser = function(conditions,update,dbHelper,callback) {  
    var userModel =user.getModel();  
    dbHelper.updateData(userModel,conditions,update,function(result){  
        callback(result);  
    });  
}  