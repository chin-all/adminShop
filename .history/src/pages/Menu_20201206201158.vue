<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="primary">添加</el-button>

    <!-- 表格 
        data:表格数据
        tree-props:数据数据模式
            children:子级数据的名称key
            hasChildren: 有子级数据

        row-key: 指定 行唯一标识属性
    -->
    <el-table :data="tableData" style="width: 100%"  :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        row-key="id"
    >
        <!-- 每一行数据都是对象， -->
      <!-- 列表 
        prop 指定渲染的数据对象 key
      -->
      <el-table-column label="名称" width="180" prop="title">
        
      </el-table-column>
      <el-table-column label="图标" width="180" >
          <!-- 数据不能作为文本渲染，需要作用域插槽 -->
          <template slot-scope="scope">
              <i :class="scope.row.icon"></i>
          </template>
      </el-table-column>
      <el-table-column label="类型" width="180" >
          <!-- 数据不能作为文本渲染，需要作用域插槽 -->
          <template slot-scope="scope">
              <el-tag v-if="scope.row.type==1">目录</el-tag>

              <el-tag v-else  type="success">菜单</el-tag>
          </template>
      </el-table-column>
      <el-table-column label="url" width="180" prop="url"></el-table-column>
      <el-table-column label="操作">
          <!-- 作用域插槽 -->
        <template slot-scope="scope">
            <!-- scoped.row ：数据对象 -->
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>

export default {
  data() {
    return {
      tableData: []
    };
  },
  mounted(){
      this.getTableData();
  },
  methods: {
    async getTableData(){
        let res = await this.$http.get("/api/menulist",{params:{istree:true}});
        console.log(res);
        if(res.code==200){
            console.log(res)
            this.tableData = res.list;
        }

    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  }
};
</script>