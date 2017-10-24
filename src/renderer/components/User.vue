<template>
	<div class="index">
		<ul class="index_ul">
			<li>
				<p>聚享游账号管理 当前状态：<span>{{user[0].UserMoney.code == '200' ? '已登录' : '未登录'}}</span></p>
				<div v-if="user[0].UserMoney.code == '200'" class="index_info">
					<img :src="user[0].data.jxy.data.image">
					<span>金币:{{user[0].UserMoney.data.userG}}</span>
					<span>豆豆:{{user[0].UserMoney.data.userF}}</span>
					<span>昵称:{{user[0].data.jxy.data.nick_name}}</span>
				</div>
				<div v-else class="index_login">
					<img :src="user[0].data.jxy.data.image">
					<span>账号:</span>
					<input type="text" v-model="user[0].username" name="">
					<span>密码:</span>
					<input type="password" v-model="user[0].password" name="">
					<button @click="login">登录</button>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				user:[
					{
						type:"juxiangyou",
						username:"",
						password:"",
						data:null,
						UserMoney:{
						"code":0,
						"data":{
							"userF":0,
							"userG":0,
							}
						}
					},
					{
						type:"pceggs",
						username:"",
						password:"",
						data:null,
						UserMoney:{
						"code":0,
						"data":{
							"userF":0,
							"userG":0,
							}
						}
					}
				]
			}
		},
		created(){
			this.queryUser();
		},
		methods:{
			login(){
				this.api.login(this.user[0].username,this.user[0].password,(err,res)=>{
					if(!err){
						this.queryUser(true);
					}else{
						alert(err)
					}
				});
			},
			queryUser(type = null){
				var tmp = {"jxy":{"data":{"image":"http://image.juxiangyou.com/avatar/default/10.jpg","nick_name":"test"}}}
				this.user[0].data = this.fun.Query("user") == null ? tmp : JSON.parse(this.fun.Query("user"));
				this.api.getUser(this.user[0].data.jxy.data.token,(error, response)=>{
					this.user[0].UserMoney = response
					if(type) this.$router.push('/')
				});
			}
		}
	}
</script>

<style type="text/css" lang="scss">
	.index{
		width: 860px;
		margin: 0 auto;
		padding: 10px;
		.index_ul{
			li{
				height: 86px;
				background: #ffffff;
				list-style: none;
				border-radius: 8px;
				box-shadow: 0 2px 14px #f1f1f1;
				p{
					text-align: center;
					line-height: 38px;
					color: #525252;
					font-size: 14px;
					span{
						color: #ff3100;
					}
				}
				.index_info{
					margin-top: -17px;
					img{
						display: block;
						width: 50px;
						height: 50px;
						border-radius:50%;
						margin-left: 8px;
						margin-top: 8px;
						float: left;
					}
					span{
						color: #666666;
						display: block;
						float: left;
						margin: 24px 2px 0 14px;
					}
				}
				.index_login{
					margin-top: -17px;
					img{
						display: block;
						width: 50px;
						height: 50px;
						border-radius:50%;
						margin-left: 8px;
						margin-top: 8px;
						float: left;
					}
					span{
						display: block;
						color: #666666;
						float: left;
					    margin: 23px 2px 0px 26px;
					}
					input{
						display: block;
						float: left;
						outline: none;
						border:none;
	    				margin: 18px -14px 0px 4px;
					    background: #ffffff;
					    width: 136px;
					    height: 20px;
					    padding: 4px;
					    box-shadow: 0px 1px 27px #efefef;
	    				font-size: 12px;
					}
					button{
						outline: none;
						border:none;
						width: 86px;
						height: 30px;
						color: #ffffff;
						cursor: pointer;
						float: right;
	    				border-radius: 20px;
	    				margin: 16px;
	    				background:#31c37c;
					}
				}
			}
		}
	}
</style>