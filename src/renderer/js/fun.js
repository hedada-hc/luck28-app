/**
 * 各种数据处理类
*/
const defaultOdds28 = [1,3,6,10,15,21,28,36,45,55,63,69,73,75,75,73,69,63,55,45,36,28,21,15,10,6,3,1]
export default{
	Add(name,value){
		var local = window.localStorage;
		if(typeof value == "object"){
			local[name] = JSON.stringify(value)
		}else{
			local[name] = value
		}
	},
	Query(name = null){
		var local = window.localStorage;
		if(name == null) return local
		else return local.getItem(name)
	},
	Del(name){
		var local = window.localStorage;
		return local.removeItem(name)
	},
	Clear(){
		var local = window.localStorage;
		return local.clear();
	},
	betData(){
		//生成投注数据
		var betting = ""
		for(var i=0;i<defaultOdds28.length;i++){
			if(i == 27){
				betting += `N${i}=${defaultOdds28[i]}`
			}else{
				betting += `N${i}=${defaultOdds28[i]}&`
			}
		}
		return betting;
	},
	formatDateTime(inputTime, type = false) {  
		inputTime = parseInt(inputTime+"000")
	    var date = new Date(inputTime);  
	    var y = date.getFullYear();    
	    var m = date.getMonth() + 1;    
	    m = m < 10 ? ('0' + m) : m;    
	    var d = date.getDate();    
	    d = d < 10 ? ('0' + d) : d;    
	    var h = date.getHours();  
	    h = h < 10 ? ('0' + h) : h;  
	    var minute = date.getMinutes();  
	    var second = date.getSeconds();  
	    minute = minute < 10 ? ('0' + minute) : minute;    
	    second = second < 10 ? ('0' + second) : second;
	    if(type == false){
	    	return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
	    }
	    return [y,m,d,h,minute,second];
	},
	scheduleTime(strTime){
		//09-30 17:09:30
		var time = this.formatDateTime(parseInt(strTime),true);
		var now = this.formatDateTime(parseInt(new Date().getTime().toString().substr(0,10)),true)
		var date = new Date(time[0],time[1],time[2],time[3],time[4],time[5]) - new Date(now[0],now[1],now[2],now[3],now[4],now[5]);
		return date / 1000
	},
	isModel(num){
		var is = "";
		if(num >= 14){
			is = "大"
		}else{
			is = "小"
		}
		
		if(num % 2 == 0){
			is += "双"
		}else{
			is += "单"
		}

		return is;
	},
	isDS(num){
		var is = ''
		if(num % 2 == 0){
			is = "双"
		}else{
			is = "单"
		}
		return is;
	},
	isDX(num){
		var is = "";
		if(num >= 14){
			is = "大"
		}else{
			is = "小"
		}
		return is;
	},
	isZB(num){
		var is = ""
		if(num >= 10 && num <=17){
			is = "中"
		}else{
			is = "边"
		}
		return is;
	},
	AddLocal(name,data){
		var tmp = this.Query(name);
		if(tmp != null){
			tmp = JSON.parse(tmp)
			if(Array.isArray(tmp)){
				this.Add(name,JSON.stringify(tmp.push(data)))
			}else{
				this.Add(name,JSON.stringify(data))				
			}
		}
	},
	createTail(arr){
		//尾号生产
		var tmp = []
		for(var i=0;i<arr.length;i++){
			var num = parseInt(arr[i])
			if(arr[i]<= 7){
				tmp.push(num)
				tmp.push(num + 10)
				tmp.push(num + 20)
			}else{
				tmp.push(num)
				tmp.push(num + 10)
			}
		}
		return tmp;
	}
}