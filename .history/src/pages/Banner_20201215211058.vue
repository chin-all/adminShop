<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>轮播图管理</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- button按钮 -->
        <el-button type="primary" class="add" @click="add">添加</el-button>

        <!-- table表格 -->
        <el-table :data="tableData" border class="table-main" row-key="id">
            <el-table-column label="轮播图名称" width="180" prop="title"></el-table-column>
            <el-table-column label="状态" width="180">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status==1" type="success" effect="dark">启用</el-tag>
                    <el-tag v-else type="danger" effect="dark">禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit( scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 弹窗 -->
        <el-dialog :title="isAdd ? tip+'添加' : tip+'编辑'" :visible.sync="isShow" @open="open" @close="close">
            <el-form :model="form" :rules="rules" label-width="100px" ref="form">
                <el-form-item label="轮播图标题" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="轮播图图片">
                    <el-upload action="#" list-type="picture-card" :auto-upload="false" :file-list="fileList" :on-change="fileChange" :on-preview="handlePictureCardPreview" :multiple="false">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible" append-to-body>
                        <img width="100%" :src="dialogImageUrl" alt />
                    </el-dialog>
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="form.status"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShow = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
let defaultData = {
    title:"",
    img:"",
    status:true
}
export default {
    data(){
        return {
            tableData:[],
            isAdd: true,
            isShow: false,
            form:{
                ...defaultData
            },
            tip:"轮播图",
            rules:{
                title:[{
                    required:true,
                    message:"请输入轮播图名称"
                }]
            },
            dialogVisible: false,
            dialogImageUrl:"",//预览图的地址
            fileList:[]  //上传文件列表
        }
    },
    mounted() {
        this.getTableData()
    },
    methods: {
        async getTableData(){
            let res = await this.$http.get("/api/bannerlist")
            if(res.code==200){
                this.tableData = res.list
            }
        },
        //确认按钮
        submit(){
            let url = this.isAdd ? "/api/banneradd" : "/api/banneredit";
            this.form.status = this.form.status ? 1 : 2;
            this.$refs.form.validate(async valid => {
                if(valid){
                    let res = await this.$upload.post(url,this.form);
                    console.log(res)
                    if(res.code == 200){
                        this.$message.success("操作成功");
                        this.getTableData();
                        this.isShow = false;
                    }else if(res.code == 500){
                        this.$message.error(res.msg);
                    }
                }
            })
        },
        add(){
            this.isShow = true
        },
        // 选中上传图片时触发的事件
        // @file:上传文件信息对象
        fileChange(file,fileList){
            console.log(file, fileList);
            this.form.img = file.raw;
        },
        //点击预览事件
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        //对话框打开获取顶级菜单列表
        open(){
            // this.getMenuData();
        },
        //对话框关闭，清除表单数据
        close(){
            this.form = {
                ...defaultData
            };
            this.isAdd = true;
        },
        //编辑
        async handleEdit(row){
            console.log(row);
            this.isAdd = false;
            let res = await this.$http.get("/api/bannerinfo",{params:{id: row.id}})
            if(res.code == 200){
                this.isShow  = true;
                res.list.status = res.list.status == 1 ? true : false;
                if(res.list.img){
                    this.fileList=[{
                        name:"",
                        url : this.$domain+`${res.list.img}`
                    }]
                }
                this.form={
                    ...res.list,
                    id: row.id //编辑时需要id,后台返回数据没有id,自行添加
                }
            }else if(res.code == 500){
                this.$message.error(res.msg)
            }
        },
        //删除
        async handleDelete(row){
            try{
                await this.$confirm(`此操作将删除${this.tip}，是否继续？`,"",{
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                let res = await this.$http.post("/api/bannerdelete",{id: row.id})
                console.log(res);
                if(res.code == 200){
                    this.tableData=[...res.list]
                }
            }catch(error){

            }
        }
    }
}
</script>