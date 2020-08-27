<template>
  <div class="app-container">
   <el-form :inline="true" :model="queryform" ref="queryForm" class="demo-form-inline">
      <el-form-item label>
        <el-button size="small" @click="handleShowAddClick" icon="el-icon-plus">添加</el-button>
      </el-form-item>

      <el-form-item  prop="parentId"  label>
        <el-select size="small" v-model="queryform.parentId" placeholder="请选择状态">
        <el-option label="请选择" value></el-option>
          <el-option label="启用" value="0"></el-option>
          <el-option label="停用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item  prop="name" label>
        <el-input
          size="small"
          placeholder="用户名/姓名/手机号"
          style="width:500px;" 
          v-model="queryform.name"
          class="input-with-select"
        />
      </el-form-item>
      <el-form-item label>
        <el-button size="small" @click="onSearch" icon="el-icon-search">查询</el-button>
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
          <el-tag v-if="scope.row.enable == 1" type="success">启用</el-tag>
          <el-tag v-if="scope.row.enable == 0" type="info">停用</el-tag> 
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center">
      </el-table-column>
      <el-table-column align="center" fixed="right" prop="created_at" label="操作" width="200">
        <template slot-scope="scope"> 
          <el-button @click="handleResetPwdClick(scope.row)" type="text" size="small">重置密码</el-button>
          <el-button @click="handleEditClick(scope.row)" type="text" size="small">编辑</el-button>
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
        :page-sizes="pageSizes"
        :page-size="size"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog :title="dialogFormTitle" width="30%" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="form">
        <el-form-item label="账号" :label-width="formLabelWidth">
          <el-input  v-model="form.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="this.form.id == null" label="密码" :label-width="formLabelWidth">
          <el-input  type="password" v-model="form.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名称" :label-width="formLabelWidth">
          <el-input  v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input  v-model="form.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门" :label-width="formLabelWidth">
          <el-select v-model="form.deptId" auto-complete="off">
            <el-option label="请选择" value></el-option>
            <el-option
              v-for="item in deptList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="form.roleList" multiple  auto-complete="off">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="启用" :label-width="formLabelWidth">
            <el-switch v-model="form.enable"  :active-value="1" :inactive-value="0"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSubmit">确 定</el-button>
      </div>
    </el-dialog>



    <el-dialog title="重置密码" width="30%" :visible.sync="dialogResetPwdVisible" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="form">
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input  type="password" v-model="form.password" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogResetPwdVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleResetPwdSubmit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>




<script>
import { listUser,getUserById,addUser,updateUser,deleteUser,updateUserPwd,listDept,listRole } from "@/api/apis";
import { defaultSize,defaultPageSizes  } from "@/settings";

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
      dialogResetPwdVisible: false,
      dialogFormTitle:"用户",
      formLabelWidth:"80px",
      form: {  },
      page: 1,
      size: defaultSize,
      total: 0,
      pageSizes: defaultPageSizes,
      rows: [],
      deptList:[],
      listLoading: true,
      queryform: {
        name: "",
        status: "",
      },
    };
  },
  created() {
    listDept().then((resp)=>{
      this.deptList = resp.data.rows
    })
    listRole().then((resp)=>{
      this.roleList = resp.data.rows
    })

    
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
    handleShowAddClick(){
      this.form = {
        "username":"",
        "password":null,
        "name":"",
        "phone":"",
        "icon":"https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80",
        "deptId":"",
        "deptName":"",
        "enable":1,
        "roleList":[]
        };
      this.dialogFormVisible = !this.dialogFormVisible;
    }, 
    handleEditClick(row) {
      this.form = row;
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    handleResetPwdClick(row){
      this.form = row;
      this.dialogResetPwdVisible = !this.dialogResetPwdVisible;
    },
    handleResetPwdSubmit(){
      updateUserPwd({userId:this.form.id,newPassword:this.form.password}).then((resp)=>{
         this.$message({ type: "success", message: "修改成功!" });
      })
    },
    handleDeleteClick(row) {
       this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'  }).then(() => {
          deleteUser(row.id).then(() => {
            this.$message({ type: "success", message: "删除成功!" });
            this.onSearch();
          });
        }) ; 
    },
    handleEditSubmit() { 
       if(this.form.id == null ){
          addUser(this.form).then((resp)=>{
              this.$message({
                type: 'success',
                message: '添加成功!'
              });
              this.dialogFormVisible = false
              this.onSearch();
          })
       }else{
          updateUser(this.form).then((resp)=>{
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
              this.dialogFormVisible = false
              this.onSearch();
          })
       }
    },
  },
};
</script>
