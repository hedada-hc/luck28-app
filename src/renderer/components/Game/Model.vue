<template>
	<div class="model">
		<div class="add_model">
			<ul>
				<li>
					<label>模式名称:</label>
					<input type="text" v-model="modelName" >
				</li>
				<li>
					<label>模式规则:</label>
					<textarea v-model="modelText" placeholder="提示模式规则可手动调整例如：上1期-号码一 可调整为 上3期-号码一 最大调整期数为20期"></textarea><br>
					<span>举个栗子：例如我有一个 去尾数挂机模式 上期开奖号码 3+2+9=14 那么我希望去 3 2 9 4尾 规则这样写 {上1期-号码一}{上1期-号码二}{上1期-号码三}{上1期-号码}{去尾}{10倍}</span>
				</li>
				<li>
					<label>所有规则:</label>
					<div class="guiz">
						<a v-for="item in allReg" @click="selectReg($event,item)"  href="javascript:;">{{item}}</a>
					</div>
				</li>
				<li class="btn">
					<button @click="buildModel">测试模式</button>
					<button @click="saveModel">保存模式</button>
				</li>
			</ul>
		</div>
		<div class="all_model">
			<table>
				<tr>
					<th>模式名称</th>
					<th width="700">模式规则</th>
					<th>操作</th>
				</tr>
				<tr @click="modelEdit(item,index)" v-for="(item,index) in allModel">
					<td>{{item.name}}</td>
					<td :class="selectClass(item) ? 'model_select' : ''">{{item.modelReg}}</td>
					<td>
						<button :class="selectClass(item) ? 'selectBtn' : ''" @click="selectModel(item)">{{selectClass(item) ? '使用中' : '使用'}}</button>
						<button @click="delModel(index)">删除</button>
					</td>
				</tr>
			</table>
		</div>
	</div>
</template>
<!-- ["{去尾}","{压尾}","{输翻1}","{止100000}","{10倍}","{上1期-号码一}","{上1期-号码二}","{上1期-号码三}","{上1期-号码}","{上1期-组合}","{上1期-单双}","{上1期-大小}","{上1期-中边}","{中}","{边}","{大}","{小}","{单}","{双}","{追0-100期}","{切换模式-模式名称}","{输后}","{赢后}","{输加200}","{历史20期}","{20期热号-10位}","{20期冷号-5位}","{开0}","{选号-1|2|3|4|5|6}","{100期停}"] -->
<script type="text/javascript">
	export default {
		data(){
			return{
				message:"模式规则编写",
				allModel:null,
				modelName:'',
				modelText:'',
				gameList:[],
				user:null,
				allReg:["{去尾}","{压尾}","{输翻1}","{止100000}","{10倍}","{上1期-号码一}","{上1期-号码二}","{上1期-号码三}","{上1期-号码}","{上1期-组合}","{上1期-单双}","{上1期-大小}","{上1期-中边}","{中}","{边}","{大}","{小}","{单}","{双}","{追0-100期}","{切换模式-模式名称}","{输后}","{赢后}","{输加200}","{历史20期}","{开0}","{选号-1|2|3|4|5|6}","{100期停}","{追中-20期}","{追边-20期}"],
				modelSelect:{},
				tmpAllModel:null
			}
		},
		created(){
			var model = this.fun.Query('model');
			this.allModel = model != null ? JSON.parse(model) : [{"name":"自用模式","modelReg":"{上1期-号码一}{上1期-号码二}{上1期-号码三}{上1期-号码}{去尾}{输翻1}{10倍}","time":new Date()}]
			this.tmpAllModel = model != null ? JSON.parse(model) : [{"name":"自用模式","modelReg":"{上1期-号码一}{上1期-号码二}{上1期-号码三}{上1期-号码}{去尾}{输翻1}{10倍}","time":new Date()}]
			this.user = this.fun.Query("user") == null ? {} : JSON.parse(this.fun.Query("user"));
			this.modelSelect = this.fun.Query("selectModel") == null ? {} : JSON.parse(this.fun.Query("selectModel"));
		},
		methods:{
			saveModel(){
				if(this.modelName && this.modelText){
					var tmp = {"name":this.modelName,"modelReg":this.modelText,"time":new Date()}
					this.allModel.push(tmp)
					this.tmpAllModel.push(tmp)
					this.fun.Add('model',JSON.stringify(this.tmpAllModel));
				}else{
					alert("请输入规则名称或者规则内容")
				}
			},
			buildModel(){
				this.api.getGame28(this.user.jxy.data.token,1,(error, response)=>{
					this.gameList = response.data.past
					this.bet.buildModel(this.gameList)
				});
			},
			selectReg(e,item){
				if(e.target.className != 'guiza'){
					e.target.className = 'guiza'
					this.modelText += item
				}else{
					e.target.className = ''
					this.modelText = this.modelText.replace(item,"")
				}
			},
			selectModel(item){
				this.modelSelect = item;
				this.fun.Add("selectModel",JSON.stringify(item))
			},
			delModel(index){
				this.allModel.splice(index,1)
				this.tmpAllModel.splice(index,1)
				this.fun.Add('model',JSON.stringify(this.tmpAllModel));
			},
			selectClass(item){
				//识别选中的是那个模式
				if(this.modelSelect.name == undefined || this.modelSelect.name != item.name && this.modelSelect.modelReg != item.modelReg){
					return false;
				}else{
					return true;
				}
			},
			modelEdit(item,index){
				this.modelName = item.name
				this.modelText = item.modelReg
				this.tmpAllModel.splice(index,1)
				console.log(this.tmpAllModel.length,this.allModel.length)
			}
		}
	}
</script>
<style type="text/css" lang="scss">
	.model{
		width: 1000px;
		.add_model{
			width: 880px;
			box-shadow: 0 2px 12px #dcdcdc;
			padding: 10px;
			background: #ffffff;
			margin: 0 auto;
			ul{
				li{
					list-style: none;
					margin-bottom: 15px;
					label{
						margin-left: 10px;
						margin-right: 10px;
						float: left;
    					margin-top: 0px;
    					color: #6f6f6f;
    					font-size: 14px;
					}
					input{
						outline: none;
						border: none;
						box-shadow: 0 2px 10px #ececec;
						width: 180px;
						height: 15px;
						font-size: 14px;
						padding:10px;
					}
					textarea{
						outline: none;
						border: none;
						box-shadow: 0 2px 10px #ececec;
						font-size: 13px;
						padding:10px;
						resize: none;
						max-width: 720px;
					    max-height: 50px;
					    width: 720px;
					    height: 50px;
					}
					button{
						display: block;
						border:none;
						outline: none;
						width: 75px;
						height: 30px;
						line-height: 30px;
						float: right;
						margin-left:10px;
						cursor: pointer;
						color: #ffffff;
						background: #fd711f;
					}
					
					.guiz{
						width: 799px;
    					margin-left: 74px;
						a{
							text-decoration: none;
						    font-size: 13px;
						    color: #ffffff;
						    background: #a2a2a2;
						    margin: 4px;
						    display: inline-block;
						    padding: 1px 6px;
						}
						.guiza{
							background: #27a5ff;
						}
					}
					span{
						font-size: 12px;
						color: #b3b3b3;
						width: 715px;
					    display: inline-block;
					    margin-left: 80px;
					}
				}
				.btn{
					padding:12px 0;
				}
			}
		}
		.all_model{
			width: 880px;
			box-shadow: 0 2px 12px #dcdcdc;
			padding: 10px;
			background: #ffffff;
			margin: 10px auto;
			table{
				margin-top:10px;
				padding: 0px;
				width: 100%;
				border-collapse:collapse;
				tr{
					height: 30px;
					border-bottom: 1px solid #fbfbfb;
					th{

					}
					.model_select{
						color: #fd711f;
					}
					td{
						color: #6b6b6b;
						text-align: center;
						font-size: 13px;
						.selectBtn{
							background: #afafaf;
						}
						button{
							outline: none;
							border:none;
							background: #fd711f;
							color: #ffffff;
							width: 55px;
							height: 20px;
							cursor: pointer;
						}
						button:nth-child(2){
							background:#ff0000;
						}
					}
				}
				tr:nth-child(1){
					height: 36px;
					border-bottom: 1px solid #f5f5f5;
				}
				tr:hover{
					background: #f3f3f3;
				}
			}
		}
	}
</style>