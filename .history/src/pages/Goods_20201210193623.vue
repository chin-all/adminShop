<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
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
      <el-table-column label="一级分类" width="180" prop="firstcatename"></el-table-column>
      <el-table-column label="二级分类" width="180" prop="secondcatename"></el-table-column>
      <el-table-column label="商品名称" width="180" prop="goodsname"></el-table-column>
      <el-table-column label="销售价格" width="180" prop="price"></el-table-column>
      <el-table-column label="市场价格" width="180" prop="market_price"></el-table-column>
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

    <el-dialog
      :title="isAdd?'菜单新增':'菜单编辑'"
      :visible.sync="isShow"
      @open="openFn"
      @close="closeFn"
      @opened="openedFn"
    >
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" label-width="100px" ref="form">
        <el-form-item label="一级分类">
          <!-- 分类id 作为一级分类的id,选中一级分类，id 作为二级分类的pid -->
          <el-select v-model="form.first_cateid" @change="changeFirst">
            <el-option
              v-for="(item,index) in firstList"
              :key="index"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <!-- 选中二级分类 -->
          <el-select v-model="form.second_cateid">
            <el-option
              v-for="(item,index) in secondList"
              :key="index"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsname">
          <el-input v-model="form.goodsname" type></el-input>
        </el-form-item>
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
        <!-- 属性列表 -->
        <el-form-item label="属性">
          <!--  -->
          <el-select v-model="form.specsid" @change="changeSpecs">
            <el-option
              v-for="(item,index) in specsList"
              :key="index"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 属性值 -->
        <el-form-item label="属性值">
          <!--multiple 可以实现多选，获取的是数组  -->
          <!-- {{form.specsattr}} -->
          <el-select v-model="form.specsattr" multiple>
            <el-option v-for="(item,index) in attrs" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售价">
          <el-input v-model="form.price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="市场价">
          <el-input v-model="form.market_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="是否热卖">
          <el-radio v-model="form.ishot" :label="1">是</el-radio>
          <el-radio v-model="form.ishot" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否新品">
          <el-radio v-model="form.isnew" :label="1">是</el-radio>
          <el-radio v-model="form.isnew" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否上架">
          <el-radio v-model="form.status" :label="1">上架</el-radio>
          <el-radio v-model="form.status" :label="2">下架</el-radio>
        </el-form-item>
        <el-form-item label="商品描述">
          <!-- 富文本编辑器 -->
          <div id="editor"></div>
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
import E from "wangeditor";

let defaultData = {
  first_cateid: "",
  second_cateid: "",
  goodsname: "",
  price: "",
  market_price: "",
  img: "",
  description: "",
  specsid: "",
  specsattr: "",
  isnew: 1,
  ishot: 1,
  status: 1
};
export default {
  data() {
    return {
      tableData: [],
      isShow: false,
      isAdd: true, //新增还是编辑状态
      firstList: [], //一级分类列表
      secondList: [], //二级分类列表
      specsList: [], //属性列表
      attrs: [], //属性值列表
      form: {
        ...defaultData
      },
      fileList: [], //上传文件列表
      dialogImageUrl: "", //预览图的地址
      dialogVisible: false, //预览框的显示状态
      rules: {
        goodsname: [
          {
            requierd: true,
            message: "xxxx"
          }
        ]
      },
      page: 1,
      size: 2,
      total: 0
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    // 选中上传图片时触发的事件
    // @file:上传文件信息对象
    fileChange(file, fileList) {
      console.log(file, fileList);
      //被上传的文件信息
      this.form.img = file.raw;
    },
    // 点击预览事件
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 切换一级分类
    changeFirst(id) {
      console.log(id);
      // 获取二级分类，设置二级分类为空
      this.form.second_cateid = "";
      this.getCateData(id);
    },
    
    // 切换分页器
    currentChange(page) {
      // console.log(page)
      this.page = page;
      this.getTableData();
    },
    // 确定按钮
    submitFn() {
      // 富文本编辑框内容作为 表单内容
      this.form.description = this.editor.txt.html();
      // 根据isAdd 判断进行 添加还是修改
      let url = this.isAdd ? "/api/goodsadd" : "/api/goodsedit";
      // 状态修改为number值
      this.form.specsattr = this.form.specsattr.join(",");
      console.log(this.form);
      this.$refs.form.validate(async valid => {
        console.log(valid);
        if (valid) {
          // 上传文件的方法
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
      this.getCateData();
      this.getSpecs();
    },
    openedFn() {
      // 想要获取dom,必须挂载完毕后
      console.log(document.getElementById("editor"));
    //  容器清空
      document.getElementById("editor").innerHTML = "";
      //实例化
      this.editor = new E("#editor");
      // 或者 const editor = new E(document.getElementById('editor'))

      /* this.editor.config.onchange = newHtml => {
        // console.log('change 之后最新的 html', newHtml)
        this.form.description = newHtml;
      }; */
      // 创建富文本编辑器
      this.editor.create();
      // 数据先返回，直接设置数据   
      this.editor.txt.html(this.form.description)
    },
    // 对话框关闭，清空表单数据
    closeFn() {
      this.form = {
        ...defaultData
      };
      this.isAdd = true;
      this.fileList =[];//上传文件列表
      this.dialogImageUrl = ""; //预览图的地址
      this.dialogVisible=false;
    },
    // 点击添加按钮
    add() {
      this.isShow = true;
    },
    // 获取数据
    async getTableData() {
      let res = await this.$http.get("/api/goodslist", {
        params: { page: this.page, size: this.size }
      });
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.list;
      }
      //获取商品总数
      let res1 = await this.$http.get("/api/goodscount");
      console.log(res1);
      if (res1.code == 200) {
        this.total = res1.list[0].total;
      }
    },
    // 获取分类列表数据
    async getCateData(pid = 0) {
      let res = await this.$http.get("/api/catelist", { params: { pid } });
      // pid不传，值为0  获取一级分类
      if (pid == 0) {
        console.log(res);
        if (res.code == 200) {
          this.firstList = res.list;
        }
      } else {
        //   获取二级分类
        console.log(res);
        if (res.code == 200) {
          this.secondList = res.list;
          this.second_cateid = "";
        }
      }
    },
    // 获取属性值列表函数
    changeSpecs(id) {
      // 通过id 获取属性对象，对象的attrs就是属性值
      /* this.specsList.map(item=>{
            if(item.id==id){
                this.attrs = item.attrs;
            }
        }) */
        //this.form.specsattr = [];
      console.log(this.specsList);
      this.attrs = this.specsList.find(item => id == item.id).attrs;
    },
    // 获取属性列表
    async getSpecs() {
      let res = await this.$http.get("/api/specslist");
      if (res.code == 200) {
        console.log(res);
        this.specsList = res.list;
        // 防止点击添加报错的问题
        if(this.form.specsid){
            this.changeSpecs(this.form.specsid)
        } 
      }
    },
    // 编辑
    async handleEdit(row) {
      // console.log(row);
      this.isAdd = false;
      let res = await this.$http.get("/api/goodsinfo", {
        params: { id: row.id }
      });
      console.log(res);
      if (res.code == 200) {
        this.isShow = true;
        // img为空不设置fileList
        if(res.list.img){
          // res.list.img 时后台的相对路径地址
          // 设置上传图片
          this.fileList = [{
            name:"",
            url:this.$domain+`${res.list.img}`,
          }]
        }
        // 手动调用获取二级分类列表的方法（参数是一级分类的id）
        this.getCateData(res.list.first_cateid);
        // 手动获取属性值
        // 
        // console.log(this.editor)
        // 数据比富文本编辑框生产来的慢
        if(this.editor){
            this.editor.txt.html(res.list.description);
        }
        // this.editor.txt.html(res.list.description);

        res.list.specsattr = res.list.specsattr.split(",")
        this.form = {
          ...res.list,
          id: row.id //编辑时需要id,后台返回数据没有id,自行添加
        };
        console.log(this.form);
        this.getSpecs();
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
        let res = await this.$http.post("/api/goodsdelete", { id: row.id });
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