<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="add" style="marginTop:10px">添加</el-button>

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" row-key="id">
      <el-table-column label="轮播图名称" width="180" prop="title"> </el-table-column>
      <el-table-column label="状态" width="180">
        <!-- 数据不能作为文本渲染，需要作用域插槽 -->
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="success" effect="dark">启用</el-tag>
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

    <!-- 弹窗 -->
    <el-dialog :title="isAdd?'添加'+tip:'编辑'+tip" :visible.sync="isShow" @close="closeFn">
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" label-width="100px" ref="form">
        <el-form-item label="角色类型" prop="rolename">
            <el-input v-model="form.rolename"></el-input>
        </el-form-item>
        <!-- <el-form-item label="分类图片">
          <el-upload
            action="#"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :auto-upload="false"
            :on-change="fileChange"
            :multiple="false"
            :file-list="fileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload> -->
          <!-- 点击放大预览图片 -->
          <!-- <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item> -->
        <el-form-item label="状态">
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
  title: "",
  status: true,
};
export default {
  data() {
    return {
      tableData: [],
      isShow: false,
      isAdd: true, // 新增还是编辑状态
      form: {
        ...defaultData,
      },
      data: [],
      rules: {
        rolename: [
          {
            required: true,
            message: "请输入角色名称",
          },
        ],
      },
      tip: "轮播图",
      checkedMenus: []
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    // 确定按钮
    submitFn() {
      // 根据isAdd判断进行添加还是修改
      let url = this.isAdd?"/api/roleadd":"/api/banneredit";

      this.form.menus = this.refs.tree.getCheckedKeys().join(",");
      // 状态修改为number值
      this.form.status = this.form.status?1:2;
      this.$refs.form.validate(async valid =>{
        if(valid){
          let res = await this.$http.post(url, this.form);
          // console.log(res);
          if (res.code == 200){
            this.$message.success("操作成功");
            this.getTableData();
            this.isShow = false;
          } else if (res.code == 500){
            this.$message.error(res.msg);
          }
        }
      })
    },
    // 关闭对话框，清空表单
    closeFn() {
      this.form = {
        ...defaultData
      };
      this.isAdd = true;
      this.checkedMenus = [];
    },
    // 点击添加按钮
    add() {
      this.isShow = true;
    },

    // 获取表格
    async getTableData() {
      let res = await this.$http.get("/api/bannerlist");
      //  console.log(res);
      if (res.code == 200) {
        // console.log(res);
        this.tableData = res.list;
      }
    },

    // 编辑
    async handleEdit(row) {
      // console.log(row);
      this.isAdd = false;
      let res = await this.$http.get("/api/bannerinfo",{
        params: {id: row.id}
      });
      // console.log(res);
      if(res.code == 200){
        this.isShow = true;
        res.list.status = res.list.status == 1 ? true : false;
        this.form = {
          ...res.list,
          id: row.id // 编辑时需要id，后台返回数据无id，需自行添加
        };
      }else if(res.code ==500){
        this.$message.error(res.msg)
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
        // 进行删除操作，点击了删除确定按钮
        let res = await this.$http.post("/api/bannerdelete",{id:row.id});
        console.log(res);
        if(res.code==200){
          this.tableData =[...res.list]
        }
      } catch (error) {
        // 点击取消按钮
      }
    }
  }
};
</script>