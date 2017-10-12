<template>
	<div class="game">
		<button @click="betRecord">获取数据</button>
		<h6>当前金币:{{user.UserMoney.data.userF}}</h6>
		<p>距离第 {{this.game[0].periodNO}} 期开奖还剩 {{time}} 秒</p>
		<button @click="startHook">开始挂机</button>
		<table>
			<tr class="game_head">
				<th>期号</th>
				<th>开奖时间</th>
				<th>开奖号码</th>
				<th>预测</th>
				<th>亏盈</th>
			</tr>
			<tr class="game_con" v-for="item in game">
				<td>{{item.periodNO}}</td>
				<td>{{handleTime(item.cDate)}}</td>
				<td>
					<span v-if="item.num1 == null">等待开奖中</span>
					<span v-else>{{item.num1}} + {{item.num2}} + {{item.num3}} =</span>
					<span v-show="item.num1 != null" class="num">{{item.winNO}}</span>
				</td>
				<td>单 小单</td>
				<td>
					<p v-if="item.winLoss > 0">盈利: {{item.winLoss}}</p>
					<button v-else-if="item.num1 == null" @click="bet(item.periodNO)">{{item.winNO == null ? '投注' : item.winNO}}</button>
					<p class="wei" v-else-if="item.winLoss == '-'">已开奖</p>
					<p v-else class="kui">亏: {{item.winLoss}}</p>
				</td>
			</tr>
		</table>
	</div>
</template>

<script type="text/javascript">
	import moment from 'moment'
	export default{
		data(){
			return{
				user:null,
				game:[{"periodNO":0}],
				time:0,
			}
		},
		created(){
			this.user = this.fun.Query("user") == null ? {} : JSON.parse(this.fun.Query("user"));
			this.user.UserMoney = {"data":{"userF":0}}
			this.game28List();
		},
		methods:{
			startHook(){
				setInterval(()=>{
					if(this.time <=0){
						this.game28List();
					}else{
						this.time -= 1
						if(this.time == 69) this.bet(this.game[0].periodNO)
					}
				},1000)
			},
			bet(qihao){
				this.api.game28Bet(this.user.jxy.data.token,qihao,this.game[1].winNO,(error, response)=>{
					console.log(error,response)
					if(response.code == 200){
						this.game[0].winNO = response.betNum
						console.log("第 "+qihao+" 期,投注成功 共投注 "+response.betNum+" 豆豆"+ new Date().toString())
					}else{
						console.log("第 "+qihao+" 期,投注失败"+response.msg + new Date().toString())
					}
					
				});
			},
			handleTime(time){
				return this.fun.formatDateTime(time);
			},
			duleTime(){
				this.time = this.fun.scheduleTime(this.game[0].cDate);
				this.getUser();
			},
			game28List(){
				this.api.getGame28(this.user.jxy.data.token,(error, response)=>{
					response.data.past.unshift(response.data.current[2])
					this.game = response.data.past
					this.duleTime();
				});
			},
			getUser(){
				this.api.getUser(this.user.jxy.data.token,(error, response)=>{
					this.user.UserMoney = response
				});
			},
			betRecord(){
				this.api.betRecord(this.user.jxy.data.token,(error, response)=>{
					console.log(response)
				})
			}
		}
	}
</script>

<style type="text/css" lang="scss">
	.game{
		width: 860px;
		padding: 10px;
		background: #ffffff;
		margin: 10px auto;
		table{
			width: 100%;
			border-collapse:collapse;
			.game_head{
				border-bottom: 1px solid #eaeaea;
				background: #ffffff;
				height: 38px;
				line-height: 38px;
				font-size: 14px;
				th{
					color: #616c80;
				}
			}
			.game_con{
				font-size: 13px;
				text-align: center;
				height:30px;
				border-bottom: 1px solid #eaeaea;
				background: #ffffff;
				td{
					.num{
						display: inline-block;
						width: 24px;
						height: 24px;
						text-align: center;
						line-height: 24px;
						border-radius:30px;
						background:#4184dd;
						color: #ffffff;
					}
					span{
						font-family: sans-serif;
					}
					p{
						color: #ff4c4c;
					}
					.kui{
						color: #468418;
					}
					.wei{
						color: #a7a7a7;
					}
					button{
						outline: none;
					    border: none;
					    width: 54px;
					    height: 20px;
					    color: #ffffff;
					    cursor: pointer;
					    border-radius: 20px;
					    background: #31c37c;
    				}
				}
			}
		}
	}
</style>