/**
 * 模式生成模块
 * 2017年9月30日17:54:06
*/
import fun from './fun'
const defaultOdds28 = [1,3,6,10,15,21,28,36,45,55,63,69,73,75,75,73,69,63,55,45,36,28,21,15,10,6,3,1]
export default{
	betData(bet, x = 1){
		//生成投注数据
		var betting = ""
		var betNum = 0
		for(var i=0;i<bet.length;i++){
			betNum += bet[i] * x
			if(i == 27){
				betting += `N${i}=${bet[i] * x}`
			}else{
				betting += `N${i}=${bet[i] * x}&`
			}
		}
		return {"bet":betting,"betNum":betNum};
	},
	groupModel(type, is = false){
		var model = null;
		switch(type){
			case "大单":
				model = is ? [0,3,0,10,0,21,0,36,0,55,0,69,0,75,75,73,69,63,55,45,36,28,21,15,10,6,3,1] : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,73,0,63,0,45,0,28,0,15,0,6,0,1]
				break;
			case "小单":
				model = is ? [1,3,6,10,15,21,28,36,45,55,63,69,73,75,0,73,0,63,0,45,0,28,0,15,0,6,0,1] : [0,3,0,10,0,21,0,36,0,55,0,69,0,75,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
				break;
			case "大双":
				model = is ? [1,0,6,0,15,0,28,0,45,0,63,0,73,0,75,73,69,63,55,45,36,28,21,15,10,6,3,1] : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,75,0,69,0,55,0,36,0,21,0,10,0,3,0]
				break;
			case "小双":
				model = is ? [1,3,6,10,15,21,28,36,45,55,63,69,73,75,75,0,69,0,55,0,36,0,21,0,10,0,3,0] : [1,0,6,0,15,0,28,0,45,0,63,0,73,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
				break;
			default:
				model = [1,3,6,10,15,21,28,36,45,55,63,69,73,75,75,73,69,63,55,45,36,28,21,15,10,6,3,1]
		}

		return model;
	},
	buildModel(gameList,doudou){
		/*
			{大双}{小双}{小单}{大单}{中}{小}{大}{边}{中}{单}{上1期-号码一}{上2期-号码}{组合}{输翻1}{上1期-组合}{上1期-单双}{上1期-大小}{上1期-中边}{10倍}
		*/
		//解析编译用户输入模式
		if(fun.Query('selectModel') == null){
			return alert("mmp请添加且选择模式先！")
		}
		var model = JSON.parse(fun.Query('selectModel'))
		var modelReg = this.drawCode(model.modelReg);
		var bet = [1,3,6,10,15,21,28,36,45,55,63,69,73,75,75,73,69,63,55,45,36,28,21,15,10,6,3,1]
		var pl = 1
		var z = true
		var dou = 0 ;
		var zhui_num = 0;
		var ya_dou = 0;
		//{上2期-号码一}{减}{上1期-号码一}{100倍}
		for(var i=0;i<modelReg.length;i++){
			var tmp = modelReg[i]
			if(typeof tmp == "object"){
				if(tmp.tail){
					//取得期数数据
					switch(tmp.tail[1]){
						case "组合":
							bet = this.groupModel(fun.isModel(gameList[tmp.num - 1].winNO),true);
							break;
						case "单双":
							if(fun.isDS(gameList[tmp.num - 1].winNO) == "双"){
								bet = [1,0,6,0,15,0,28,0,45,0,63,0,73,0,75,0,69,0,55,0,36,0,21,0,10,0,3,0];
							}else{
								bet = [0,3,0,10,0,21,0,36,0,55,0,69,0,75,0,73,0,63,0,45,0,28,0,15,0,6,0,1];
							}
							break;
						case "大小":
							if(fun.isDX(gameList[tmp.num - 1].winNO) == "大"){
								bet = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,75,73,69,63,55,45,36,28,21,15,10,6,3,1];
							}else{
								bet = [1,3,6,10,15,21,28,36,45,55,63,69,73,75,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
							}
							break;
						case "中边":
							if(fun.isZB(gameList[tmp.num - 1].winNO) == "中"){
								bet = [0,0,0,0,0,0,0,0,0,0,63,69,73,75,75,73,69,63,0,0,0,0,0,0,0,0,0,0];
							}else{
								bet = [1,3,6,10,15,21,28,36,45,55,0,0,0,0,0,0,0,0,55,45,36,28,21,15,10,6,3,1];
							}
							break;
						case "号码一":
							bet = this.cleanTail(modelReg,gameList);
							break;
						case "号码二":
							bet = this.cleanTail(modelReg,gameList);
							break;
						case "号码三":
							bet = this.cleanTail(modelReg,gameList);
							break;
						case "号码":
							bet = this.cleanTail(modelReg,gameList);
							break;
						default:
							bet = [1,3,6,10,15,21,28,36,45,55,63,69,73,75,75,73,69,63,55,45,36,28,21,15,10,6,3,1]
							break;
					}
					
					//追号
					switch(tmp.tail[0]){
						default:
							if(/追/.test(tmp.tail[0])){
								if(this.lookNum(tmp)){
									bet = this.lookNum(tmp)
									zhui_num = tmp.num

								}else{
									z = "qi"
								}
							}
					}
				}else{
					//翻赔率
					if(/([\d]+)倍/.test(tmp.old)) pl += tmp.num;

					//输翻
					if(/输翻/.test(tmp.old) && gameList[0].insertF > 0 &&  gameList[0].winLoss <= 0){
						console.log(pl,tmp.num)
						pl += tmp.num
						pl = pl * this.shuCount();
						console.log(pl)
					}

					//输加
					if(/输加/.test(tmp.old) && gameList[0].insertF > 0 &&  gameList[0].winLoss <= 0){
						//fun.Add('shu_count',)
						dou = tmp.num * this.shuCount() - 1;
						ya_dou = tmp.num
						//pl += tmp.num
					}

					//输后
					if(tmp.old == "输后"  && gameList[0].insertF > 0 &&  gameList[0].winLoss <= 0){
						if(typeof modelReg[i+1] == "object"){
							if(/选号-/.test(modelReg[i+1].old)){
								bet = this.xuanhao(modelReg[i+1].old.split("-"))
							}
						}else{
							if(/切换模式-/.test(modelReg[i+1])){
								this.qiehuanModel(modelReg[i+1].split("-")[1],gameList,doudou)
							}
						}
					}
					//赢后
					if(tmp.old == "赢后" &&  gameList[0].winLoss > 0){
						if(typeof modelReg[i+1] == "object"){
							if(/选号-/.test(modelReg[i+1].old)){
								bet = this.xuanhao(modelReg[i+1].old.split("-"))
							}
						}else{
							if(/切换模式-/.test(modelReg[i+1])){
								this.qiehuanModel(modelReg[i+1].split("-")[1],gameList,doudou)
							}
						}
					}

					//历史10期
					if(/历史[\d]+期/.test(tmp.old)){
						var betOldTmp = this.betOld(gameList,tmp.num)
						bet = betOldTmp ? betOldTmp : bet
					} 

					//盈利止
					if(/止/.test(tmp.old)){
						if(parseInt(doudou) > tmp.num) z = false
					}

					//对号
					if(/开/.test(tmp.old)){
						if(tmp.num == gameList[0].winNO){
							if(typeof modelReg[i+1] == "object"){
								if(/选号-/.test(modelReg[i+1].old)){
									var xh = modelReg[i+1].old.split("-")
									bet = this.xuanhao(xh)
								}
							}else{
								if(/切换模式-/.test(modelReg[i+1])){
									this.qiehuanModel(modelReg[i+1].split("-")[1],gameList,doudou)
								}
							}
						}else{
							console.log(gameList[0].winNO)
						}
					}

					//期停
					if(/期停/.test(tmp.old)){
						if(this.countQi() >= tmp.num){
							z = false
						}
					}
				}
			}else{
				switch(tmp){
					case "中":
						bet = [0,0,0,0,0,0,0,0,0,0,63,69,73,75,75,73,69,63,0,0,0,0,0,0,0,0,0,0]
						break;
					case "边":
						bet = [1,3,6,10,15,21,28,36,45,55,0,0,0,0,0,0,0,0,55,45,36,28,21,15,10,6,3,1]
						break;
					case "大":
						bet = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,75,73,69,63,55,45,36,28,21,15,10,6,3,1]
						break;
					case "小":
						bet = [1,3,6,10,15,21,28,36,45,55,63,69,73,75,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
						break;
					case "单":
						bet = [0,3,0,10,0,21,0,36,0,55,0,69,0,75,0,73,0,63,0,45,0,28,0,15,0,6,0,1]
						break;
					case "双":
						bet = [1,0,6,0,15,0,28,0,45,0,63,0,73,0,75,0,69,0,55,0,36,0,21,0,10,0,3,0]
						break;
				}
				
			}
		}
		//赢了
		if(gameList[0].winLoss > 0){
			this.yingCount();
			dou = ya_dou
		}
		if(dou > 0) bet[zhui_num] = bet[zhui_num] + dou;
		if(!z) return z
		if(z == "qi") return z
		return this.betData(bet,pl)
	},
	cleanTail(modelReg,gameList){
		//去尾 {上2期-号码一}{减}{上1期-号码一}{去尾}{100倍}
		var tmpModel = []
		var add = []
		var type = true;
		for(var t=0;t<modelReg.length;t++){
			if(typeof modelReg[t] == "object"){
				if(modelReg[t].tail){
					if(/号码/.test(modelReg[t].tail[1])){
						var num = 0
						if(modelReg[t].tail[1] == "号码一") num = gameList[modelReg[t].num - 1].num1;
						if(modelReg[t].tail[1] == "号码二") num = gameList[modelReg[t].num - 1].num2;
						if(modelReg[t].tail[1] == "号码三") num = gameList[modelReg[t].num - 1].num3;
						if(modelReg[t].tail[1] == "号码") num = gameList[modelReg[t].num - 1].winNO.substr(1,1);
						tmpModel.push(num)
					}
				}
			}else{
				if(modelReg[t] == "减") add.push(modelReg[t])
				if(modelReg[t] == "去尾") type = true
				if(modelReg[t] == "压尾") type = false
			}
		}
		if(add.length == 0){
			return this.arrCTail(tmpModel,type);
		}else{
			var tail = tmpModel[0]
			for(var i=0;i<add.length;i++){
				switch(add[i]){
					case "加":
						tail = tail + parseInt(tmpModel[i+1])
						break;
					case "减":
						tail = parseInt(tail - parseInt(tmpModel[i+1]))
					case "乘":
						tail = tail * parseInt(tmpModel[i+1])
					default:
						tail = parseInt(tail / parseInt(tmpModel[i+1]))
				}
			}
			tail = tail.toString()
			tail = parseInt(tail.substr(tail.length-1,1))
			var tmparr = []
			tmparr.push(tail)
			return this.arrCTail(tmparr,type)
		}
		// console.log(tmpModel,add)
	},
	buildCode(){
		//[{"name":"测试模式","modelReg":"{上1期-号码一}{上1期-号码二}{上1期-号码三}{压尾}{100倍}","time":"2017-10-12T09:51:51.709Z"}]
	},
	arrCTail(arr,type){
		arr = fun.createTail(arr);
		var defaults = [1,3,6,10,15,21,28,36,45,55,63,69,73,75,75,73,69,63,55,45,36,28,21,15,10,6,3,1];
		var undefaults = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		if(type){
			for(var i=0;i<arr.length;i++){
				defaults[arr[i]] = 0;
			}
		}else{
			for(var i=0;i<arr.length;i++){
				undefaults[arr[i]] = defaults[arr[i]];
			}
		}
		if(type) return defaults
		return undefaults
		
	},
	drawCode(strCode){
		var tmp = strCode.match(/\{(.*?)\}/g)
		var arr = [];
		for(var i=0;i<tmp.length;i++){
			if(/[\d]+/.test(tmp[i])){
				var tail = false
				var old = /\{(.*)\}/.exec(tmp[i])[1];
				if(/[-]/.test(tmp[i])) tail = old.split("-")
				arr.push({
					"old":old,
					"num":parseInt(/([\d]+)/.exec(tmp[i])[1]),
					"tail":tail
				})
			}else{
				arr.push(/\{(.*)\}/.exec(tmp[i])[1])
			}
		}
		return arr
	},
	lookNum(obj){
		//追号模块
		var defaults = [1,3,6,10,15,21,28,36,45,55,63,69,73,75,75,73,69,63,55,45,36,28,21,15,10,6,3,1];
		var num = obj.num;
		var lookQ = parseInt(/([\d]+)/.exec(obj.tail[1])[1]) 
		//获得次数
		var count = fun.Query("lookNum") != null ? parseInt(fun.Query("lookNum")) : 0;

		for(var i=0;i<defaults.length;i++){
			if(i == num){
				defaults[num] = defaults[num]
			}else{
				defaults[i] = 0
			}
		}

		if((count/2) < lookQ){
			this.countLook(count+1)
			return defaults;
		}
		this.countLook(0)
		return false
	},
	countLook(num){
		//追号记次
		fun.Add("lookNum",num)
	},
	shuCount(){
		//初始化赢次数
		fun.Add('ying_count',0)
		//统计输的次数
		var num = fun.Query('shu_count')
		var count = num != null ? parseInt(num) : fun.Add('shu_count',0)
		console.log(count)
		console.log(count.toString())
		console.log(/[\d]/.test(count.toString()))
		count = /[\d]/.test(count.toString()) ? count : 0
		fun.Add('shu_count',count + 1)
		return count + 1;
	},
	yingCount(){
		//初始化赢次数
		fun.Add('shu_count',0)
		//统计输的次数
		var num = fun.Query('ying_count')
		var count = num != null ? parseInt(num) : fun.Add('ying_count',0)
		count = /[\d]/.test(count.toString()) ? count : 0
		fun.Add('ying_count',count + 1)
		return count + 1;
	},
	betOld(lotter,num){
		//投注历史自定期数开奖号码 格式 历史10期  7 8 10 11 13 14 15 16 17 23 27 winNO
		var defaults = [1,3,6,10,15,21,28,36,45,55,63,69,73,75,75,73,69,63,55,45,36,28,21,15,10,6,3,1];
		var undefaults = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		if(lotter.length >= num){
			for(var i=0;i<num;i++){
				undefaults[lotter[i].winNO] = defaults[lotter[i].winNO]
			}
			console.log(undefaults)
			return undefaults;
		}else{
			alert('设置的历史期数大于数据历史期数不合格已经转化为全包下注');
			return false;
		}
	},
	duihaoBet(){
		//对号投注
	},
	qiehuanModel(name,gameList,dou){
		//切换模式
		var m = fun.Query("model");
		if(m != null){
			var model = JSON.parse(m);
			for(var i=0;i<model.length;i++){
				if(model[i].name == name){
					fun.Add('selectModel',JSON.stringify(model[i]));
					this.buildModel(gameList,dou)
				}
			}
		}else{
			console.log("没有找到对应的切换模式:"+name)
		}
	},
	findQHModel(arr){
		//找出切换的模式
		var name = ""
		for(var i=0;i<arr.length;i++){
			if(typeof arr[i] != "object"){
				if(/切换模式-/.test(arr[i])){
					name = /切换模式-(.*)/.exec(arr[i])[1]
				}
			}
		}
		return name;
	},
	xuanhao(obj){
		var defaults = [1,3,6,10,15,21,28,36,45,55,63,69,73,75,75,73,69,63,55,45,36,28,21,15,10,6,3,1];
		var undefaults = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		var num = obj[1].split("|");
		for(var i=0;i<num.length;i++){
			undefaults[num[i]] = defaults[num[i]];
		}
		return undefaults;
	},
	countQi(){
		//记录下注期数
		var count = fun.Query("count_qi")
		if(/[\d]+/.test(count)){
			var num = parseInt(count) + 1
			fun.Add('count_qi',num)
			return num
		}else{
			fun.Add('count_qi',1)
			return 1
		}
	}
}


