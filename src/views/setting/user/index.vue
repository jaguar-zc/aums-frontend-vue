<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryform" class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="queryform.name" placeholder="用户名/姓名/手机号"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="queryform.status" placeholder="状态">
          <el-option label="请选择" value></el-option>
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
      size="mini"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="35">
        <template slot-scope="scope">
        {{ ((page-1) * size) + (scope.$index + 1) }}
          <!-- {{ scope.row.id }} -->
        </template>
      </el-table-column>
      <el-table-column label="账号"  width="110">
        <template slot-scope="scope">{{ scope.row.username }}</template>
      </el-table-column>
      <el-table-column label="名称"  width="110">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
     <el-table-column label="手机号" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
     <el-table-column label="部门" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.deptName }}</template>
      </el-table-column>
      
      <el-table-column label="头像"  align="center">
        <template slot-scope="scope">
          <img :src="scope.row.icon " class="user-avatar" style="width:30px;" />
        </template>
      </el-table-column>
 
      <el-table-column class-name="status-col" label="启用" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.enable | statusFilter">{{ scope.row.enable }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center">
      </el-table-column>
      <el-table-column align="center" fixed="right" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="handleEditClick(scope.row)" type="text" size="small">查看</el-button>
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
        <el-form-item label="账号" :label-width="formLabelWidth">
          <el-input disabled v-model="form.username" auto-complete="off"></el-input>
        </el-form-item>
     
        <el-form-item label="用户名称" :label-width="formLabelWidth">
          <el-input disabled v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input disabled v-model="form.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门" :label-width="formLabelWidth">
          <el-input disabled v-model="form.deptName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select disabled v-model="form.enable" placeholder="请选择状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
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
import { listUser,getUserById,addUser,updateUserPwd } from "@/api/apis";

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
      dialogFormTitle:"用户编辑",
      formLabelWidth:"120px",
      form: {
        // "id":"5",
        // "username":"admin5",
        // "password":null,
        // "name":"管理员5",
        // "phone":"18981063284",
        // "icon":"http://47.110.10.117:9000/oss/851827a0-58f9-4258-a9a8-d8e423f791b0.jpg",
        // "deptId":"1",
        // "deptName":"研发部",
        // "enable":1,
        // "roleList":[]
      },
      page: 1,
      size: 5,
      total: 10,
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
      listUser({ page: p, size: this.size }).then((response) => {
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
    handleEditClick(row) {
      this.form = row;
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    handleDeleteClick(row) {
       this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }) ;
      // this.form = row;
      // this.dialogFormVisible = !this.dialogFormVisible;
    },
    handleEditSubmit() { 
      this.dialogFormVisible = false
      this.$message({
            type: 'success',
            message: '保存成功!'
          });
    },
  },
};
</script>
