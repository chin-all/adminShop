<template>
    <div class="header_bg">
        <el-dropdown @command="logoutFn">
            <span class="el-dropdown-link">
                {{username}}
                <i class="el-icon-setting el-icon-right"></i>
            </span>
        </el-dropdown>
    </div>
</template>