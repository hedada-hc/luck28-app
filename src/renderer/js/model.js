/**
 * 模式生成模块
 * 2017年9月30日17:54:06
*/
const defaultOdds28 = [1,3,6,10,15,21,28,36,45,55,63,69,73,75,75,73,69,63,55,45,36,28,21,15,10,6,3,1]
export default{
	betData(bet){
		//生成投注数据
		var betting = ""
		for(var i=0;i<bet.length;i++){
			if(bet[i] == 0){
				if(i == 27){
					betting += `N${i}=${bet[i]}`
				}else{
					betting += `N${i}=${bet[i]}&`
				}
			}else{

			}
		}
		return betting;
	}
}