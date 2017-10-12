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
	},
	Relief(token){
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
	},
	quizRank(token,cb){
		var sign = this.Sign("Quiz","quizRank",token)
		var url = "http://interface.juxiangzuan.com/mobile.php?c=Quiz&a=quizRank";
		var data = `timestamp=${sign.time}&sign=${sign.sign}&token=${token}&imei=${sign.imei}&device=sm%20-%20g530h&versionCode=521&devicetype=2&versionName=2.1.1&channel=yingyongbao&version=521`;
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
	receiveWage(token,cb){
		var sign = this.Sign("Quiz","receiveWage",token)
		var url = "http://interface.juxiangzuan.com/mobile.php?c=Quiz&a=receiveWage";
		var data = `timestamp=${sign.time}&sign=${sign.sign}&token=${token}&imei=${sign.imei}&device=sm%20-%20g530h&versionCode=521&devicetype=2&versionName=2.1.1&channel=yingyongbao&version=521`;
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
	betRecord(token,cb){
		var sign = this.Sign("NewSpeed28","betRecord",token)
		var url = "http://interface.juxiangzuan.com/mobile.php?c=NewSpeed28&a=betRecord";
		var data = `timestamp=${sign.time}&sign=${sign.sign}&token=${token}&imei=${sign.imei}&device=sm%20-%20g530h&versionCode=521&devicetype=2&versionName=2.1.1&channel=yingyongbao&version=521`;
		
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


/*
http://interface.juxiangzuan.com/mobile.php?c=Quiz&a=quizRank  排行榜
timestamp=1507601578771&sign=fcbf9083d78f88d3ad9cc6c597fcf38d&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNjE4Mjc3LCJhcHBpZCI6MiwidCI6MTUwNzYwMTU2NiwiciI6ImU5NTZhYyIsInAiOiJkMWM4MzgifQ.ad6a6cd97b5d4a8679c0641f7fc61158a67353680e62fba0fa631190fc5a39d1&imei=4190a5a5-1795-3663-b3a0-12d16ba42232&device=X9077&versionCode=521&devicetype=2&versionName=2.1.1&channel=yingyongbao&version=521

http://interface.juxiangzuan.com/mobile.php?c=NewSpeed28&a=lists 开奖数据 2页 疯狂28
timestamp=1507601709474&sign=990e6a375bf8154e19e1038f41678048&page=2&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNjE4Mjc3LCJhcHBpZCI6MiwidCI6MTUwNzYwMTU2NiwiciI6ImU5NTZhYyIsInAiOiJkMWM4MzgifQ.ad6a6cd97b5d4a8679c0641f7fc61158a67353680e62fba0fa631190fc5a39d1&imei=4190a5a5-1795-3663-b3a0-12d16ba42232&device=X9077&versionCode=521&devicetype=2&versionName=2.1.1&channel=yingyongbao&version=521

http://interface.juxiangzuan.com/mobile.php?c=Quiz&a=receiveWage 领取竞猜工资
timestamp=1507601761512&sign=7c8ac4e5277c8daa3b55d52407ce26c3&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNjE4Mjc3LCJhcHBpZCI6MiwidCI6MTUwNzYwMTU2NiwiciI6ImU5NTZhYyIsInAiOiJkMWM4MzgifQ.ad6a6cd97b5d4a8679c0641f7fc61158a67353680e62fba0fa631190fc5a39d1&imei=4190a5a5-1795-3663-b3a0-12d16ba42232&device=X9077&versionCode=521&devicetype=2&versionName=2.1.1&channel=yingyongbao&version=521

http://interface.juxiangzuan.com/mobile.php?c=NewSpeed28&a=betRecord 我的投注 按期
timestamp=1507601789917&sign=dc62488b7fa5de3c7c858f9e5f798444&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNjE4Mjc3LCJhcHBpZCI6MiwidCI6MTUwNzYwMTU2NiwiciI6ImU5NTZhYyIsInAiOiJkMWM4MzgifQ.ad6a6cd97b5d4a8679c0641f7fc61158a67353680e62fba0fa631190fc5a39d1&imei=4190a5a5-1795-3663-b3a0-12d16ba42232&device=X9077&versionCode=521&devicetype=2&versionName=2.1.1&channel=yingyongbao&pageIndex=1&version=521

http://interface.juxiangzuan.com/mobile.php?c=Speed28&a=relief 领取救济
timestamp=1507601960234&sign=c30787941d8327847264c6db9848db01&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNjE4Mjc3LCJhcHBpZCI6MiwidCI6MTUwNzYwMTU2NiwiciI6ImU5NTZhYyIsInAiOiJkMWM4MzgifQ.ad6a6cd97b5d4a8679c0641f7fc61158a67353680e62fba0fa631190fc5a39d1&imei=4190a5a5-1795-3663-b3a0-12d16ba42232&device=X9077&versionCode=521&devicetype=2&versionName=2.1.1&channel=yingyongbao&version=521

http://interface.juxiangzuan.com/mobile.php?c=NewSpeed28&a=trend 走势图
timestamp=1507601986719&sign=faab9ab13b1a4e334bbd43294ad0731b&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozNjE4Mjc3LCJhcHBpZCI6MiwidCI6MTUwNzYwMTU2NiwiciI6ImU5NTZhYyIsInAiOiJkMWM4MzgifQ.ad6a6cd97b5d4a8679c0641f7fc61158a67353680e62fba0fa631190fc5a39d1&imei=4190a5a5-1795-3663-b3a0-12d16ba42232&device=X9077&versionCode=521&quantity=500&devicetype=2&versionName=2.1.1&channel=yingyongbao&version=521

*/