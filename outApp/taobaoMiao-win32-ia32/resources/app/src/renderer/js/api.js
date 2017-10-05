/**
 * 各种api数据接口类
 * 2017年9月30日11:43:35
*/
import md5 from 'js-md5'
import request from "request"
import su from "superagent"
import fun from './fun'
import bet from './model'
export default{
	Sign(v0, v1, token){
		//api sign算法
		var time = new Date().getTime().toString();
		var imei = '786c288c-4d42-3256-963f-355ead90220a';
		var model = 'sm - g530h';
		return {"sign":md5(v0 + v1 + time + imei + model + "f&*(dhgl189!nkj32789" + token),"time":time,"imei":imei};
	},
	login(user,pwd){
		var sign = this.Sign("Login","index","");
		var data = `versionName=2.1.1&device=sm%20-%20g530h&password=${pwd}&sign=${sign.sign}&username=${encodeURIComponent(user)}&versionCode=521&imei=${sign.imei}&version=521&timestamp=${sign.time}&devicetype=2&channel=yingyongbao`
		var url = "http://interface.juxiangzuan.com/mobile.php?c=Login&a=index"
		console.log(data)
		su.post(url)
			.set("Content-Type","application/x-www-form-urlencoded")
			.send(data)
			.end((error, response)=>{
				try{
					this.saveToken(JSON.parse(response.text));
				}catch(e){
					console.log(e,response)
					alert("登录失败");
				}
			})
	},
	saveToken(obj){
		if(obj.code == "200"){
			//查询是否存在 则替换
			var user = fun.Query("user");
			if(user == null){
				user = {}
				user.jxy = obj;
			}else{
				user.jxy = obj;
			}
			fun.Add("user",user);
		}
	},
	getUser(token,cb){
		//获取豆豆
		var sign = this.Sign("Index","getUserMoney",token);
		var data = `versionName=2.1.1&device=sm%20-%20g530h&sign=${sign.sign}&versionCode=521&imei=${sign.imei}&token=${token}&version=521&timestamp=${sign.time}&devicetype=2&channel=yingyongbao”`
		var url = `http://interface.juxiangzuan.com/mobile.php?c=Index&a=getUserMoney`
		su.post(url)
			.send(data)
			.end((error, response)=>{
				if(!error){
					cb(null,JSON.parse(response.text))
				}else{
					cb(error,null)
				}
			})
	},
	getGame28(token,cb){
		//获取疯狂28开奖数据
		var sign = this.Sign("NewSpeed28","lists",token);
		var data = `versionName=2.1.1&device=sm%20-%20g530h&sign=${sign.sign}&versionCode=521&imei=${sign.imei}&token=${token}&version=521&timestamp=${sign.time}&devicetype=2&channel=yingyongbao`
		var url = `http://interface.juxiangzuan.com/mobile.php?c=NewSpeed28&a=lists`
		su.post(url)
			.send(data)
			.end((error, response)=>{
				if(!error){
					cb(null,JSON.parse(response.text))
				}else{
					cb(error,null)
				}
			})
	},
	game28Bet(token,qihao,num,cb){
		//投注疯狂28
		var insertBet = bet.betData(fun.isModel(num));
		var sign = this.Sign("NewSpeed28","betSave",token);
		var data = `device=sm%20-%20g530h&versionCode=521&token=${token}&timestamp=${sign.time}&devicetype=2&imei=${sign.imei}&version=521&channel=yingyongbao&versionName=2.1.1&periodNO=${qihao}&sign=${sign.sign}&${insertBet.bet}`
		var url = `http://interface.juxiangzuan.com/mobile.php?c=NewSpeed28&a=betSave`
		su.post(url)
			.send(data)
			.end((error, response)=>{
				if(!error){
					var res = JSON.parse(response.text)
					res.betNum = insertBet.betNum
					cb(null,res)
				}else{
					cb(error,null)
				}
			})
	},Relief(){
		//领取救济
		var sign = this.Sign("Speed28","relief",token);
		var data = `timestamp=${sign.time}&sign=${sign.sign}&token=${token}&imei=${sign.imei}&device=sm%20-%20g530h&versionCode=521&devicetype=2&versionName=2.1.1&channel=yingyongbao&version=521`
		var url = `http://interface.juxiangzuan.com/mobile.php?c=Speed28&a=relief`
		su.post(url)
			.send(data)
			.end((error, response)=>{
				if(!error){
					cb(null,JSON.parse(response.text))
				}else{
					cb(error,null)
				}
			})
	}
}