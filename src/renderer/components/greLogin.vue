<template>
  <div id="wrapper">
  		<input type="text" name="" v-model="username">
  		<input type="password" name="" v-model="password">
  		<input type="text" name="" v-model="code">
  		<button @click="login">登录</button>
  </div>
</template>

<script>
  export default {
  	data(){
  		return {
  			username:"71378626",
  			password:"Zzy1994",
  			code:"",
  		}
  	},
    methods: {
    	login(){
    		this.gre.getCode();
    	}
    }
  }
</script>
  