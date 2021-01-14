<template>
    <div class="header_bg">
        <el-dropdown @command="logoutFn">
            <span>
                {{username}}
                <i></i>
            </span>
        </el-dropdown>
    </div>
</template>