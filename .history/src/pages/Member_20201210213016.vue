<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" row-key="id">
      <!-- 每一行数据都是对象， -->
      <!-- 列表 
        prop 指定渲染的数据对象 key
      -->
      <el-table-column label="昵称" width="180" prop="nickname"></el-table-column>
      <el-table-column label="手机号" width="180" prop="phone"></el-table-column>
      <el-table-column label="注册日前" width="180" prop="addtime"></el-table-column>
      <el-table-column label="操作">
        <!-- 作用域插槽 -->
        <template slot-scope="scope">
          <!-- scoped.row ：数据对象 -->
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器：
        layout:布局
    -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      :current-page="page"
      @current-change="currentChange"
    ></el-pagination>
    <!-- 弹窗 -->

    <el-dialog title="会员编辑" :visible.sync="isShow">
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" label-width="100px" ref="form">
        <el-form-item label="昵称" prop="username">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <!-- {{form.status}} -->
          <el-switch v-model="form.status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="submitFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import qs from "qs";
let defaultData = {
  nickname: "",
  phone: "",
  password: "",
  status: true
};
export default {
  data() {
    return {
      tableData: [],
      isShow: false,
      roleList: [],
      form: {
        ...defaultData
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名称"
          }
        ]
      },
      page: 1,
      size: 6,
      total:0,
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    currentChange(page) {
        // console.log(page)
        this.page = page;
        this.getTableData();
    },
    // 确定按钮
    submitFn() {
      // 根据isAdd 判断进行 添加还是修改
    //   let url = this.isAdd ? "/api/useradd" : "/api/useredit";
      // 状态修改为number值
      this.form.status = this.form.status ? 1 : 2;
      console.log(this.form);
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = await this.$http.post("/api/memberedit", this.form);
          console.log(res);
          if (res.code == 200) {
            this.$message.success("操作成功");
            this.getTableData();
            this.isShow = false;
          } else if (res.code == 500) {
            this.$message.error(res.msg);
          }
        }
      });
    },
    // 对话框打开,获取顶级菜单列表
    openFn() {
      this.getRoleData();
    },
    // 对话框关闭，清空表单数据
    closeFn() {
      this.form = {
        ...defaultData
      };
    },
    // 获取数据
    async getTableData() {
      let res = await this.$http.get("/api/memberinfo", {
        params: { page: this.page, size: this.size }
      });
      
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.list;
      }
      //获取会员总数
      let res1 = await this.$http.get("/api/memberinfo");
      console.log(res1)
      if(res1.code==200){
          this.total = res1.list[0].total;
      }
    },
    // 获取会员数据
    async getRoleData() {
      let res = await this.$http.get("/api/memberinfo");
      console.log(res);
      if (res.code == 200) {
        this.roleList = res.list;
      }
    },
    // 编辑
    async handleEdit(row) {
      // console.log(row);

      this.isAdd = false;
      let res = await this.$http.get("/api/memberedit", {
        params: { uid: row.uid }
      });
      console.log(res);
      if (res.code == 200) {
        this.isShow = true;
        res.list.status = res.list.status == 1 ? true : false;
        this.form = {
          ...res.list,
          password:"",
          uid: row.uid //编辑时需要id,后台返回数据没有id,自行添加
        };
      } else if (res.code == 500) {
        this.$message.error(res.msg);
      }
    }
  }
};
</script>