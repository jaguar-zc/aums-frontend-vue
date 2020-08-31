<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryform" ref="queryForm" class="demo-form-inline">
      <el-form-item label="">
         <el-button  size="small"  @click="handleShowAddClick"  icon="el-icon-plus">添加</el-button>
      </el-form-item>
      <el-form-item prop="name" label>
        <el-input v-model="queryform.name" size="small" style="width:500px;"  placeholder="输入名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-search" @click="onSearch">查询</el-button> 
         <el-button size="small" @click="$refs.queryForm.resetFields()" icon="el-icon-refresh">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="listLoading"
      :data="rows"
      size="mini"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="35">
        <template slot-scope="scope">
        {{ ((page-1) * size) + (scope.$index + 1) }}
        </template>
      </el-table-column> 
      <el-table-column label="应用ID"  width="250">
        <template slot-scope="scope">{{ scope.row.appId }}</template>
      </el-table-column>
      <el-table-column label="名称" width="250">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="应用密钥" width="250">
        <template slot-scope="scope">
          <i class="el-icon-edit"></i>
          {{ scope.row.secret }}
          
          </template>
      </el-table-column>
         <el-table-column label >
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="scope.row.appId != 1" @click="handleShowEditClick(scope.row)" type="text"  >编辑</el-button>
          <el-button v-if="scope.row.appId != 1" @click="handleDeleteClick(scope.row)" type="text" style="color:red;" >删除</el-button>
        </template>
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
        :page-sizes="pageSizes"
        :page-size="size"
        :total="total"
      ></el-pagination>
    </div>

     <el-dialog :title="dialogFormTitle" width="25%" :visible.sync="dialogFormVisible"  :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="form">
        <el-form-item v-if="isAdd" label="应用ID" :label-width="formLabelWidth">
          <el-input  v-model="form.appId" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input  v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="密钥" :label-width="formLabelWidth">
          <el-input  v-model="form.secret" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>




<script>
import { listApp,addApp,updateApp,deleteApp } from "@/api/apis";
import { defaultSize,defaultPageSizes  } from "@/settings";
export default {
  filters: { 
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogFormTitle: "编辑",
      formLabelWidth: "80px",
      isAdd:false,
      form: {
      // "id":"5",
      // "name":"UED部门",
      // "remark":"UED部。。",
      // "createTime":"2020-08-24 11:14:18",
      // "createUser":"admin"
      },
      page: 1,
      size: defaultSize,
      pageSizes: defaultPageSizes,      
      total: 0,
      rows: [],
      listLoading: true,
      queryform: {
        name: "",
        status: "",
      },
    };
  },
  created() {
    this.handleCurrentChange(1);
  },
  methods: {
    handleCurrentChange(p) {
      console.log(`当前页: ${p}`);
      this.listLoading = true;
      listApp({ page: p, size: this.size }).then((response) => {
        this.rows = response.data.rows;
        this.page = p;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.size = val;
      this.handleCurrentChange(this.page);
    },
    onSearch() {
      this.handleCurrentChange(this.page);
    },
    handleShowEditClick(row) {
      this.isAdd = false;
      console.log(row);
      this.form = row;
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    handleShowAddClick(){
      this.isAdd = true;
      this.dialogFormVisible = true;
      this.form = {
        "id":null,
        "name":"", 
        "remark":""
      }
    },
    handleDeleteClick(row) {
       this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
       .then(() => {
          deleteApp(row.appId).then(()=>{
            this.$message({ type: 'success', message: '删除成功!' });
            this.onSearch()
          })
        })
    },
    handleEditSubmit() { 
      if(this.isAdd){
        addApp(this.form).then(()=>{
            this.dialogFormVisible = false
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
            this.onSearch()
        })
      }else{
        updateApp(this.form).then(()=>{
            this.dialogFormVisible = false
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
        })
      }
    }
  }
};
</script>
