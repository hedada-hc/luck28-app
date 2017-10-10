<template>
	<div class="model">
		<input type="text" v-model="modelName" >
		<textarea v-model="modelText" placeholder="请输入模式规则 例如: 开大压小"></textarea>
		<button @click="saveModel">保存模式</button>
	</div>
</template>
<script type="text/javascript">
	export default {
		data(){
			return{
				message:"模式规则编写",
				allModel:null,
				modelName:'',
				modelText:''
			}
		},
		created(){
			var model = this.fun.Query('model');
			this.allModel = model != null ? JSON.parse(model) : [{"name":"自用模式","modelReg":"开-小双-压中单","time":new Date()}]
			console.log(this.allModel)
		},
		methods:{
			saveModel(){
				this.fun.Add('model',JSON.stringify([{"name":this.modelName,"modelReg":this.modelText,"time":new Date()}]));
			}
		}
	}
</script>
<style type="text/css" lang="scss">
	
</style>