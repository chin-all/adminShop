<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>限时秒杀列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="add" style="margintop:10px; marginTop:10px">添加</el-button>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" row-key="id">
      <el-table-column
        label="活动名称"
        width="180"
        prop="title"
      ></el-table-column>
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

    <el-dialog
      :title="isAdd ? '菜单新增' : '菜单编辑'"
      :visible.sync="isShow"
      @open="openFn"
      @close="closeFn"
    >
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" label-width="100px" ref="form">
        <el-form-item label="活动名称" prop="goodname">
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
          <!-- 分类id 作为一级分类的id,选中一级分类，id 作为二级分类的pid -->
          <el-select v-model="form.first_cateid" @change="changeFirst" placeholder="请选择分类">
            <el-option
              v-for="(item, index) in firstList"
              :key="index"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <!-- 选中二级分类 -->
          <el-select v-model="form.second_cateid" placeholder="请选择分类">
            <el-option
              v-for="(item, index) in secondList"
              :key="index"
              :label="item.catename"
              :value="item.id"
            ></el-option>
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
        <el-button type="primary" @click="submitFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

let defaultData = {
  title: "",
  begintime: "",
  endtime: "",
  first_cateid: "",
  second_cateid: "",
  goodsid: "",
  status: true
};
export default {
  data() {
    return {
      tableData: [],
      isShow: false,
      isAdd: true, //新增还是编辑状态
      firstList: [], //一级分类列表
      secondList: [], //二级分类列表
      goodsList: [],
      timer: [],
      form: {
        ...defaultData,
      },
      rules: {
        goodsname: [
          {
            requierd: true,
            message: "活动名称不能为空",
          },
        ],
      }
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    // 切换一级分类
    changeFirst(id) {
    //   console.log(id);
      // 获取二级分类，设置二级分类为空
      this.form.second_cateid = "";
      this.getCateData(id);
    },


    // 确定按钮
    submitFn() {
      // 富文本编辑框内容作为 表单内容
      this.form.description = this.editor.txt.html();
      // 根据isAdd 判断进行 添加还是修改
      let url = this.isAdd ? "/api/seckadd" : "/api/seckedit";
      // 状态修改为number值
      this.form.specsattr = this.form.specsattr.join(",");
      console.log(this.form);
      this.$refs.form.validate(async (valid) => {
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
    // 对话框关闭，清空表单数据
    closeFn() {
      this.form = {
        ...defaultData,
      };
      this.isAdd = true;
    },
    // 点击添加按钮
    add() {
      this.isShow = true;
    },
    // 获取数据
    async getTableData() {
      let res = await this.$http.get("/api/secklist", {
        params: { page: this.page, size: this.size },
      });
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.list;
      }
    },
    // 获取分类列表数据
    async getCateData(pid = 0) {
      let res = await this.$http.get("/api/secklist", { params: { pid } });
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
    // 编辑
    async handleEdit(row) {
      // console.log(row);
      this.isAdd = false;
      let res = await this.$http.get("/api/seckinfo", {
        params: { id: row.id },
      });
      console.log(res);
      if (res.code == 200) {
        this.isShow = true;
        // img为空不设置fileList
        if (res.list.img) {
          // res.list.img 时后台的相对路径地址
          // 设置上传图片
          this.fileList = [
            {
              name: "",
              url: this.$domain + `${res.list.img}`,
            },
          ];
        }
        // 手动调用获取二级分类列表的方法（参数是一级分类的id）
        this.getCateData(res.list.first_cateid);
        // 手动获取属性值
        //
        // console.log(this.editor)
        // 数据比富文本编辑框生产来的慢
        if (this.editor) {
          this.editor.txt.html(res.list.description);
        }
        // this.editor.txt.html(res.list.description);

        res.list.specsattr = res.list.specsattr.split(",");
        this.form = {
          ...res.list,
          id: row.id, //编辑时需要id,后台返回数据没有id,自行添加
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
          type: "warning",
        });
        // console.log(qs.stringify({id:1,name:2}))
        // 进行删除操作，点击了删除确定按钮
        let res = await this.$http.post("/api/goodsdelete", { id: row.id });
        console.log(res);
        if (res.code == 200) {
          this.getTableData();
        }
      } catch (error) {
        // 点击取消按钮
      }
    },
  },
};
</script>