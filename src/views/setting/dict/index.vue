<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryform" class="demo-form-inline">
      <el-form-item label>
        <el-button size="small" @click="handleShowAddClick" icon="el-icon-plus">添加</el-button>
      </el-form-item>
      <el-form-item label="——">
        <el-input v-model="queryform.name" size="small" placeholder="输入名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-search" @click="onSearch">查询</el-button>
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
        <template slot-scope="scope">{{ ((page-1) * size) + (scope.$index + 1) }}</template>
      </el-table-column>
      <el-table-column label="编码" width="200">
        <template slot-scope="scope">{{ scope.row.dataCode }}</template>
      </el-table-column>
      <el-table-column label="值" width="250">
        <template slot-scope="scope">{{ scope.row.dataValue }}</template>
      </el-table-column>
      <el-table-column label="描述" align="left">
        <template slot-scope="scope">{{ scope.row.dataDesc }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="handleShowEditClick(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="handleDeleteClick(scope.row)" type="text" size="small">删除</el-button>
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
        :page-sizes="[5, 10, 15, 20]"
        :page-size="size"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="编码" :label-width="formLabelWidth">
          <el-input v-model="form.dataCode" auto-complete="off" v-if="IS_ADD == true" ></el-input>
          <el-input v-model="form.dataCode" auto-complete="off" v-if="IS_ADD == false" disabled></el-input>
        </el-form-item>
        <el-form-item label="值" :label-width="formLabelWidth">
          <el-input v-model="form.dataValue" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.dataDesc" auto-complete="off"></el-input>
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
import { listDict, addDict, updateDict, deleteDict } from "@/api/apis";

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
      dialogFormVisible: false,
      dialogFormTitle: "编辑",
      formLabelWidth: "120px",
      form: {   },
      page: 1,
      size: 5,
      total: 10,
      rows: [],
      listLoading: true,
      IS_ADD: true,
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
      listDict({ page: p, size: this.size }).then((response) => {
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
      this.form = row;
      this.IS_ADD = false;
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    handleShowAddClick(){
      this.dialogFormVisible = true;
      this.IS_ADD = true;
      this.form = {
        "dataCode":null,
        "dataValue":"", 
        "dataDesc":""
      }
    },
    handleDeleteClick(row) {
       this.$confirm('此操作将永久删除, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
       .then(() => {
          deleteDict(row.dataCode).then(()=>{
            this.$message({ type: 'success', message: '删除成功!' });
            this.onSearch()
          })
        })
    },
    handleEditSubmit() {  
      console.log(this.IS_ADD)
      if(this.IS_ADD == true){
        addDict(this.form).then(()=>{
            this.dialogFormVisible = false
            this.$message({ type: 'success', message: '保存成功!'  });
            this.onSearch()
        })
      }else{
        updateDict(this.form).then(()=>{
            this.dialogFormVisible = false
            this.$message({ type: 'success', message: '保存成功!'  });
        })
      }
    }
  },
};
</script>
