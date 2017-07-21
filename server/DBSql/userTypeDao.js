var userType = require("../models/userType");

/** 
 * 调用公共add方法并且传入操作数据库的模型
 * @returns {Function} 
 */  
exports.addUserType = function(conditions,dbHelper,callback) {  
    //获取user模型  
    var userModel =userType.getModel();  
    dbHelper.addData(userModel,conditions,function(result) {  
        callback(result); 
    });  
};  

/** 
 * 调用公共find方法并且传入操作数据库的模型
 * @param conditions 
 * @param dbHelper 
 * @param callback 
 */  
exports.findUserType = function(conditions,dbHelper,callback) {  
    var userModel =userType.getModel();  
    var fields   = {};  
    var options  = {};  
    dbHelper.findData(userModel,conditions,fields,options,function(result){  
        callback(result);
    });  
}  

/** 
 * 调用公共findOne方法并且传入操作数据库的模型
 * @param conditions 
 * @param dbHelper 
 * @param callback 
 */  
exports.findOneUserType = function(conditions,dbHelper,callback) {  
    var userModel =userType.getModel();  
    var fields   = {};  
    var options  = {};  
    dbHelper.findOneData(userModel,conditions,fields,options,function(result){  
        callback(result);
    });  
} 

/** 
 * 调用公共remove方法并且传入操作数据库的模型
 * @param conditions 
 * @param dbHelper 
 * @param callback 
 */  
exports.removeUserType = function(conditions,dbHelper,callback) {  
    var userModel =userType.getModel();  
    dbHelper.removeData(userModel,conditions,function(result){  
        callback(result); 
    });  
}  

/** 
 * 调用公共update方法并且传入操作数据库的模型
 * @param conditions 
 * @param update 
 * @param options 
 * @param dbHelper 
 * @param callback 
 */  
exports.updateUserType = function(conditions,update,dbHelper,callback) {  
    var userModel =userType.getModel();  
    dbHelper.updateData(userModel,conditions,update,function(result){  
        callback(result);  
    });  
}  