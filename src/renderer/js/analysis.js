/**
 * 数据分析模块
*/
import fun from './fun'

export default{
	getReNum(lotter,qi,num = 0,type = false){
		//获取热号 
		//type == false 那么就返回对象数据用来渲染 反之 用来下注
		var count = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		if(lotter.length >= qi){
			for(var i=0;i<qi;i++){
				count[lotter[i].winNO] += 1
			}
			if(type){
				for(var i=0;i<count.length;i++){
					if(count[i] >= num){
						count[i] = count[i]
					}
				}
			}else{
				var tmp = []
				for(var i=0;i<count.length;i++){
					if(count[i] >= num && count[i] != 0){
						tmp.push({"num":i,"count":count[i]})
					}
				}
				count = null;
				count = tmp;
			}
		}else{
			return false
		}
		return count
	},
	fillNum(obj){
		//填充未出现的号码
		var all = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27];
		var fill = [];
		for(var i=0;i<obj.length;i++){
			all[obj[i].num] = null;
		}
		
		for(var i=0;i<all.length;i++){
			if(all[i] != null) obj.push({"num":all[i],"count":0})
		}
		return obj
	},
	getLengNum(lotter,qi,num){
		//获取冷号

	},
	getReDS(lotter,qi){
		//获取热单双
		var dan = 0
		var shuang = 0
		for(var i = 0;i<qi;i++){
			if(fun.isDS(lotter[i].winNO) == "单"){
				dan += 1 
			}else{
				shuang += 1 
			}
		}
		return {dan:dan,shuang:shuang};
	},
	getReDX(lotter,qi){
		//获取热大小
		var da = 0
		var xiao = 0
		for(var i = 0;i<qi;i++){
			if(fun.isDX(lotter[i].winNO) == "大"){
				da += 1 
			}else{
				xiao += 1 
			}
		}
		return {da:da,xiao:xiao};
	},
	getReZB(lotter,qi){
		//获取热大小
		var zhong = 0
		var bian = 0
		for(var i = 0;i<qi;i++){
			if(fun.isZB(lotter[i].winNO) == "中"){
				zhong += 1 
			}else{
				bian += 1 
			}
		}
		return {zhong:zhong,bian:bian};
	}
}

