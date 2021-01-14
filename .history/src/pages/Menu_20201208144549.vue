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

        row-key: 指定 行唯一标识属性
    -->
    <el-table
      :data="tableData"
      style="width: 100%"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      row-key="id"
    >
      <!-- 每一行数据都是对象， -->
      <!-- 列表 
        prop 指定渲染的数据对象 key
      -->
      <el-table-column label="名称" width="180" prop="title"> </el-table-column>
      <el-table-column label="图标" width="180">
        <!-- 数据不能作为文本渲染，需要作用域插槽 -->
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="180">
        <!-- 数据不能作为文本渲染，需要作用域插槽 -->
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 1">目录</el-tag>

          <el-tag v-else type="success">菜单</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="url" width="180" prop="url"></el-table-column>
      <el-table-column label="操作">
        <!-- 作用域插槽 -->
        <template slot-scope="scope">
          <!-- scoped.row ：数据对象 -->
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗 -->
    <el-dialog title="菜单新增" :visible.sync="isShow" label-width="180px">
      <!-- 表单 -->
      <el-form :model="form" :rules="rules">
        <el-form-item label="菜单分类">
          <!-- {{form.pid}} -->
          <!-- pid 关联是上级菜单的id -->
          <el-select v-model="form.pid" @change="changeType">
            <el-option label="顶级菜单" :value="0"></el-option>
            <el-option
              v-for="(item, index) in topList"
              :key="index"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" v-show="form.type == 1">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="菜单地址" v-show="form.type == 2">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio v-model="form.type" :label="1" :disabled="form.type == 2"
            >目录</el-radio
          >
          <el-radio v-model="form.type" :label="2" :disabled="form.type == 1"
            >菜单</el-radio
          >
        </el-form-item>
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
  pid: 0, // 上级菜单分类
  title: "",
  status: true,
  icon: "",
  type: 1,
  url: "",
};
export default {
  data() {
    return {
      tableData: [],
      isShow: false,
      isAdd: true, // 新增还是编辑状态
      topList: [],
      form: {
        ...defaultData,
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入菜单名称",
          },
        ],
      },
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    // 确定按钮
    submitFn() {
      // 根据isAdd判断进行添加还是修改
      let url = this.isAdd?"/api/menuadd":"/api/menuedit";
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
    // 打开对话框，获取顶级菜单列表
    openFn() {
      this.getTop();
    },
    // 关闭对话框，清空表单
    closeFn() {
      this.form = {
        ...defaultData
      };
      this.isAdd = true
    },
    // 点击添加按钮
    add() {
      this.isShow = true;
    },
    // 切换菜单分类触发
    changeType(pid) {
      // console.log(pid)
      // 根据当前pid切换type
      this.form.type = pid == 0 ? 1 : 2;
    },
    // 获取树形数据
    async getTableData() {
      let res = await this.$http.get("/api/menulist", {
        params: { istree: true },
      });
      console.log(res);
      if (res.code == 200) {
        console.log(res);
        this.tableData = res.list;
      }
    },
    async getTop() {
      let res = await this.$http.get("/api/menulist", {
        params: { pid: 0 },
      });
      console.log(res);
      if (res.code == 200) {
        console.log(res);
        this.topList = res.list;
      }
    },
    // 编辑
    async handleEdit(row) {
      // console.log(row);
      this.isAdd = false;
      let res = await this.$http.get("/api/menuinfo",{
        params: {id: row.id}
      });
      // console.log(res);
      if(res.code == 200){
        this.isShow = true;
        res.list.status = res.list.status == 1?true:false;
        this.form = {
          ...res.list,
          id: row.id // 编辑时需要id，后台返回数据无id，需自行添加
        };
      }else if(res.code ==500){
        this.$message.error(res.msg)
      }
    },
    // 删除
    handleDelete(index, row) {
      console.log(index, row);
    },
  },
};
</script>