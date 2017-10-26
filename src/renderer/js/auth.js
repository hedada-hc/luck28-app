/**
 * 软件登录授权
*/
import superagent from 'superagent'

export default{
	domain:'www.ni1.cc',
	cookie:'',
	tmpCookie:{},
	Login(username,password,formhash,idhash,code,cookie,cb){
		var url = `http://${this.domain}/member.php?mod=logging&action=login&loginsubmit=yes&handlekey=login&loginhash=LKcAI&inajax=1`
		var data = `formhash=${formhash}&referer=http%3A%2F%2Fwww.dz.com%2Fforum.php&loginfield=username&username=${username}&password=${password}&questionid=0&answer=&seccodehash=${idhash}&seccodemodid=member%3A%3Alogging&seccodeverify=${code}`
		superagent.post(url)
			.set("Cookie",cookie)
			.set("Referer",`http://${this.domain}/forum.php`)
			.send(data)
			.end((error, response)=>{
				if(/欢迎您回来/.test(response.text)){
					this.cookie = this.handleCookie(response.headers['set-cookie']);
					var json = "{"+/现在将转入登录前页面',\s\{(.*)\}\);/.exec(response.text)[1]+",'cookie':'"+this.cookie+"'}";
					json = json.replace(/'/g,'"')
					cb(null,json)
				}else{
					cb(response.text,null)
				}
			})
	},
	getToken(idhash,formhash,cb){
		var url = `http://${this.domain}/misc.php?mod=seccode&action=update&idhash=${idhash}&modid=member::logging`
		superagent.get(url)
			.set("Cookie",this.cookie)
			.end((error, response)=>{
				var codeUrl = "http://"+this.domain +"/"+ /height="30"\ssrc="(.*?)"\sclass="vm"/.exec(response.text)[1]
				this.cookie = this.handleCookie(response.headers['set-cookie']);
				this.openImg(codeUrl,idhash,formhash,cb)
			})

	},
	getCode(cb){
		var url = `http://${this.domain}/member.php?mod=logging&action=login&infloat=yes&handlekey=login&inajax=1&ajaxtarget=fwin_content_login`;
		superagent.get(url)
			.end((error, response)=>{
				var formhash = /name="formhash"\svalue="([\w]+)"\s\/>/.exec(response.text)[1]
				var seccodehash = /updateseccode\('([\w]+)',/.exec(response.text)[1]
				this.cookie = this.handleCookie(response.headers['set-cookie']);
				this.getToken(seccodehash,formhash,cb)
			})
	},
	openImg(url,idhash,formhash,cb){
		superagent.get(url)
			.set("Cookie",this.cookie)
			.set("Referer",`http://${this.domain}/forum.php`)
			.end((error,response)=>{
				var base = new Buffer(response.body,'binary').toString('base64');
				this.cookie = this.handleCookie(response.headers['set-cookie']);
				cb(null,{url:base,cookie:this.cookie,idhash:idhash,formhash:formhash})
			})
	},
	handleCookie(cookie){
		var tmp = ""
		for(var i=0;i<cookie.length;i++){
			var name = cookie[i].split(";")[0].split("=")
			this.tmpCookie[name[0]] = name[1]
		}

		for(var i in this.tmpCookie){
			tmp += i+"="+this.tmpCookie[i]+";"
		}
		return tmp;
	},
	secverify(idhash,secverify,cb){
		var url = `http://${this.domain}/misc.php?mod=seccode&action=check&inajax=1&modid=member::logging&idhash=${idhash}&secverify=${secverify}`
		superagent.get(url)
			.set("Cookie",this.cookie)
			.set("Referer",`http://${this.domain}/forum.php`)
			.end((error, response)=>{
				console.log(response.text)
				if(/succ/.test(response.text)){
					this.cookie = this.handleCookie(response.headers['set-cookie']);
					cb(null,this.cookie)
				}else{
					cb("验证码输入错误",null)
				}
			})
	},
	isLogin(cookie,cb){
		//检测是否在线
		var url = `http://${this.domain}/home.php?mod=spacecp`

		superagent.get(url)
			.set("Cookie",cookie)
			.end((error, response)=>{
				if(!error){
					if(/您需要先登录才能继续本操作/.test(response.text)){
						cb("您需要先登录才能继续本操作",null)
					}else{
						cb(null,"success")
					}
				}else{
					cb("网站出现问题或网络出现问题无法连接",null)
				}
			})
	},
	getAd(cb){
		var url = `http://${this.domain}/ad/ad.json`;
		superagent.get(url)
			.end((error, response)=>{
				var ad = JSON.parse(response.text)
				var tmp = null
				for(var i=0;i<ad.length;i++){
					if(ad[i].ad){
						tmp = ad[i]
					}
				}
				cb(null,tmp)
			})
	}

}


