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
	login(user,pwd,cb){
		var sign = this.Sign("Login","index","");
		var data = `versionName=2.1.1&device=sm%20-%20g530h&password=${pwd}&sign=${sign.sign}&username=${encodeURIComponent(user)}&versionCode=521&imei=${sign.imei}&version=521&timestamp=${sign.time}&devicetype=2&channel=yingyongbao`
		var url = "http://interface.juxiangzuan.com/mobile.php?c=Login&a=index"
		su.post(url)
			.set("Content-Type","application/x-www-form-urlencoded")
			.send(data)
			.end((error, response)=>{
				try{
					var json = JSON.parse(response.text)
					if(json.msg && json.code == 200){
						this.saveToken(JSON.parse(response.text));
						cb(null,JSON.parse(response.text));
					}else{
						cb(json.msg,null)
					}
				}catch(e){
					cb("登录失败",null)
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
				user = null
				user = {}
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
	getGame28(token,page = 1,cb){
		//获取疯狂28开奖数据
		var sign = this.Sign("NewSpeed28","lists",token);
		var data = `versionName=2.1.1&device=sm%20-%20g530h&sign=${sign.sign}&versionCode=521&page=${page}&imei=${sign.imei}&token=${token}&version=521&timestamp=${sign.time}&devicetype=2&channel=yingyongbao`
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
		//投注疯狂28 .jxy.data.token
		var insertBet = bet.buildModel(num,token.UserMoney.data.userF);
		if(insertBet == false){
			cb(insertBet,null)
		}else{
			var sign = this.Sign("NewSpeed28","betSave",token.jxy.data.token);
			var data = `device=sm%20-%20g530h&versionCode=521&token=${token.jxy.data.token}&timestamp=${sign.time}&devicetype=2&imei=${sign.imei}&version=521&channel=yingyongbao&versionName=2.1.1&periodNO=${qihao}&sign=${sign.sign}&${insertBet.bet}`
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
		}
	},
	Relief(token,cb){
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
		//领取竞猜工资
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
	},
	checkin(token,cb){
		//签到
		var sign = this.Sign("Index","checkin",token);
		var url = "http://interface.juxiangzuan.com/mobile.php?c=Index&a=checkin";
		var data = `timestamp=${sign.time}&sign=${sign.sign}&token=${token}&imei=${sign.imei}&device=sm%20-%20g530h&versionCode=521&devicetype=2&versionName=2.1.1&channel=yingyongbao&version=521`
		su.post(url)
			.send(data)
			.end((error, response)=>{
				console.log(response);
			})
	},
	Korea28(token,page = 1, cb){
		var sign = this.Sign("Korea28","lists",token);
		var url = "http://interface.juxiangzuan.com/mobile.php?c=Korea28&a=lists";
		var data = `timestamp=${sign.time}&sign=${sign.sign}&page=${page}&token=${token}&imei=${sign.imei}&device=sm%20-%20g530h&versionCode=521&devicetype=2&versionName=2.1.1&channel=yingyongbao&version=521`
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
	Korea28Multiple(token,periodNO,cb){
		//韩国28赔率
		var sign = this.Sign("Korea28","multiple",token)
		var url = "http://interface.juxiangzuan.com/mobile.php?c=Korea28&a=multiple"
		var data = `periodNO=${periodNO}&timestamp=${sign.time}&sign=${sign.sign}&token=${token}&imei=${sign.imei}&device=sm%20-%20g530h&versionCode=521&devicetype=2&versionName=2.1.1&channel=yingyongbao&version=521`
		su.post(url)
			.send(data)
			.end((error, response)=>{
				console.log(response)
			})
	},
	Korea28BetSave(token,qihao,num,cb){
		//投注韩国28 .jxy.data.token
		var insertBet = bet.buildModel(num,token.UserMoney.data.userF);
		if(insertBet == false){
			cb(insertBet,null)
		}else{
			var sign = this.Sign("Korea28","betSave",token.jxy.data.token);
			var data = `device=sm%20-%20g530h&versionCode=521&token=${token.jxy.data.token}&timestamp=${sign.time}&devicetype=2&imei=${sign.imei}&version=521&channel=yingyongbao&versionName=2.1.1&periodNO=${qihao}&sign=${sign.sign}&${insertBet.bet}`
			var url = "http://interface.juxiangzuan.com/mobile.php?c=Korea28&a=betSave"
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
		}
	},
	Korea16(token,page = 1, cb){
		//快乐16开奖数据
		var sign = this.Sign("Korea16","lists",token);
		var url = "http://interface.juxiangzuan.com/mobile.php?c=Korea16&a=lists";
		var data = `timestamp=${sign.time}&sign=${sign.sign}&page=1&token=${token}&imei=${sign.imei}&device=sm%20-%20g530h&versionCode=521&devicetype=2&versionName=2.1.1&channel=yingyongbao&version=521`
		su.post(url)
			.send(data)
			.end((error, response)=>{
				console.log(response)
			})
	},
	Korea16BetSave(token,qihao,num,cb){
		//投注快乐16 .jxy.data.token
		var insertBet = bet.buildModel(num,token.UserMoney.data.userF);
		if(insertBet == false){
			cb(insertBet,null)
		}else{
			var sign = this.Sign("Korea16","betSave",token.jxy.data.token);
			var data = `device=sm%20-%20g530h&versionCode=521&token=${token.jxy.data.token}&timestamp=${sign.time}&devicetype=2&imei=${sign.imei}&version=521&channel=yingyongbao&versionName=2.1.1&periodNO=${qihao}&sign=${sign.sign}&${insertBet.bet}`
			var url = "http://interface.juxiangzuan.com/mobile.php?c=Korea16&a=betSave"
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
		}
	}
}


/*
http://interface.juxiangzuan.com/mobile.php?c=Index&a=checkin 签到
timestamp=1508728651134&sign=5f09cd1d58c3f072c99e1f7cc40fc959&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4OTQxMjQ1LCJhcHBpZCI6MiwidCI6MTUwODcyODE4OCwiciI6IjU5NGIyYiIsInAiOiJlODA0MGUifQ.8563407a83613835681e6e916fa18915678177643efa365d0e8d535a7c50174c&imei=79794694-9739-305b-9eb1-2e33117ac652&device=Coolpad%20Y70-C&versionCode=521&devicetype=2&versionName=2.1.1&channel=yingyongbao&version=521

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

http://interface.juxiangzuan.com/mobile.php?c=NewSpeed28&a=multiple //疯狂28 赔率
periodNO=858025&timestamp=1508728492738&sign=7f545bcdf9b4a11678103b0a56e5eba1&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4OTQxMjQ1LCJhcHBpZCI6MiwidCI6MTUwODcyODE4OCwiciI6IjU5NGIyYiIsInAiOiJlODA0MGUifQ.8563407a83613835681e6e916fa18915678177643efa365d0e8d535a7c50174c&imei=79794694-9739-305b-9eb1-2e33117ac652&device=Coolpad%20Y70-C&versionCode=521&devicetype=2&versionName=2.1.1&channel=yingyongbao&version=521


http://interface.juxiangzuan.com/mobile.php?c=Korea28&a=lists //韩国28
timestamp=1508728244669&sign=f753a6c229455fc92f882637ec337695&page=1&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4OTQxMjQ1LCJhcHBpZCI6MiwidCI6MTUwODcyODE4OCwiciI6IjU5NGIyYiIsInAiOiJlODA0MGUifQ.8563407a83613835681e6e916fa18915678177643efa365d0e8d535a7c50174c&imei=79794694-9739-305b-9eb1-2e33117ac652&device=Coolpad%20Y70-C&versionCode=521&devicetype=2&versionName=2.1.1&channel=yingyongbao&version=521

http://interface.juxiangzuan.com/mobile.php?c=Korea28&a=multiple //韩国28赔率
periodNO=482530&timestamp=1508728336260&sign=191994c7b8ff7acf7b6022b4b32b3fb3&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4OTQxMjQ1LCJhcHBpZCI6MiwidCI6MTUwODcyODE4OCwiciI6IjU5NGIyYiIsInAiOiJlODA0MGUifQ.8563407a83613835681e6e916fa18915678177643efa365d0e8d535a7c50174c&imei=79794694-9739-305b-9eb1-2e33117ac652&device=Coolpad%20Y70-C&versionCode=521&devicetype=2&versionName=2.1.1&channel=yingyongbao&version=521

http://interface.juxiangzuan.com/mobile.php?c=Korea28&a=betSave //韩国28投注
N10=63&N11=69&N12=73&versionCode=521&version=521&timestamp=1508728390824&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4OTQxMjQ1LCJhcHBpZCI6MiwidCI6MTUwODcyODE4OCwiciI6IjU5NGIyYiIsInAiOiJlODA0MGUifQ.8563407a83613835681e6e916fa18915678177643efa365d0e8d535a7c50174c&N14=75&N13=75&N16=69&N15=73&N18=55&N17=63&N19=45&periodNO=482530&N7=36&N6=28&N9=55&N8=45&N24=10&N25=6&N26=3&N27=1&imei=79794694-9739-305b-9eb1-2e33117ac652&N1=3&N0=1&versionName=2.1.1&N3=10&N2=6&N5=21&N4=15&sign=11f4ba65319e7d55ebb092beb3407a43&N21=28&device=Coolpad%20Y70-C&N20=36&N23=15&devicetype=2&N22=21&channel=yingyongbao


http://interface.juxiangzuan.com/mobile.php?c=Korea16&a=lists //快乐16
timestamp=1508728290953&sign=28971975838a52da464fbaa1428eec2b&page=1&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4OTQxMjQ1LCJhcHBpZCI6MiwidCI6MTUwODcyODE4OCwiciI6IjU5NGIyYiIsInAiOiJlODA0MGUifQ.8563407a83613835681e6e916fa18915678177643efa365d0e8d535a7c50174c&imei=79794694-9739-305b-9eb1-2e33117ac652&device=Coolpad%20Y70-C&versionCode=521&devicetype=2&versionName=2.1.1&channel=yingyongbao&version=521

http://interface.juxiangzuan.com/mobile.php?c=Korea16&a=multiple //快乐16 赔率
periodNO=482531&timestamp=1508728438196&sign=90c43617a47433da31aa0e419c00e298&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4OTQxMjQ1LCJhcHBpZCI6MiwidCI6MTUwODcyODE4OCwiciI6IjU5NGIyYiIsInAiOiJlODA0MGUifQ.8563407a83613835681e6e916fa18915678177643efa365d0e8d535a7c50174c&imei=79794694-9739-305b-9eb1-2e33117ac652&device=Coolpad%20Y70-C&versionCode=521&devicetype=2&versionName=2.1.1&channel=yingyongbao&version=521

http://interface.juxiangzuan.com/mobile.php?c=Korea16&a=betSave //快乐16 投注
N10=27&N11=27&N12=25&versionCode=521&version=521&timestamp=1508728464429&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4OTQxMjQ1LCJhcHBpZCI6MiwidCI6MTUwODcyODE4OCwiciI6IjU5NGIyYiIsInAiOiJlODA0MGUifQ.8563407a83613835681e6e916fa18915678177643efa365d0e8d535a7c50174c&N14=15&N13=21&N16=6&N15=10&N18=1&N17=3&periodNO=482531&N7=15&N6=10&N9=25&N8=21&imei=79794694-9739-305b-9eb1-2e33117ac652&versionName=2.1.1&N3=1&N5=6&N4=3&sign=a5ac7bcce2efb22e69a4e60be407e7d1&device=Coolpad%20Y70-C&devicetype=2&channel=yingyongbao

*/