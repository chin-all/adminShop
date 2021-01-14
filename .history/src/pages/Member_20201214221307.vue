<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>会员管理</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- tableb表格 -->
        <el-table :data="tableData" border class="table-main member" row-key="id">
            <el-table-column label="昵称" width="180" prop="nickname">
            </el-table-column>
            <el-table-column label="手机号" width="180" prop="phone">
            </el-table-column>
            <el-table-column label="注册日期" width="180" prop="addtime">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit( scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <el-pagination background layout="prev, pager, next" :total="total" :current-page="page" :page-size="size" @current-change="changeType"></el-pagination>

        <!-- 弹窗 -->
        <el-dialog title="会员编辑" :visible.sync="dialogVisible">
            <el-form :model="form" :rules="rules" label-width="100px" ref="form">
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="form.nickname"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password"></el-input>
                    <p>不填写则不修改密码</p>
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="form.status"></el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
let defaultData={
    uid:"",
    nickname:"",
    phone:"",
    password:"",
    addtime:"",
    status:true
}
export default {
    data(){
        return{
            tableData:[],
            page:1,
            size:2,
            total:0,
            form:{
                ...defaultData
            },
            dialogVisible: false,  //弹框显示
            rules:{
                nickname:[{
                    resquired:true,
                    message:"用户昵称不能为空"
                }]
            }
        }
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        //确认按钮
        submit(){
            this.form.status = this.form.status ? 1 : 2;
            this.$refs.form.validate(async valid => {
                if (valid) {
                    let res = await this.$http.post("/api/memberedit",this.form);
                    if(res.code==200){
                        this.$message.success('操作成功！')
                        //重置表，修改DOM
                        this.getTableData();
                        this.dialogVisible = false;
                    }else if(res.code==500){
                        this.$message.error(res.msg);
                    }
                }
            })
        },
        //获取表格数据
        async getTableData(){
            let res = await this.$http.get("/api/memberlist",{
                params:{size: this.size,page: this.page}
            })
            console.log(res);
            if(res.code==200){
                //遍历addtime，取值
                res.list.map(item=>{
                    item.addtime = this.setTime(JSON.parse(item.addtime))
                })
                this.tableData = res.list
            }
        },
        setTime(addtime){
            let date = new Date(addtime)
            let y = date.getFullYear()
            let m = date.getMonth() + 1
            let d = date.getDate()
            let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
            let mi = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
            let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds() 
            return `${y}-${m}-${d} ${h}:${mi}:${s}`
        },
        //切换分页
        changeType(page){
            this.page = page;
            this.getTableData();
        },
        //编辑
        async handleEdit(row){
            let res = await this.$http.get("/api/memberinfo",{params:{uid: row.uid}})
            console.log(res);
            if(res.code == 200){
                console.log(res);
                this.dialogVisible  = true;
                res.list.status = res.list.status == 1 ? true : false;
                this.form={
                    ...res.list,
                    uid: row.uid,
                    password:""
                }
                console.log(this.form);
            }else if(res.code == 500){
                this.$message.error(res.msg)
            }
        }
    }
}
</script>