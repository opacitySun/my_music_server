var redis = require('redis'),
	RDS_PORT = 6379,        //端口号
    RDS_HOST = '127.0.0.1',    //服务器IP
    RDS_PWD = 'xJmcMhmgGoYlcA69',
    RDS_OPTS = {auth_pass:RDS_PWD},   //设置项
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);

// redis 链接错误
var isError = function(){
	client.on("error", function(error) {
	    if(error){
	    	console.log(error);
	    	return true;
	    }else{
	    	return false;
	    }
	});
};

// redis 链接成功
client.on("ready", function(res) {
    console.log('success');
});

module.exports = {
	
};

