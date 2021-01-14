<template>
  <el-menu
    class="menu_container"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    unique-opened
  >
    <h2>后台管理系统</h2>
    <!-- 带上唯一标识 index -->
    <el-menu-item index="0">
      <router-link to="/index" active-class="act">
        <i class="el-icon-s-home"></i>
        首页
      </router-link>
    </el-menu-item>
    <el-submenu index="1">
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
      <el-menu-item index="/cate">分类管理</el-menu-item>
      <el-menu-item index="/goods">商品管理</el-menu-item>
    </el-submenu>
  </el-menu>
</template>
<style lang="less">
.menu_container {
  height: 100%;
  background-color: #545c64;
  h2 {
    color: #fff;
    text-align: center;
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