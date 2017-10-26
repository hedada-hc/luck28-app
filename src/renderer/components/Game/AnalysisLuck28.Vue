<template>
	<div class="analysis">
		<div class="re">
			<div class="so">
				<input type="text" v-model="qi" name="" placeholder="请输入期数">
				<button @click="reNum">分析数据</button>
			</div>
			<ul class="count">
				<li>
					<p>单双 <i>{{qi}}</i> 期统计结果</p>
					<span>单 {{danshuang.dan}} | 双 {{danshuang.shuang}}</span>
				</li>
				<li>
					<p>大小 <i>{{qi}}</i> 期统计结果</p>
					<span>大 {{daxiao.da}} | 小 {{daxiao.xiao}}</span>
				</li>
				<li>
					<p>中边 <i>{{qi}}</i> 期统计结果</p>
					<span>中 {{zhongbian.zhong}} | 边 {{zhongbian.bian}}</span>
				</li>
			</ul>
			<ul class="count_info">
				<p>{{qi}} 期数据统计号码出现频率</p>
				<li v-for="item in re">
					<span v-if="item.count == 0" class="weichu_span">{{item.num}}</span>
					<span v-else >{{item.num}}</span>
					<p v-if="item.count <= 0">{{qi}}把未出</p>
					<p v-else>{{item.count}}次</p>
				</li>
			</ul>
		</div>
		<div class="gamelist">
			<h6 v-if="user.UserMoney">当前豆豆:{{user.UserMoney.data.userF}}</h6>
			<h6 v-else>当前豆豆:00000</h6>
			<span>今日参与：{{Record.todayTotalNum}}</span><span>今日盈利：{{Record.todayProfitAndLoss}}</span><span>今日胜率：{{Record.todayWinRate}}</span>
			<p>距离第 {{lotterData[0].periodNO}} 期开奖还剩 {{time}} 秒</p>
			<table>
			<tr class="game_head">
				<th>期号</th>
				<th>开奖时间</th>
				<th>开奖号码</th>
				<th>预测</th>
				<th>亏盈</th>
			</tr>
			<tr class="game_con" v-for="(item,index) in lotterData">
				<td>{{item.periodNO}}</td>
				<td>{{handleTime(item.cDate)}}</td>
				<td>
					<span v-if="item.num1 == null">等待开奖中</span>
					<span v-else>{{item.num1}} + {{item.num2}} + {{item.num3}} =</span>
					<span v-show="item.num1 != null" class="num">{{item.winNO}}</span>
				</td>
				<td>{{yuce(index)}}</td>
				<td>
					<p v-if="item.winLoss > 0">盈利: {{item.winLoss}}</p>
					<button v-else-if="item.num1 == null" @click="bet(item.periodNO)">{{item.winNO == null ? '投注' : item.winNO}}</button>
					<p class="wei" v-else-if="item.winLoss == '-'">已开奖</p>
					<p v-else class="kui">亏: {{item.winLoss}}</p>
				</td>
			</tr>
		</table>
		</div>
	</div>
</template>

<script type="text/javascript">
	import _ from 'lodash';
	export default{
		data(){
			return {
				lotterData:[{periodNO:0,cDate:1508989641,num1:null,num2:null,num3:null,winNO:null,winLoss:"-"}],
				user:null,
				re:[],
				length:[],
				qi:"",
				danshuang:{},
				daxiao:{},
				zhongbian:{},
				Record:{todayProfitAndLoss:0,todayTotalNum:0,todayWinRate:"0"},
				time:0
			}
		},
		created(){
			this.user = this.fun.Query("user") == null ? {} : JSON.parse(this.fun.Query("user"));
			this.game28List(5);
		},
		methods:{
			reNum(){
				this.re = this.ana.getReNum(this.lotterData,this.qi,1)
				this.re = this.ana.fillNum(this.re);
				this.re = _.sortBy(this.re,(item)=>{
					return - item.count
				})
				this.danshuang = this.ana.getReDS(this.lotterData,this.qi)
				this.daxiao = this.ana.getReDX(this.lotterData,this.qi)
				this.zhongbian = this.ana.getReZB(this.lotterData,this.qi)
				
			},
			game28List(page){
				if(page >= 2){
					this.api.getGame28(this.user.jxy.data.token,page,(error, response)=>{
						try{
							this.lotterPage(response.data.past);
						}catch(e){
							console.log(error,response,"获取开奖数据失败")
						}
						this.game28List(page - 1)
					});
				}else if(page == 1){
					this.lotterData = [{periodNO:0,cDate:1508989641,num1:null,num2:null,num3:null,winNO:null,winLoss:"-"}]
					this.lotterData[0].periodNO = parseInt(tmp[0].periodNO) + 1
					this.lotterData[0].cDate = parseInt(tmp[0].cDate) + 90
					var tmp = _.sortBy(this.lotterData, (item)=>{
						return - item.periodNO
					})
				}else{
					
				}
			},
			lotterPage(lotter){
				for(var i=0;i<lotter.length;i++){
					this.lotterData.push(lotter[i])
				}
			},
			handleTime(time){
				return this.fun.formatDateTime(time);
			},
			bet(qihao){
				this.api.getGame28(this.user.jxy.data.token,1,(error, response)=>{
					this.api.game28Bet(this.user,qihao,response.data.past,(error, response)=>{
						console.log(error)
						switch(error){
							case false:
								console.log("已达到设置的盈利上限",new Date())
								this.guaji = false
								break;
							case "qi":
								console.log("追号已达设定期数，已停止",new Date())
								this.guaji = false
								//clearInterval(this.duleTimeC);
								break;
							default:
								if(response.code == 200){
									this.game[0].winNO = response.betNum
									console.log("第 "+qihao+" 期,投注成功 共投注 "+response.betNum+" 豆豆"+ new Date().toString())
								}else{
									console.log("第 "+qihao+" 期,投注失败"+response.msg + new Date().toString())
								}
						}
					});
				});
			},
			yuce(index){
				//预测大小单双
				var obj1 = this.lotterData[index + 1]
				var obj2 = this.lotterData[index + 2]
				if(typeof obj1 == "object" && typeof obj2 == "object"){
					return this.fun.listYuce(obj1.winNO,obj2.winNO);
				}
				return "未知啊"
			}
		}
	}
</script>
<style type="text/css" lang="scss">
	.analysis{
		width: 880px;
		height: 440px;
		margin:0 auto;
		background: #ffffff;
		.re{

			.so{
				width: 531px;
				margin:0 auto;
				padding:20px 0px;
				input{
					outline: none;
					width: 400px;
				    height: 40px;
				    line-height: 40px;
				    font-size: 14px;
				    padding: 0 35px 0 20px;
				    vertical-align: middle;
				    background-color: #FFF;
				    border:1px solid #f50;
				    border-width: 2px;
				    color: #333;
				}
				button{
					border:none;
					padding: 0 10px;
					line-height: 44px;
					font-weight: 400;
    				cursor: pointer;
					color: #fff;
   	 				background-color: #f50;
   	 				margin-left: -4px;
				}
			}
			.count{
				width: 844px;
			    display: block;
			    margin: 0 auto;
				li{
					float: left;
				    list-style: none;
				    width: 240px;
				    background: #ffffff;
				    box-shadow: 0 0 14px #e4e4e4;
				    padding: 10px;
				    border-radius: 6px;
				    margin: 10px;
				    p{
				    	text-align: center;
				    	color: #666666;
				    	font-size: 13px;
				    	margin-bottom: 6px;
				    	i{
				    		display: inline-block;
				    		padding:0 6px;
				    		font-style: normal;
				    		font-family: sans-serif;
				    		background:#ff5500;
				    		color: #ffffff;
				    		border-radius:20px;
				    	}
				    }
				    span{
				    	display: block;
				    	//background:#ff5500;
				    	padding:4px 6px;
				    	color: #ffffff;
				    	border-radius:20px;
				    	font-size: 14px;
				    	margin:0 10px;
				    	text-align: center;
				    	background: linear-gradient(-90deg,#ff5000 14%,#ff9000 93%);
				    }
				}
			}
			.count_info{
				list-style: none;
				float: left;
				width: 100%;
				border-bottom: 1px solid #f3f3f3;
				p{
					text-align: center;
					color: #666666;
					font-size: 14px;
				}
				li{
					float: left;
					padding:4px;
					p{
						background: linear-gradient(to left, #4e99fe, #64a5ff);
						display: inline-block;
					    height: 22px;
					    border-radius: 22px;
					    color: #ffffff;
					    text-align: center;
					    line-height: 22px;
					    padding: 0 8px;
					}
					span{
						background: linear-gradient(to left, #f77050, #fd9241);
					    display: block;
					    width: 22px;
					    height: 22px;
					    border-radius: 22px;
					    color: #ffffff;
					    text-align: center;
					    line-height: 22px;
					    margin: 5px 8px;
					}
					.weichu_span{
						background: linear-gradient(to left, #60be5f, #69cc4d);
						margin: 5px 24px;
					}
					.weichu_p{

					}
				}
			}
		}
		.gamelist{
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
	}
</style>


