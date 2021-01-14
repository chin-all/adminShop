<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="add">添加</el-button>

    <!-- 表格 
        data:表格数据
        tree-props:数据数据模式
            children:子级数据的名称key
            hasChildren: 有子级数据

        row-key: 指定 行唯一标识属性ssss
    -->
    <el-table :data="tableData" style="width: 100%" row-key="id">
      <!-- 每一行数据都是对象， -->
      <!-- 列表 
        prop 指定渲染的数据对象 key
      -->
      <el-table-column label="用户编号" width="180" prop="uid"></el-table-column>
      <el-table-column label="角色名称" width="180" prop="rolename"></el-table-column>
      <el-table-column label="用户名称" width="180" prop="username"></el-table-column>
      <el-table-column label="状态" width="180">
        <!-- 数据不能作为文本渲染，需要作用域插槽 -->
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==1" type="success" effect="dark">启用</el-tag>
          <el-tag v-else type="danger" effect="dark">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <!-- 作用域插槽 -->
        <template slot-scope="scope">
          <!-- scoped.row ：数据对象 -->
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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

    <el-dialog :title="isAdd?'菜单新增':'菜单编辑'" :visible.sync="isShow" @open="openFn" @close="closeFn">
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" label-width="100px" ref="form">
        <el-form-item label="角色">
          <!-- roleid 关联是role的id -->
          <el-select v-model="form.roleid">
            <el-option
              v-for="(item,index) in roleList"
              :key="index"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input v-model="form.password" type="password"></el-input>
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
  roleid: "",
  username: "",
  password: "",
  status: true
};
export default {
  data() {
    return {
      tableData: [],
      isShow: false,
      isAdd: true, //新增还是编辑状态
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
      size: 2,
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
      let url = this.isAdd ? "/api/useradd" : "/api/useredit";
      // 状态修改为number值
      this.form.status = this.form.status ? 1 : 2;
      console.log(this.form);
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = await this.$http.post(url, this.form);
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
      this.isAdd = true;
    },
    // 点击添加按钮
    add() {
      this.isShow = true;
    },
    // 获取数据
    async getTableData() {
      let res = await this.$http.get("/api/userlist", {
        params: { page: this.page, size: this.size }
      });
      
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.list;
      }
      //获取管理员总数
      let res1 = await this.$http.get("/api/usercount");
      console.log(res1)
      if(res1.code==200){
          this.total = res1.list[0].total;
      }
    },
    // 获取角色数据
    async getRoleData() {
      let res = await this.$http.get("/api/rolelist");
      console.log(res);
      if (res.code == 200) {
        this.roleList = res.list;
      }
    },
    // 编辑
    async handleEdit(row) {
      // console.log(row);

      this.isAdd = false;
      let res = await this.$http.get("/api/userinfo", {
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
    },
    // 删除
    async handleDelete(row) {
      try {
        // 提示删除操作是否进行
        await this.$confirm("此操作将删除该菜单, 是否继续?", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        // console.log(qs.stringify({id:1,name:2}))
        // 进行删除操作，点击了删除确定按钮
        let res = await this.$http.post("/api/userdelete", { id: row.id });
        console.log(res);
        if (res.code == 200) {
          this.page = 1;
          this.getTableData();
        }
      } catch (error) {
        // 点击取消按钮
      }
    }
  }
};
</script>