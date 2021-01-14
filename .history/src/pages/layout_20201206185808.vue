<template>
    <el-container class="layout_container">
        <!-- 布局容器组件 -->
        <el-aside>
            <side-bar></side-bar>
        </el-aside>
        <el-container>
            <el-header class="header">
                <v-header></v-header>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
import SideBar from "@/components/SideBar"
import vHeader from "@/components/Header"
export default {
    components: {
        SideBar,
        vHeader
    }
}
</script>