<template>
    <div class="login_bg">
        <div class="login_container">
            <h2>管理员登录</h2>
            <!-- model:表单绑定的数据 -->
            <el-form :model="formData" :rules="rules" ref="form">
                <!-- prop指定 rules名为username的验证规则 -->
                <el-form-item prop="username">
                    <el-input v-model="fromData.username" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="fromData.username" placeholder="请输入密码"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" class="login_btn" @click="loginFn">登录</el-button>
        </div>
    </div>
</template>

<script>
import axios from "@/untils/http"

export default {
    data() {
        formData: {
            username: "",
            password: ""
        }
    }
}
</script>