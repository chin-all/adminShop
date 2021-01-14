<template>
  <div class="index_bg">
    <!-- 布局组件 -->
    <!-- row:行 
    
    gutter:col之间的间隙-->
    <el-row :gutter="20" type="flex" justify="center">
      <!-- col - 列表
                span = 占据的列表
      -->
      <el-col :span="10">
        <div class="grid-content">
          <h3>商品总览</h3>
          <el-row>
            <el-col :span="6" class="content_item">100</el-col>
            <el-col :span="6" class="content_item">100</el-col>

            <el-col :span="6" class="content_item">100</el-col>
            <el-col :span="6" class="content_item">100</el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="grid-content">
          <h3>用户总览</h3>
          <el-row>
            <el-col :span="6" class="content_item">100</el-col>
            <el-col :span="6" class="content_item">100</el-col>

            <el-col :span="6" class="content_item">100</el-col>
            <el-col :span="6" class="content_item">100</el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <!-- 准备带宽高的容器 -->
    <div id="main" style="width: 800px;height:600px;"></div>
  </div>
</template>
<script>
// 导出echarts
import echarts from "echarts";
export default {
  // 页面存在main 元素时，进行初始化
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));

    // 指定图表的配置项和数据
    var option = {
      // tooltip: {},
      // 图例
      legend: {
        data: ["近一周订单数量"]
      },
      // x轴 设置
      xAxis: {
        data: ["Mon", "Tues", "Wen", "Thur", "Fri", "Sat", "Sun"],
        boundaryGap:false
      },
      // y轴 设置
      yAxis: {
        
      },
      // 
      toolbox:{
        feature:{
          saveAsImage:{
            name:"近一周订单数量"
          }
        }
      },
      // 数据
      series: [
        {
          name: "近一周订单数量", //数据名称
          type: "line", //类型 表格类型
          data: [5, 20, 36, 10, 10, 20, 50]
        },
        // {
        //   name: "近一周出货数量", //数据名称
        //   type: "line", //类型 表格类型
        //   data: [50, 10, 16, 5, 13, 10, 30]
        // }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  }
};
</script>
<style lang="less">
.index_bg {
  .grid-content {
    border: 1px solid #ccc;
    height: 120px;
    .content_item {
      text-align: center;
    }
  }
}
</style>
