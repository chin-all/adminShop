<template>
  <el-menu
    class="menu_container"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    unique-opened
  >
    <h1>后台管理系统</h1>
    <!-- 带上唯一标识 index -->
    <el-menu-item index="0">
      <router-link to="/index" active-class="act">
        <i class="el-icon-s-home"></i>
        首页
      </router-link>
    </el-menu-item>
    <!-- 利用后台返回的数据动态渲染导航 -->
    <el-submenu v-for="(menu,index) in menus" :index="(index+1).toString()" :key="index+1">
      <template slot="title">
        <div>
          <i :class="menu.icon"></i>
          {{menu.title}}
        </div>
      </template>
      <el-menu-item v-for="(submenu,i) in menu.children" :index="submenu.url" :key="i">
        <router-link :to="submenu.url" active-class="act">{{submenu.title}}</router-link>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>
<script>
export default {
  computed:{
    menus(){
      // console.log(this.$store.state.info.menus);
      return this.$store.state.info.menus;
    }
  }
}
</script>
<style lang="less">
.menu_container {
  height: 100%;
  background-color: #545c64;
  h1 {
    color: #fff;
    text-align: center;
    margin-top: 20px;
  }
  a {
    color: #fff;
    text-decoration: none;
    text-align: center;
  }
  .act {
    i {
      color: #ffd04b;
    }
    color: #ffd04b;
  }
}
</style>