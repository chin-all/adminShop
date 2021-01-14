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
      <el-menu-item index="submenu.url" :key="i">
        <router-link to="/menu" active-class="act">菜单管理</router-link>
      </el-menu-item>
    </el-submenu>


    <!-- <el-submenu index="1">
      <template slot="title">
        <div>
          <i class="el-icon-s-tools"></i>
          系统设置
        </div>
      </template>
      <el-menu-item index="/menu">
        <router-link to="/menu" active-class="act">菜单管理</router-link>
      </el-menu-item>
      <el-menu-item index="/role">
        <router-link to="/role" active-class="act">角色管理</router-link>
      </el-menu-item>
      <el-menu-item index="/user">
        <router-link to="/user" active-class="act">管理员管理</router-link>
      </el-menu-item>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title">
        <div>
          <i class="el-icon-s-goods"></i>
          商城设置
        </div>
      </template>
      <el-menu-item index="/category">
        <router-link to="/category" active-class="act">分类管理</router-link>
      </el-menu-item>
      <el-menu-item index="/specs">
        <router-link to="/specs" active-class="act">规格管理</router-link>
      </el-menu-item>
      <el-menu-item index="/goods">
        <router-link to="/goods" active-class="act">规格管理</router-link>
      </el-menu-item>
    </el-submenu> -->
  </el-menu>
</template>
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