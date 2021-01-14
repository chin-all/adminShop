<template>
    <div class="header_bg">
        <el-dropdown @command="logoutFn">
            <span class="el-dropdown-link">
                {{username}}
                <i class="el-icon-setting el-icon-right"></i>
            </span>
            <el-dropdown-menu>
                <el-dropdown-item command="x">注销</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
export default {
  computed: {
    username() {
      return this.$store.getters.username;
    }
  },
  methods: {
    //   注销函数
    logoutFn(command) {
      //   console.log(command);
      // 清除localStorage
      localStorage.clear();
      // 清除 vuex
      this.$store.commit("CLEAR_INFO");
      // 跳转到 登录页
      this.$router.replace("/login");
    }
  }
};
</script>
<style lang="less">
.header_bg {
  line-height: 50px;
  text-align: right;
}
</style>