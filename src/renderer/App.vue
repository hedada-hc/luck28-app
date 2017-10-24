<template>
  <div id="app">
    <nav>
        <a href="javascript:;" class="xiaohua" @click="minimize()">━</a>
        <a href="javascript:;" class="close" @click="close()">X</a>
    </nav>
    <div class="border"  style="-webkit-app-region: drag;">luck28 - 辅助</div>
  	<ul class="app_ul">
  		<li><router-link to="/">首页</router-link> </li>
  		<li><router-link to="/user">账号管理</router-link> </li>
      <!-- <li><router-link to="/list">游戏中心</router-link> </li> -->
  		<li><router-link to="/model">模式设置</router-link> </li>
      <li><button @click="clear">清空缓存</button></li>
  	</ul>
    <router-view></router-view>
  </div>
</template>

<script>
    const ipc = require("electron").ipcRenderer;
    export default {
        name: 'luck28-app',
        methods:{
            close(){
                ipc.send("close");
            },
            minimize(){
                ipc.send("minimize");
            },
            clear(){
              console.log(this.fun.Clear());
            }
        }
    }
</script>
<style lang="scss">
  #app{
    nav{
        a{
            display: block;
            position: fixed;
            text-decoration: none;
            color: #333333;
            z-index:10;
            width: 4%;
            margin:0px;
            text-align: center;
            line-height: 30px;
            font-family: sans-serif;
            outline: none;
        }
        a:nth-child(1){
            right: 4%;
            top: 0px;
            background:#e4e4e4;
        }
        a:nth-child(1):hover{
            background:#bdbdbd;
            color: #ffffff;
        }
        a:nth-child(2){
            right: 0px;
            top: 0px;
            color: #ffffff;
            background:#FF6537;
        }
        a:hover{
            background:#ff4812;
            color: #ffffff;
        }
    }
    .border{
        position: fixed;
        top: 0px;
        z-index: 2;
        width: 92%;
        height: 30px;
        float: left;
        background: #ffffff;
        box-shadow: 0px 0px 8px #e4e4e4;
        text-align: center;
        line-height: 30px;
        color: #696969;
        font-family: sans-serif;
    }
  	.app_ul{
  		width: 100%;
  		height: 60px;
  		background: #ffffff;
        margin-bottom: 15px;
        margin-top: 32px;
  		li{
  			padding:0 10px;
  			height: 60px;
  			line-height: 60px;
  			text-align: center;
  			list-style: none;
  			float: left;
        a{
          display: block;
          width: 100%;
          height: 100%;
          text-decoration: none;
          color: #ff651b;
          font-weight: bolder;
        }
  		}
      li:hover{
        cursor: pointer;
        background:#ff651b;
        a{
          color: #ffffff;
        }
      }
  	}
  }
</style>
