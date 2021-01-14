<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">商城设置</el-breadcrumb-item>
      <el-breadcrumb-item>规格管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="add" style="marginTop:10px">添加</el-button>

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
      <el-table-column label="属性名称" width="180" prop="specsname"></el-table-column>
      <el-table-column label="属性值" width="180">
        <!-- 数据不能作为文本渲染，需要作用域插槽 -->
        <template slot-scope="scope">
          <el-tag v-for="(item,index) in scope.row.attrs" :key="index">{{item}}</el-tag>
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

    <el-dialog
      :title="isAdd?tip+'新增':tip+'角色编辑'"
      :visible.sync="isShow"
      @open="openFn"
      @close="closeFn"
    >
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" label-width="100px" ref="form">
        <el-form-item label="规格名称" prop="specsname">
          <el-input v-model="form.specsname"></el-input>
        </el-form-item>
        <!-- 使用 attrs 收集属性值 -->
        <el-form-item label="规格值">
          <div v-for="(item,index) in attrs" :key="index" style="margin:5px">
            <el-input style="width:60%" v-model="item.val"></el-input>
            <el-button type="primary" v-show="index==0" @click="addAttr">添加属性</el-button>
            <el-button type="danger"  v-show="index>0" @click="delAttr(index)">删除属性</el-button>
          </div>
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
let defaultData = {
  attrs: "", //规格值
  specsname: "",
  status: true
};
export default {
  data() {
    return {
      tableData: [],
      isShow: false,
      isAdd: true, //新增还是编辑状态
      form: {
        ...defaultData
      },
      // [1,2,3]->  1,2,3
      //   attrs: [{val:"1"},{val:"2"},{val:"3"}], //规格值数组
      attrs: [{ val: "" }], //规格值数组
      rules: {
        specsname: [
          {
            required: true,
            message: "请输入属性名称"
          }
        ]
      },
      tip: "规格"
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    //   新增属性值按钮
    addAttr() {
      this.attrs.push({ val: "" });
    },
    // 删除属性值
    delAttr(index) {
      this.attrs.splice(index, 1);
    },
    // 确定按钮
    submitFn() {
      console.log();
      // 根据isAdd 判断进行 添加还是修改
      let url = this.isAdd ? "/api/specsadd" : "/api/specsedit";

      console.log(this.attrs);

      // 将属性值从数组对象中取出，用join方法拼接成字符串
      this.form.attrs = this.attrs.map(item => item.val).join(",");

      // console.log(this.form.attrs);
      // 状态修改为number值
      this.form.status = this.form.status ? 1 : 2;
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
    // 对话框打开
    openFn() {},
    // 对话框关闭，清空表单数据
    closeFn() {
      this.form = {
        ...defaultData
      };
      this.isAdd = true;
      this.attrs = [{ val: "" }];
    },
    // 点击添加按钮
    add() {
      this.isShow = true;
    },

    // 获取表格
    async getTableData() {
      let res = await this.$http.get("/api/specslist");
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.list;
      }
    },
    // 编辑
    async handleEdit(row) {
      // console.log(row);

      this.isAdd = false;
      let res = await this.$http.get("/api/specsinfo", {
        params: { id: row.id }
      });
      console.log(res);
      if (res.code == 200) {
        this.isShow = true;
        res.list[0].status = res.list[0].status == 1 ? true : false;

        this.attrs = res.list[0].attrs.map(item => {
          return { val: item };
        });
        this.form = {
          ...res.list[0],
          id: row.id //编辑时需要id,后台返回数据没有id,自行添加
        };
      } else if (res.code == 500) {
        this.$message.error(res.msg);
      }
    },
    // 删除
    async handleDelete(row) {
      try {
        // 提示删除操作是否进行
        await this.$confirm(`此操作将删除该${this.tip}, 是否继续?`, "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        // console.log(qs.stringify({id:1,name:2}))
        // 进行删除操作，点击了删除确定按钮
        let res = await this.$http.post("/api/specsdelete", { id: row.id });
        console.log(res);
        if (res.code == 200) {
          this.getTableData();
        }
      } catch (error) {
        // 点击取消按钮
      }
    }
  }
};
</script>