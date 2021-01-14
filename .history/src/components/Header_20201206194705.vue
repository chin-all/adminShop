<template>
    <div class="header_bg">
        <el-dropdown @command="logoutFn">
            <span class="el-dropdown-link">
                {{username}}
                <i class="el-icon-setting el-icon-right"></i>
            </span>
            <el-dropdown-menu>
                <el-dropdown-iten command="x">注销</el-dropdown-iten>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>