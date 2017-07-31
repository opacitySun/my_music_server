var http = require("http"),
	querystring = require('querystring');

module.exports = function(app){
    //发送短信验证码
    app.all("/smsCodeAction",function(req,res){
		var code = "3212";
	    var txt = "您的验证码是："+code+"。请不要把验证码泄露给其他人。如非本人操作，可不用理会！"; 
	    var data = { 
			account: 'myaccount', 
			password: "mypwd", 
			mobile:req.query.mobile, 
			content:txt 
		};
		data = require('querystring').stringify(data); 
		var opt = { 
			method: "POST", 
			host: "sms.106jiekou.com",//可以用域名,ip地址 
			port: 80, 
			path: "/utf8/sms.aspx",
			headers: { 
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			} 
		};
		var request = http.request(opt, function (result) { 
			console.log('STATUS: ' + result.statusCode); 
			console.log('HEADERS: ' + JSON.stringify(result.headers)); 
			result.setEncoding('utf8'); 
			result.on('data', function (chunk) { 
				console.log('BODY: ' + chunk); 
			});
		}); 
		request.on('error', function (e) { 
			console.log('problem with request: ' + e.message); 
		}); 
		request.write(data);//把请求发出去 
		request.end();
    });
}