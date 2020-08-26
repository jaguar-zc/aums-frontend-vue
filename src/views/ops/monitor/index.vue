<template>
  <div class="app-container">
     <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>JVM参数监控</span>
    <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
  </div>
  <div v-for="(v,name) in form" :key="v" class="text item">
    {{name+"："+ v }}
  </div>
</el-card>
  </div>
</template>


<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>

<script>
import { jvmMonitor } from "@/api/apis";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "success",
        0: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return { 
      form: {}, 
    };
  },
  created() {
    this.load()
  },
  methods: {  
    load(){
      jvmMonitor().then((response) =>{
        this.form = response.data
        console.log(this.form)
      })
    } 
  },
};
</script>
