<template>
  <div id="app">
  	<ul class="app_ul">
  		<li><router-link to="/">首页</router-link> </li>
  		<li><router-link to="/user">账号管理</router-link> </li>
  		<li><router-link to="/user">投注设置</router-link> </li>
      <li><router-link to="/list">开奖数据</router-link> </li>
  		<li><router-link to="/model">模式设置</router-link> </li>
  	</ul>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'luck28-app'
  }
</script>

<style lang="scss">
  #app{
  	.app_ul{
  		width: 100%;
  		height: 60px;
  		background: #ffffff;
      margin-bottom: 15px;
  		li{
  			padding:0 10px;
  			height: 60px;
  			line-height: 60px;
  			text-align: center;
  			list-style: none;
  			float: left;
  		}
  	}
  }
</style>
