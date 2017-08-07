var redis = require('redis'),
	RDS_PORT = 6379,        //端口号
    RDS_HOST = '127.0.0.1',    //服务器IP
    RDS_OPTS = {},            //设置项
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);

// redis 链接错误
client.on("error", function(error) {
    console.log(error);
});

