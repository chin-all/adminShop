<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">商城设置</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
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
    <el-table
      :data="tableData"
      style="width: 100%"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      row-key="id"
    >
      <!-- 每一行数据都是对象， -->
      <!-- 列表 
        prop 指定渲染的数据对象 key
      -->
      <el-table-column label="分类名称" width="180" prop="catename"></el-table-column>
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

    <!-- 弹窗 -->

    <el-dialog :title="isAdd?'菜单新增':'菜单编辑'" :visible.sync="isShow" @open="openFn" @close="closeFn">
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" label-width="100px" ref="form">
        <el-form-item label="上级分类">
          <!-- {{form.pid}} -->
          <!-- pid 关联是上级菜单的id -->
          <el-select v-model="form.pid">
            <el-option label="顶级分类" :value="0"></el-option>
            <el-option
              v-for="(item,index) in topList"
              :key="index"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="catename">
          <el-input v-model="form.catename"></el-input>
        </el-form-item>
        <!-- 根据type 选择 显示菜单图标或者是菜单地址的输入框 -->
        <el-form-item label="分类图片">
          <!-- 上传文件的区域
              on-preview：预览触发的函数
              list-type： picture-card 照片墙模式
              file-list:编辑时预设置上传文件的
           -->
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
          </el-upload>
          <!-- 点击放大预览图片 

                append-to-body:放在弹框错误堆叠
          -->
          <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
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
  pid: 0, //上级分类id
  catename: "",
  status: true,
  img: ""
};
export default {
  data() {
    return {
      tableData: [],
      isShow: false,
      isAdd: true, //新增还是编辑状态
      topList: [], //顶级分类列表
      form: {
        ...defaultData
      },
      fileList:[],//上传文件列表
      dialogImageUrl:"",//预览图的地址
      dialogVisible:false,//预览框的显示状态
      rules: {
        catename: [
          {
            required: true,
            message: "请输入分类名称"
          }
        ]
      }
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    // 选中上传图片时触发的事件
    // @file:上传文件信息对象
    fileChange(file,fileList){
      console.log(file,fileList)
      //被上传的文件信息
      this.form.img = file.raw;
    },
    // 点击预览事件
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 确定按钮
    submitFn() {
      // 根据isAdd 判断进行 添加还是修改
      let url = this.isAdd ? "/api/cateadd" : "/api/cateedit";
      // 防止空白图片上传
      if(!this.form.img){
        this.$message.error("请选择上传文件");
        return;
      }
      console.log(this.form)
      // 状态修改为number值
      this.form.status = this.form.status ? 1 : 2;
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = await this.$upload.post(url, this.form);
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
      this.getTop();
    },
    // 对话框关闭，清空表单数据
    closeFn() {
      this.form = {
        ...defaultData
      };
      this.isAdd = true;

      // 清空上传文件相关的设置
      this.dialogImageUrl = "";
      this.dialogVisible = false;
      this.fileList = [];
    },
    // 点击添加按钮
    add() {
      this.isShow = true;
    },

    // 获取树形数据
    async getTableData() {
      let res = await this.$http.get("/api/catelist", {
        params: { istree: true }
      });
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.list;
      }
    },
    // 获取顶级分类数据
    async getTop() {
      let res = await this.$http.get("/api/catelist", {
        params: { pid: 0 }
      });
      // console.log(res);
      if (res.code == 200) {
        this.topList = res.list;
      }
    },
    // 编辑
    async handleEdit(row) {
      // console.log(row);

      this.isAdd = false;
      let res = await this.$http.get("/api/cateinfo", {
        params: { id: row.id }
      });
      console.log(res);
      if (res.code == 200) {
        this.isShow = true;
        res.list.status = res.list.status == 1 ? true : false;
        this.form = {
          ...res.list,
          id: row.id //编辑时需要id,后台返回数据没有id,自行添加
        };

        // img为空不设置fileList
        if(res.list.img){
          // res.list.img 时后台的相对路径地址
          // 设置上传图片
          this.fileList = [{
            name:"",
            url:this.$domain+`${res.list.img}`,
          }]
        }
      } else if (res.code == 500) {
        this.$message.error(res.msg);
      }
    },
    // 删除
    async handleDelete(row) {
      try {
        // 提示删除操作是否进行
        await this.$confirm("此操作将删除该分类, 是否继续?", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });

        // 进行删除操作，点击了删除确定按钮
        let res = await this.$http.post("/api/catedelete", { id: row.id });
        console.log(res);
        if (res.code == 200) {
          this.tableData = [...res.list];
        }
      } catch (error) {
        // 点击取消按钮
      }
    }
  }
};
</script>