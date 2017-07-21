var ObjectID = require("mongodb").ObjectID;
var fs = require("fs");
var dbHelper = require("../DBHelper/dbHelper");
var uploadHelper = require("../DBHelper/uploadHelper");
var bannerDao = require("../DBSql/bannerDao");
var bannerImageDao = require("../DBSql/bannerImageDao");

module.exports = function(app){
    //获取banner列表
    app.all("/getBannerListAction",function(req,res){
        var conditions = {};
        bannerDao.findBanner(conditions,dbHelper,function(result){  
            console.log(JSON.stringify(result));
            res.json(result);
        });    
    });
    //获取banner图片列表
    app.all("/getBannerImageListAction",function(req,res){
        var conditions = {"bannerId":req.body.id};
        bannerImageDao.findBannerImage(conditions,dbHelper,function(result){  
            console.log(JSON.stringify(result));
            res.json(result);
        });    
    });
    //查找一个banner
    app.all("/findOneBannerAction",function(req,res){
        var id = req.body.id;
        var conditions = {"_id":ObjectID(id)};
        var imageConditions = {"bannerId":id};
        bannerDao.findOneBanner(conditions,dbHelper,function(result){  
            bannerImageDao.findBannerImage(imageConditions,dbHelper,function(imageResult){
                if(imageResult.success == 1){
                    var images = [];
                    imageResult.result.forEach(function(obj){
                        images.push(obj.url);
                    });
                    result.result["images"] = images;
                } 
                res.json(result);
            });       
        });    
    });
    //添加banner
    app.all("/addBannerAction",function(req,res,next){
        var thisTime = new Date().getTime();
        var conditions0 = {
            "createTime":thisTime,
            "updateTime":thisTime
        };
        bannerDao.addBanner(conditions0,dbHelper,function(result0){  
            if(result0.success == 1){
                var conditions1 = {"createTime":thisTime};
                bannerDao.findOneBanner(conditions1,dbHelper,function(result1){  
                    uploadHelper.fileArray(req,res,"bannerImg",6,function(result2){
                        var conditions2 = {"_id":result1.result._id};
                        var update = {
                            "name":result2.body.bannerName,
                            "type":result2.body.bannerType,
                            "pageTo":result2.body.pageTo,
                            "isShow":result2.body.isShow
                        };
                        bannerDao.updateBanner(conditions2,update,dbHelper,function(result3){  
                            if(result3.success == 1){
                                var resourcesUrl = "/resources/";
                                result2.files.forEach(function(obj){
                                    var imgUrl = resourcesUrl + obj.filename;
                                    var conditions3 = {
                                        "bannerId":result1.result._id.toString(),
                                        "name":"banner"+thisTime,
                                        "url":imgUrl,
                                        "createTime":thisTime,
                                        "updateTime":thisTime
                                    };
                                    bannerImageDao.addBannerImage(conditions3,dbHelper,function(result4){  
                                        if(result4.success == 1){
                                            next();
                                        }else{
                                            res.json(result4);
                                            return;
                                        }
                                    });    
                                }); 
                                res.json(result0);  
                            }else{
                                res.json(result3);
                            }
                        });        
                    });   
                });       
            }else{
                res.json(result0);
            }
        });
        
    });
    //添加banner图片
    app.all("/addBannerImageAction",function(req,res){
        uploadHelper.fileSingle(req,res,"bannerImg",function(result){
            var thisTime = new Date().getTime();
            var resourcesUrl = "/resources/";
            var imgUrl = resourcesUrl + result.file.filename;
            var conditions = {
                "bannerId":result.body.bannerId,
                "name":result.body.bannerImageName,
                "url":imgUrl,
                "createTime":thisTime,
                "updateTime":thisTime
            };
            bannerImageDao.addBannerImage(conditions,dbHelper,function(result){  
                console.log(JSON.stringify(result));
                res.json(result);
            });    
        });
    });
    //修改banner
    app.all("/updateBannerAction",function(req,res){
        var timestamp=new Date().getTime();
        var conditions = {"_id":ObjectID(req.body.id)};
        var update = {
            "name":req.body.name,
            "type":req.body.type,
            "pageTo":req.body.pageTo,
            "isShow":req.body.isShow,
            "updateTime":timestamp
        };
        bannerDao.updateBanner(conditions,update,dbHelper,function(result){  
            console.log(JSON.stringify(result));
            res.json(result);
        });    
    });
    //删除banner
    app.all("/deleteBannerAction",function(req,res){
        var id = req.body.id;
        var conditions0 = {"bannerId":id};
        bannerImageDao.findBannerImage(conditions0,dbHelper,function(result2){
            result2.result.forEach(function(obj){
                var imgUrl = obj.url;
                fs.unlinkSync('./public'+imgUrl);
            });
            bannerImageDao.removeBannerImage(conditions0,dbHelper,function(result0){  
                if(result0.success == 1){
                    var conditions1 = {"_id":ObjectID(id)};
                    bannerDao.removeBanner(conditions1,dbHelper,function(result1){  
                        res.json(result1);
                    });    
                }else{
                    res.json(result0);
                }
            });      
        });   
    });
    //删除banner图片
    app.all("/deleteBannerImageAction",function(req,res){
        var id = req.body.id;
        var conditions = {"_id":ObjectID(id)};
        bannerImageDao.findOneBannerImage(conditions,dbHelper,function(result1){
            var imgUrl = result1.result.url;
            bannerImageDao.removeBannerImage(conditions,dbHelper,function(result){  
                fs.unlinkSync('./public'+imgUrl);
                res.json(result);
            });  
        });    
    });
}