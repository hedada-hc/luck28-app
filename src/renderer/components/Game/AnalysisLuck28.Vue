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
			<table class="count_info">
				<tr>
					<th>号码</th>
					<th>出现次数</th>
				</tr>
				<tr v-for="item in re">
					<td>{{item.num}}</td>
					<td>{{item.count}}</td>
				</tr>
			</table>
		</div>
	</div>
</template>

<script type="text/javascript">
	export default{
		data(){
			return {
				lotterData:[],
				user:null,
				re:[],
				length:[],
				qi:"",
				danshuang:{},
				daxiao:{},
				zhongbian:{}
			}
		},
		created(){
			this.user = this.fun.Query("user") == null ? {} : JSON.parse(this.fun.Query("user"));
			this.game28List(2);
			// this.danshuang = {"dan":12,"shuang":36}
			// this.daxiao = {"da":24,"xiao":12}
			// this.zhongbian = {"zhong":32,"bian":15}
		},
		methods:{
			reNum(){
				this.re = this.ana.getReNum(this.lotterData,this.qi,1);
				this.danshuang = this.ana.getReDS(this.lotterData,this.qi)
				this.daxiao = this.ana.getReDX(this.lotterData,this.qi)
				this.zhongbian = this.ana.getReZB(this.lotterData,this.qi)
			},
			game28List(page){
				if(page >= 1){
					this.api.getGame28(this.user.jxy.data.token,page,(error, response)=>{
						try{
							this.lotterPage(response.data.past);
						}catch(e){
							console.log(error,response,"获取开奖数据失败")
						}
						console.log(this.lotterData)
						this.game28List(page - 1)
					});
				}
			},
			lotterPage(lotter){
				for(var i=0;i<lotter.length;i++){
					this.lotterData.push(lotter[i])
				}
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
			    height: 150px;
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
			}
		}
	}
</style>