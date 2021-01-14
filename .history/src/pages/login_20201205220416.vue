<template>
    <div class="login_bg">
        <div class="login_container">
            <h2>登录</h2>
            <!-- model:表单绑定的数据 -->
            <el-form :model="formData" :rules="rules" ref="form">
                <!-- prop指定 rules名为username的验证规则 -->
                <el-form-item prop="username">

                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import axios from "@/untils/http"

export default {
    data() {

    }
}
</script>