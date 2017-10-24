<template>
	<div class="index">
		<div class="content">
			<div v-if="isLG" class="info">
				<ul>
					<li>
						<a href="javascript:;">
							<p>疯狂28第 {{lotter.luck28[0].periodNO}}	 期 {{lotter.luck28[0].num1}} + {{lotter.luck28[0].num2}} + {{lotter.luck28[0].num3}} = <span>{{lotter.luck28[0].winNO}}</span> 还剩<span>{{time}}</span>秒</p>
							<i></i>
							<div class="set">
								<label>当前模式:</label>
								<select v-model="selectModel">
									<option v-for="(item,index) in allModel" :value ="item.name">{{item.name}}</option>
								</select>
								<button>+</button>
							</div>
						</a>
						<button class="guaji" @click="startG">{{guaji ? '停止挂机' : '开始挂机'}}</button>
						<router-link to="/analysis/luck28"><button class="fenxi">数据分析</button></router-link>
						<div class="guaji_info">
							<span>账户豆豆：<i>{{luck_user.UserMoney.data.userF}}</i></span>
							<span>上期盈利：<i :class="lotter.luck28[0].winLoss > 0 ? '' : 'shu'">{{lotter.luck28[0].winLoss}}</i></span>
							<span>当前模式: <i>{{nowModelName}}</i></span>
						</div>
						<div class="log">
							<p v-for="item in log">{{item}}</p>
						</div>
					</li>
				</ul>
			</div>
			<div v-else class="login">
				<ul>
					<li class="title">
						<p>你要辅助 - 登录</p>
						<span>你要论坛用户免费使用 <a href="javascript:;" @click="openUrl('http://www.ni1.cc/member.php?mod=register')" target="_blank">免费注册</a></span>
					</li>
					<li>
						<label>账  号:</label>
						<input type="text" name="" v-model="username" placeholder="账号">
					</li>
					<li>
						<label>密  码:</label>
						<input type="password" name="" v-model="password" placeholder="密码">
					</li>
					<li class="code">
						<label>验证码:</label>
						<input type="text" placeholder="验证码" v-model="code" v-on:blur="isVerify" name="">
						<img @click="getCodeURL" :src="'data:image/jpeg;base64,'+codeUrl">
					</li>
				</ul>
				<button @click="login">登录</button>
				<button @click="openUrl('http://www.ni1.cc/member.php?mod=register')">注册</button>
				<div class="ad">
					<span :class="ad.ad ? 'tsad' : 'tsad_hide'">广告</span>
					<img v-if="ad.type == 'img'" :src="ad.img_url" @click="openUrl(ad.url)">
					<a v-else href="javascript:;" @click="openUrl(ad.url)">{{ad.content}}</a>
				</div>
			</div>
		</div>
		<div :class="isLG ? '' : 'mask'"></div>
	</div>
</template>

<script>
	var shell = require('electron').shell
	export default{
		data(){
			return {
				username:"",
				password:"",
				codeUrl:"",
				code:"",
				cookie:"",
				secverify:"",
				user:{},
				isLG:false,
				ad:{},
				lotter:{
					luck28:[{periodNO:0,num1:0,num2:0,num3:0,winNO:0}],
					korea28:[{periodNO:0,num1:0,num2:0,num3:0,winNO:0}]
				},
				luck_user:{UserMoney:{data:{userF:0}}},
				selectModel:"",
				allModel:{},
				guaji:false,
				duleTimeC:null,
				time:0,
				nowModelName:"",
				log:["欢迎使用你要助手，你现在看到的是日志记录区"]
			}
		},
		created(){
			this.guaji = this.fun.Query('guaji') != null ? JSON.parse(this.fun.Query('guaji')) : null
			this.user = this.fun.Query('auth') != null ? JSON.parse(this.fun.Query('auth')) : null
			this.luck_user = this.fun.Query('user') != null ? JSON.parse(this.fun.Query('user')) : {UserMoney:{data:{userF:0}}}
			this.allModel = this.fun.Query('model') != null ? JSON.parse(this.fun.Query('model')) : {}
			this.isLogin();
			this.getCodeURL();
			this.getAd();
			this.queryLotter();
			this.Korea28();
			this.startHook();
			this.getUser();
			this.nowModel();
		},
		methods:{
			login(){
				this.isAuth.Login(this.username,this.password,this.secverify.formhash,this.secverify.idhash,this.code,this.cookie,(error, response)=>{
					if(!error){
						this.fun.Add('auth',response);
						this.user = JSON.parse(response);
						this.isLG = true;
					}else{
						alert('登录失败用户名或者密码错误');
						this.isLG = false;
					}
				})
			},
			isVerify(){
				this.isAuth.secverify(this.secverify.idhash,this.code,(err,cookie)=>{
					if(!err){
						this.cookie = cookie
					}else{
						alert(err)
					}
				});
			},
			getCodeURL(){

				this.isAuth.getCode((error, res)=>{
					console.log("sdsdsd")
					this.codeUrl = res.url
					this.cookie = res.cookie
					this.secverify = res

				})
			},
			isLogin(){
				if(this.user != null){
					this.isAuth.isLogin(this.user.cookie,(err,res)=>{
						if(err){
							this.user = {}
							this.fun.Add('auth',null);
							this.isLG = false
						}else{
							this.isLG = true
						}
					})
				}else{
					this.user = {}
				}
			},
			getAd(){
				//获取广告
				this.isAuth.getAd((err,res)=>{
					//this.ad = {"type":"text","content":"虚位以待 广告投放联系QQ：531159249","url":"http://www.dz.com"}
					if(typeof res == "object") this.ad = res
					else this.ad = JSON.parse(res)
					
				});
			},
			openUrl(url){
				shell.openExternal(url)
			},
			queryLotter(){
				//查询开奖数据
				if(this.luck_user.jxy){
					this.api.getGame28(this.luck_user.jxy.data.token,1,(error, response)=>{
						if(!error){
							if(response.msg == "验证失败！"){
								alert("请重新登录聚享游")
								this.$router.push('/user')
							}else{
								this.lotter.luck28 = response.data.past
								this.time = this.fun.scheduleTime(parseInt(this.lotter.luck28[0].cDate) + 90);
								this.getUser();
							}
						}else{
							console.log(error)
						}
					});
				}else{
					if(this.isLG) this.$router.push('/user')
				}
			},
			Korea28(){
				if(this.luck_user.jxy){
					this.api.Korea28(this.luck_user.jxy.data.token,1,(error, response)=>{
						if(!error){
							this.lotter.korea28 = response.data.past
						}else{
							console.log(error)
						}
					});
				}
			},
			startG(){
				if(this.selectModel == ""){
					this.addLog("请先选择模式")
					return
				}
				if(this.allModel.length > 0){
					for(var i=0;i<this.allModel.length;i++){
						if(this.allModel[i].name == this.selectModel && this.guaji == false){
							this.fun.Add('selectModel',JSON.stringify(this.allModel[i]));
							this.addLog("模式："+this.allModel[i].name+" 已经启用")
						}
					}
				}else{
					alert("请先添加模式");
					this.$router.push('/model')
					return
				}
				this.stopG();
				this.nowModel();
			},
			startHook(){
				this.duleTimeC = setInterval(()=>{
					if(this.time <= 0){
						this.queryLotter();
					}else{
						this.time -= 1
						if(this.time == 69){
							if(this.guaji) this.bet(parseInt(this.lotter.luck28[0].periodNO) + 1)
						} 
					}
				},1000)
			},
			bet(qihao){
				this.api.getGame28(this.luck_user.jxy.data.token,1,(error, response)=>{
					this.api.game28Bet(this.luck_user,qihao,response.data.past,(error, response)=>{
						var time = this.fun.formatDateTime(parseInt(new Date().getTime().toString().substr(0,10)));
						switch(error){
							case false:
								this.addLog("已达到设置的盈利上限 "+ time)
								this.stopG(false)
								break;
							case "qi":
								this.addLog("追号已达设定期数，已停止 "+ time)
								this.stopG(false)
								break;
							default:
								if(response.code == 200){
									//this.lotter.luck28[0].winNO = response.betNum
									this.addLog("第 "+qihao+" 期,投注成功 共投注 "+response.betNum+" 豆豆 "+ time)
								}else{
									this.addLog("第 "+qihao+" 期,投注失败"+response.msg+" "+ time)
								}
						}
					});
				});
			},
			getUser(){
				if(this.luck_user.jxy){
					this.api.getUser(this.luck_user.jxy.data.token,(error, response)=>{
						console.log(response)
						this.luck_user.UserMoney = response
						this.fun.Add('user',JSON.stringify(this.luck_user));
					});
				}
			},
			nowModel(){
				var model = this.fun.Query('selectModel')
				if(model != null){
					this.nowModelName = JSON.parse(model).name
				}
			},
			stopG(type = null){
				//停止挂机
				if(type == null){
					this.guaji = this.guaji ? false : true;
				}else{
					this.guaji = type
				}
				this.fun.Add('guaji',this.guaji)
				if(this.guaji == false) this.addLog("挂机已经停止运行，如果需要挂机请开始!")
			},
			addLog(log){
				this.log.push(log)
				if(this.log.length == 7){
					this.log.splice(0,1);
				}
			}
		}
	}
</script>

<style type="text/css" lang="scss">
	.index{
		width: 880px;
		margin: 0 auto;
		height: 420px;
		background: #ffffff;
		padding: 10px;
		.content{

			.info{
				ul{
					li{
						box-shadow: 0 3px 30px #f3f3f3;
						list-style: none;
						width: 390px;
						height: 50px;
						background: #ffffff;
						float: left;
						padding:10px;
						position: relative;
						font-size: 13px;
						margin:10px 10px;
						a{
							text-decoration: none;
							i{
								display: block;
							    width: 348px;
							    border-bottom: 1px solid #dedede;
							    float: left;
							    margin-top: 5px;
							}
							p{
								float: left;
								color: #4a4a4a;
								font-family: inherit;
								display: block;
								text-align: left;
								width: 100%;
								margin-top: 0px;
								span{
									display: inline-block;
								    width: 20px;
								    height: 20px;
								    background: #158cf5;
								    color: #ffffff;
								    border-radius: 20px;
								    line-height: 20px;
								    text-align: center;
								}
							}
							.set{
								margin-top: 32px;
								label{
									color: #666666;
								}
								select{
									outline: none;
									border:none;
									color: #666666;
									border-bottom:1px solid #666666;
									option{
										outline: none;
									}
								}
								button{
									border: none;
						    		outline: none;
						    		background: #ff651b;
						    		width: 20px;
						    		height: 20px;
						    		color: #ffffff;
						    		margin-top: 0px;
						    		margin-right: 0px;
						    		border-radius:20px;
						    		cursor: pointer;
								}
							}
						}
						.guaji{
							border: none;
						    outline: none;
						    color: #ffffff;
						    background: #ff651b;
						    width: 60px;
						    font-size: 12px;
						    line-height: 25px;
						    float: right;
						    height: 70px;
						    margin-top: -62px;
						    margin-right: -9px;
						    cursor: pointer;
						}
						.guaji_info{
							width: 100%;
							margin-left: -10px;
							background: #ffffff;
							margin-top: 8px;
						    box-shadow: 0 1px 7px #e4e4e4;
						    width: 390px;
						    padding: 6px 10px;
							span{
								color: #333333;
								i{
									font-style: normal;
									color: #ff651b;
								}
								.shu{
									color: #00b158;
								}
							}
						}
						.log{
							background: #545454;
							margin-top: 0px;
							margin-left: -10px;
							// box-shadow: 0 3px 5px #989898;
							overflow: hidden;
						    width: 390px;
						    padding: 10px 10px;
						    height: 90px;
						    p{
						    	color: #c3ff14;
						    }
						}
						.fenxi{
							border: none;
						    outline: none;
						    color: #ffffff;
						    background: #158cf5;
						    width: 60px;
						    font-size: 12px;
						    line-height: 25px;
						    float: right;
						    height: 70px;
						    margin-top: -62px;
						    margin-right: 2px;
						    cursor: pointer;
						}
						.guaji:hover{
						    background: #ff7b3b;
						}
					}
				}
			}
			.login{
				position: absolute;
				z-index: 11;
				top: 100px;
				left: 300px;
				width: 380px;
				background: #ffffff;
				padding:10px;
				ul{
					width: 250px;
					margin:0 auto;
					.title{
						margin-top: 0;
						width: 100%;
						height: 40px;
						padding-bottom:10px;
						border-bottom:1px solid #f3f3f3;
						p{
							line-height: 30px;
							text-align: center;
						}
						span{
							display: block;
							color:#8a8a8a;
							font-size: 12px;
							text-align: center;
							a{
								color: #e8340c;
							}
						}
					}
					.code{
						input{
							width: 84px;
						}
						img{
							float: right;
							margin-right: 6px;
    						margin-top: -4px;
						}
					}
					li{
						margin:15px 0;
						list-style: none;
						label{
							color: #333333;
						}
						input{
							outline: none;
							border:none;
							border-bottom:1px solid #afafaf;
							width: 200px;
							height: 25px;
						}
					}
				}
				button{
					outline: none;
					border:none;
					color: #ffffff;
					background:#ff651b;
					width: 250px;
					height: 30px;
					margin-left: 66px;
					margin-bottom: 6px;
					border-radius: 22px;
					cursor: pointer;
				}
				button:nth-child(3){
					margin-left: 66px;
				}
				.ad{
					margin-top: 10px;
					width: 360px;
					padding:5px;
					height: 50px;
					border: 1px solid #c1c1c1;
					a{
						display: block;
						text-align: center;
						line-height: 50px;
						font-size: 14px;
						text-decoration: none;
						color: #e8340c;
					}
					img{
						width: 100%;
						cursor: pointer;
					}
					.tsad{
						position:absolute;
						bottom:16px;
						background: rgba(0,0,0,0.7);
						color: #ffffff;
						font-size: 12px;
						display: block;
						padding:0 5px;
					}
					.tsad_hide{
						display: none;
					}
				}
			}
		}
		.mask{
			position: absolute;
			left: 0px;
			top: 0px;
			width: 100%;
			height: 100%;
			background:rgba(0,0,0,0.8);
			z-index: 10;
		}
	}
</style>