<template>
	<div class="index">
		<ul class="index_ul">
			<li>
				<div v-if="user.UserMoney.code == '200'" class="index_info">
					<img :src="user.jxy_data.jxy.data.image">
					<span>金币:{{user.UserMoney.data.userG}}</span>
					<span>豆豆:{{user.UserMoney.data.userF}}</span>
					<span>昵称:{{user.jxy_data.jxy.data.nick_name}}</span>
				</div>
				<div v-else class="index_login">
					<img :src="user.jxy_data.jxy.data.image">
					<span>账号:</span>
					<input type="text" v-model="user.jxy_username" name="">
					<span>密码:</span>
					<input type="password" v-model="user.jxy_password" name="">
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
				user:{
					jxy_username:"1006123126@qq.com",
					jxy_password:"hdd0313",
					jxy_data:{},
					UserMoney:{}
				}
			}
		},
		created(){
			this.user.jxy_data = this.fun.Query("user") == null ? {} : JSON.parse(this.fun.Query("user"));
			this.api.getUser(this.user.jxy_data.jxy.data.token,(error, response)=>{
				this.user.UserMoney = response
				console.log(response,this.user.jxy_data )
			});
		},
		methods:{
			login(){
				this.api.login(this.user.jxy_username,this.user.jxy_password);
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
				height: 66px;
				background: #ffffff;
				list-style: none;
				border-radius: 8px;
				.index_info{
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