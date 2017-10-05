/**
 * 模式生成模块
 * 2017年9月30日17:54:06
*/
const defaultOdds28 = [1,3,6,10,15,21,28,36,45,55,63,69,73,75,75,73,69,63,55,45,36,28,21,15,10,6,3,1]
export default{
	betData(bet, x = 3){
		//生成投注数据
		bet = this.defaultModel(bet,true)
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
	defaultModel(type, is = false){
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
	}
}