<template>
	<div class="index">
		<div class="content">
			<div v-if="this.user.username" class="info">
				<ul>
					<li>
						<router-link to="/">
							<p>疯狂28第 851547	 期 3 + 9 + 3 = <span>15</span></p>
							<i></i>
							<div class="set">
								<label>当前模式:</label>
								<select>
									<option value ="volvo">追号</option>
									<option value ="saab">去三尾挂机</option>
									<option value="opel">压尾</option>
									<option value="audi">调号</option>
								</select>
								<button>+</button>
							</div>
						</router-link>
						<button class="guaji">开始挂机</button>
					</li>
					<li>
						<router-link to="/">
							<p>极速第 476054 期 6 + 2 + 3 = <span>11</span></p>
							<i></i>
							<div class="set">
								<label>当前模式:</label>
								<select>
									<option value ="volvo">追号</option>
									<option value ="saab">去三尾挂机</option>
									<option value="opel">压尾</option>
									<option value="audi">调号</option>
								</select>
								<button>+</button>
							</div>
						</router-link>
						<button class="guaji">开始挂机</button>
					</li>
					<li>
						<router-link to="/">
							<p>韩国28第 476054 期 5 + 1 + 4 = <span>10</span></p>
							<i></i>
							<div class="set">
								<label>当前模式:</label>
								<select>
									<option value ="volvo">追号</option>
									<option value ="saab">去三尾挂机</option>
									<option value="opel">压尾</option>
									<option value="audi">调号</option>
								</select>
								<button>+</button>
							</div>
						</router-link>
						<button class="guaji">开始挂机</button>
					</li>
					<li>
						<router-link to="/">
							<p>PC28第 850967 期 8 + 9 + 8 = <span>25</span></p>
							<i></i>
							<div class="set">
								<label>当前模式:</label>
								<select>
									<option value ="volvo">追号</option>
									<option value ="saab">去三尾挂机</option>
									<option value="opel">压尾</option>
									<option value="audi">调号</option>
								</select>
								<button>+</button>
							</div>
						</router-link>
						<button class="guaji">开始挂机</button>
					</li>
				</ul>
			</div>
			<div v-else class="login">
				<ul>
					<li class="title">
						<p>你要辅助 - 登录</p>
						<span>你要论坛用户免费使用 <a href="javascript:;" @click="openUrl('http://www.dz.com/member.php?mod=register')" target="_blank">免费注册</a></span>
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
				<button @click="openUrl('http://www.dz.com/member.php?mod=register')">注册</button>
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
				username:"hezone",
				password:"admin123",
				codeUrl:"",
				code:"",
				cookie:"",
				secverify:"",
				user:{},
				isLG:false,
				ad:{}
			}
		},
		created(){
			this.user = this.fun.Query('auth') != null ? JSON.parse(this.fun.Query('auth')) : {}
			this.getCodeURL();
			this.isLogin();
			this.getAd();
		},
		methods:{
			login(){
				this.isAuth.Login(this.username,this.password,this.secverify.formhash,this.secverify.idhash,this.code,this.cookie,(error, response)=>{
					if(!error){
						this.fun.Add('auth',response)
						this.user = JSON.parse(response)
						this.isLG = true
					}else{
						alert('登录失败用户名或者密码错误')
						this.isLG = false
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
					this.codeUrl = res.url
					this.cookie = res.cookie
					this.secverify = res

				})
			},
			isLogin(){
				if(this.user.cookie){
					this.isAuth.isLogin(this.user.cookie,(err,res)=>{
						if(err){
							this.user = {}
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
					this.ad = JSON.parse(res)
				});
				
			},
			openUrl(url){
				shell.openExternal(url)
			}
		}
	}
</script>

<style type="text/css" lang="scss">
	.index{
		width: 860px;
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
							    width: 220px;
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
					background:#e8340c;
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