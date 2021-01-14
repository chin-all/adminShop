<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>秒杀活动</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- button按钮 -->
        <el-button type="primary" class="add" @click="add">添加</el-button>

        <!-- table表格 -->
        <el-table :data="tableData" border class="table-main" row-key="id">
            <el-table-column label="活动名称" width="180" prop="title">
            </el-table-column>
            <el-table-column label="状态" width="180">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status==1" type="success" effect="dark">启用</el-tag>
                    <el-tag v-else type="danger" effect="dark">禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 弹窗 -->
        <el-dialog :title="isAdd ? tip+'添加' : tip+'编辑'" :visible.sync="isShow" @open="open" @close="close">
            <el-form :model="form" :rules="rules" label-width="100px" ref="form">
                <el-form-item label="活动名称">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="活动期限">
                    <el-date-picker 
                    type="datetimerange"  
                    range-separator="至" 
                    start-placeholder="开始日期" 
                    end-placeholder="结束日期" 
                    v-model="timer"
                    value-format="timestamp">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="一级分类">
                    <el-select v-model="form.first_cateid" placeholder="请选择" @change="changeFirst">
                        <el-option v-for="(item,index) in firstList" :label="item.catename" :key="index" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级分类">
                    <el-select v-model="form.second_cateid" @change="changeSecond">
                        <el-option v-for="(item,index) in secondList" :label="item.catename" :key="index" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品">
                    <el-select v-model="form.goodsid" placeholder="请选择">
                        <el-option v-for="(item,index) in goodsList" :label="item.goodsname" :key="index" :value="item.id"></el-option>
                    </el-select>
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
import qs from "qs";
let defaultData = {
    title:"",
    begintime:"",
    endtime:"",
    first_cateid:"",
    second_cateid:"",
    goodsid:"",
    goodsname:"",
    status:true
}
export default {
    data(){
        return {
            tableData: [],
            isShow: false,
            isAdd: true,
            tip:"限时秒杀",
            form:{
                ...defaultData
            },
            rules:{
                username:[{
                    required:true,
                    message:"请输入用户名称"
                }]
            },
            firstList: [],
            secondList: [],
            goodsList: [],
            timer: []
        }
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        //点击确定按钮
        submit() {
            let url = this.isAdd ? "/api/seckadd" : "/api/seckedit"
            this.form.begintime = this.timer[0]
            this.form.endtime = this.timer[1]
            this.form.status = this.form.status ? 1 : 2
            this.$refs.form.validate(async valid => {
                if (valid) {
                    let res = await this.$http.post(url,this.form);
                    if(res.code==200){
                        this.$message.success('操作成功！')
                        //重置表，修改DOM
                        this.getTableData();
                        this.isShow = false;
                    }else if(res.code==500){
                        this.$message.error(res.msg);
                    }
                }
            })
        },
        //获取表格
        async getTableData(){
            let res = await this.$http.get("/api/secklist")
            if(res.code==200){
                this.tableData = res.list
            }
        },
        //点击弹框
        add(){
            this.isShow = true;
        },
        //对话框打开获取顶级菜单列表
        open(){
            this.getClassify();
        },
        // 切换一级分类
        changeFirst(id) {
            // 获取二级分类，设置二级分类为空
            this.form.second_cateid = "";
            this.getClassify(id);
            this.form.goodsid= "";
        },
        changeSecond(id){
            //设置商品为空
            this.form.goodsid= "";
            this.getGoodsList(id);
        },
        //获取分类列表
        async getClassify(pid = 0){
            //获取一级分类
            let res = await this.$http.get("/api/catelist",{
                params:{pid}
            })
            if(pid==0){
                if(res.code==200){
                    this.firstList = res.list
                }
            }else{//获取二级分类
                if(res.code==200){
                    this.secondList = res.list;
                }
            }
        },
        //获取goods商品列表
        async getGoodsList(id){
            let res = await this.$http.get("/api/goodslist",{params:{fid:this.form.first_cateid,sid:this.form.second_cateid}})
            if(res.code === 200){
                this.goodsList = res.list
            }
        },
        //关闭弹窗
        close(){
            this.form={
                ...defaultData
            }
            this.isAdd = true;
            this.secondList="";
            this.form.goodsname="";
        },
         //编辑
        async handleEdit(row){
            this.isAdd = false;
            let res = await this.$http.get("/api/seckinfo",{
                params:{id: row.id}
            });
            if(res.code==200){
                this.isShow = true;
                res.list.status = res.list.status==1 ? true : false
                this.timer = [res.list.begintime,res.list.endtime]
                //手动调用二级分类
                this.getClassify(res.list.first_cateid)
                //手动调用商品
                this.getGoodsList(res.list.second_cateid)
                this.form={
                    ...res.list,
                    id: row.id
                }
            }else if(res.code==500){
                this.$message.error(res.msg);
            }
        },
        //删除
        async handleDelete(row){
            let res = await this.$http.post("/api/seckdelete",{id: row.id})
            this.$confirm(`此操作将永久删除该${this.tip}, 是否继续?`, "", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                    this.page = 1,
                    this.getTableData()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            })
        }
    }
}
</script>