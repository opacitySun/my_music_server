var Dayu = require('alidayu-node');
var DayuNew = new Dayu('LTAI8h07u5dIRrq8','OklK2eSrlgmX5SteNebTSiS8NJJyJh');
var Alidayu = require('alidayujs');

var GetRandomNum = function(n){
	var chars = ['0','1','2','3','4','5','6','7','8','9'];
	var res = "";
	for(var i = 0; i < n ; i ++) {
		var id = Math.ceil(Math.random()*9);
		res += chars[id];
	}
	return res;
};

var GetRandomString = function(n){
	var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	var res = "";
	for(var i = 0; i < n ; i ++) {
		var id = Math.ceil(Math.random()*35);
		res += chars[id];
	}
	return res;
};

module.exports = function(app){
    //发送短信验证码
    app.all("/smsCodeAction",function(req,res){
    	var _callback = req.query.callback,
    		mobile = req.query.mobile;
    	var number = GetRandomNum(6);
		// DayuNew.smsSend({
		//     sms_free_sign_name: '孙博为', //短信签名，参考这里 http://www.alidayu.com/admin/service/sign
		//     sms_param: JSON.stringify({"number": number}),//短信变量，对应短信模板里面的变量
		//     rec_num: mobile, //接收短信的手机号
		//     sms_template_code: 'SMS_80110091' //短信模板，参考这里 http://www.alidayu.com/admin/service/tpl
		// },function(error,response){
		// 	var result;
		// 	if(error){
		// 		result = error;
		// 	}else{
		// 		result = response;
		// 	}
		// 	res.type('text/javascript');
  //           res.send(_callback + '(' + JSON.stringify(result) + ')');
		// });

    	var config = {
	        app_key: 'LTAI8h07u5dIRrq8',
	        secret: 'OklK2eSrlgmX5SteNebTSiS8NJJyJh' 
	    };
	    var alidayu = new Alidayu(config);
	    //参数 见：http://open.taobao.com/doc2/apiDetail.htm?apiId=25450 
	    var options = {
	        sms_free_sign_name: '孙博为',
	        sms_param: {
		        number: number
	        },
	        rec_num: mobile, 
	        sms_template_code: 'SMS_80110091',
	    };
	    //发送短信 
	    alidayu.sms(options,function(error,response){
	    	var result;
	        if(error){
				result = error;
			}else{
				result = response;
			}
			res.type('text/javascript');
            res.send(_callback + '(' + JSON.stringify(result) + ')');
	    });
    });

    //生成验证码

}