<template>
  <div class="app-container">

    <el-form :inline="true" :model="queryform" class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="queryform.name" placeholder="用户名/姓名/手机号"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryform.status" placeholder="状态">
          <el-option label="请选择" value=""></el-option>
          <el-option label="启用" value="0"></el-option>
          <el-option label="停用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="rows"
      size=mini
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="35">
        <template slot-scope="scope">
          <!-- {{ scope.$index }} -->
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="性名">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="用户名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column label="头像" width="110" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.icon " class="user-avatar" style="width:30px;">
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="启用" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.enable | statusFilter">{{ scope.row.enable }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
          <a>查看</a>
      </el-table-column>
    </el-table>
      <div style="display: flex; flex-direction: row-reverse; padding: 15px;">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          prev-text="上一页"
          next-text="下一页"
          total-text="总条数"
           @size-change="handleSizeChange"
           @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="size"
          :total="total">
        </el-pagination>
      </div>
  </div>
</template>

<script>
import { listUser } from '@/api/apis'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      page:1,
      size:5,
      total:10,
      rows:[], 
      listLoading: true,
      queryform:{
        name:"",
        status:""
      }
    }
  },
  created() {
    this.handleCurrentChange(1)
  },
  methods: {
    handleCurrentChange(p) {
      console.log(`当前页: ${p}`);
      this.listLoading = true
      listUser({page:p,size:this.size}).then(response => {
        this.rows = response.data.rows
        this.page = p
        this.total = response.data.total 
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.size = val
        this.handleCurrentChange(this.page)
    },
    onSearch() {  
        this.handleCurrentChange(this.page)
    },
 
  }
}
</script>
