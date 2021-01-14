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
        return {
            formData: {
            username: "",
            password: ""
        }
        }
    },
    rules: {
        username: [
            {
                required: true, // 必填
                message: "请输入管理员账号", // 验证提示信息
                trigger: "blur"
            }
        ],
        password: [
            {
                required: true, // 必填
                message: "请输入管理员密码", // 验证提示信息
                trigger: "blur"
            },
            {
                min: 6,
                max: 12,
                message: "密码长度为6-12个字符", // 验证提示信息
                trigger: "blur"
            }
        ]
    }
}
</script>