/** 
 * 公共Add方法 
 * @param model 要操作数据库的模型 
 * @param conditions 增加的条件,如{id:xxx} 
 * @param callback 回调方法 
 */ 
exports.addData = function(model,conditions,callback){
	model.insert(conditions, {safe:true}, function(err,result){  
        if(err) {  
            console.log(err);  
            callback({success:0,flag:"save data fail"});  
        } else {  
            console.log('save success');  
            callback({success:1,flag:"save data success"});  
        }  
    });  
}

/** 
 * 公共update方法 
 * @param model 要操作数据库的模型 
 * @param conditions 增加的条件,如{id:xxx} 
 * @param update 更新条件{set{id:xxx}} 
 * @param callback 
 */  
exports.updateData = function(model,conditions,update,callback) {  
    model.update(conditions, {$set:update}, {safe:true}, function(error,result){  
        if(error) {  
            console.log(error);  
            callback({success:0,flag:"update data fail"});  
        } else {  
            if(result.n!=0){  
                console.log('update success!');  
                callback({success:1,flag:"update data success"});  
            }  
            else{  
                console.log('update fail:no this data!');  
                callback({success:0, flag: 'update fail:no this data!'});  
            }  
        }  
    });  
}  

/** 
 * 公共remove方法 
 * @param model 
 * @param conditions 
 * @param callback 
 */  
exports.removeData = function(model,conditions,callback) {  
    model.remove(conditions, {safe:true}, function(error,result) {  
        if (error) {  
            console.log(error);  
            callback({success: 0, flag: "remove data fail"});  
        } else {  
            if(result.result.n!=0){  
                console.log('remove success!');  
                callback({success: 1, flag: "remove data success"});  
            }  
            else{  
                console.log('remove fail:no this data!');  
                callback({success:0, flag: 'remove fail:no this data!'});  
            }  
        }  
    });  
}  

/** 
 * 公共find方法 非关联查找 
 * @param model 
 * @param conditions 
 * @param fields 查找时限定的条件，如顺序，某些字段不查找等 
 * @param options 
 * @param callback 
 */  
exports.findData = function(model,conditions,fields,options,callback) {   
    var skip,limit;
    if(fields.currentPage){
        skip = (fields.currentPage-1)*fields.pageSize;
        limit = Number(fields.pageSize);
    }else{
        skip = 0;
        limit = 1000;
    }
    model.find(conditions, options)
    .sort({"updateTime":-1})    //按照updateTime字段降序排列
    .skip(skip)
    .limit(limit)
    .toArray(function(error, result){  
        if(error) {  
            console.log(error);  
            callback({success: 0, flag: "find data fail"});  
        } else {  
            if(result.length!=0){  
                console.log('find success!');  
                model.find(conditions).toArray(function(err,res){
                    callback({success: 1, flag: "find data success",result:result,total:res.length});  
                });
            }  
            else{  
                console.log('find fail:no this data!');  
                callback({success: 0, flag: 'find fail:no this data!'});  
            }  
        }  
    });  
}  

/** 
 * 公共findOne方法 非关联查找 
 * @param model 
 * @param conditions 
 * @param fields 查找时限定的条件，如顺序，某些字段不查找等 
 * @param options 
 * @param callback 
 */  
exports.findOneData = function(model,conditions,fields,options,callback) {    
    model.findOne(conditions, fields, options, function(error, result){  
        if(error) {  
            console.log(error);  
            callback({success: 0, flag: "find data fail"});  
        } else {  
            if(result != null && result != ''){
                console.log('find success!');  
                callback({success: 1, flag: "find data success",result:result});
            }else{
                console.log('find fail:no this data!');  
                callback({success: 0, flag: 'find fail:no this data!'});
            }
        }  
    });  
}

/** 
 * 公共populate find方法 
 * 是关联查找 
 * @param model 
 * @param conditions 
 * @param path :The field need to be refilled （需要覆盖的字段） 
 * @param fields :select fields (name -_id,Separated by a space field,In front of the field name plus "-"said not filled in) 
 * @param refmodel （关联的字段，有path可为null） 
 * @param options 
 * @param callback 
 */  
exports.findDataPopulation = function(model,conditions,path,fields,refmodel,options,callback) {  
    model.find(conditions)  
    .populate(path,fields, refmodel,options)  
    .exec(function(err, result) {  
        if(err) {  
            console.log(err);  
            callback({success: 0, flag: 'population find data fail'});  
        } else {  
            if(result.length!=0){  
                console.log('population find success!');  
                callback({success: 1, flag: 'population find data success',result:result});  
            }  
            else{  
                console.log('population find fail:no this data!');  
                callback({success: 0, flag: 'population find fail:no this data!'});  
            }  
        }  
    });  
}  