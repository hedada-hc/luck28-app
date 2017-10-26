import su from 'superagent';
export default{
	url:"https://gre.etest.net.cn/login.do",
	CSRFToken:"",
	cookie:"",
	cookieObj:{},
	getCode(){
		su.get(this.url)
			.set("Referer","https://gre.etest.net.cn/login.do")
			.set("User-Agent","Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36")
			.end((error, response)=>{
				if(/name="CSRFToken"\svalue="([\w-]+)"\s\/>/.test(response.text)){
					this.CSRFToken = /name="CSRFToken"\svalue="([\w-]+)"\s\/>/.exec(response.text)[1]
				}else{
					this.cookie = this.HandleCookie(response.headers['set-cookie']);
					this.getCSRF(this.cookie);
				}
			})
	},
	getCSRF(cookie){
		su.get(this.url)
			.set("Cookie",cookie)
			.set("Referer","https://gre.etest.net.cn/login.do")
			.set("User-Agent","Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36")
			.end((error, response)=>{
				if(/name="CSRFToken"\svalue="([\w-]+)"\s\/>/.test(response.text)){
					this.CSRFToken = /name="CSRFToken"\svalue="([\w-]+)"\s\/>/.exec(response.text)[1]
					console.log(this.CSRFToken)
				}else{
					//this.HandleCookie(response.headers['set-cookie']);
					console.log(response.text)
				}
			})
	},
	HandleCookie(cookieObj){
		//处理cookie
		for(var i=0;i<cookieObj.length;i++){
			var name = cookieObj[i].split(";");
			var value = name[0];
			name = name[0].split("=")[0];
			this.cookieObj[name] = value
		}

		for(var item in this.cookieObj){
			this.cookie += this.cookieObj[item] + ";"
		}
		return this.cookie
	},
	login(){

	}
}