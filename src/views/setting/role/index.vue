<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryform" ref="queryForm" class="demo-form-inline">
      <el-form-item label>
        <el-button size="small" @click="handleShowAddClick" icon="el-icon-plus">添加</el-button>
      </el-form-item>
      <el-form-item prop="name" label>
        <el-input v-model="queryform.name" size="small" style="width:500px;" placeholder="输入名称"></el-input>
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
        <template slot-scope="scope">{{ ((page-1) * size) + (scope.$index + 1) }}</template>
      </el-table-column>
      <el-table-column width="110" label="名称">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column width="110" label="编码">
        <template slot-scope="scope">{{ scope.row.code }}</template>
      </el-table-column>

      <el-table-column label="描述" align="center">
        <template slot-scope="scope">{{ scope.row.remark }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
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

    <el-dialog
      width="30%"
      :visible.sync="dialogFormVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="form">
        <el-tabs v-model="tabsActiveName" @tab-click="handleClick">
          <el-tab-pane label="角色信息" name="first">
            <el-form-item label="角色名称" :label-width="formLabelWidth">
              <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色编码" :label-width="formLabelWidth">
              <el-input v-model="form.code" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="描述" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="form.remark" auto-complete="off"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="权限资源" name="second">
            <el-form-item label="权限资源" :label-width="formLabelWidth">
              <el-tree
                :data="rootResource"
                show-checkbox
                node-key="id"
                ref="tree"
                :highlight-current="true"
                :default-expand-all="true"
                :props="defaultProps"
              ></el-tree>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  listRole,
  addRole,
  updateRole,
  deleteRole,
  getResourceListByRoleId,
} from "@/api/apis";
import { defaultSize, defaultPageSizes } from "@/settings";

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
      dialogFormTitle: "角色编辑",
      formLabelWidth: "80px",
      tabsActiveName: 'first',
      form: {
        // "id":"3",
        // "name":"部门经理",
        // "code":"dept_LOADER",
        // "remark":"部门经理的角色",
        // "resourceList":[]
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
      isIndeterminate: true,
      checkedCities: [],
      rootResource: [],
      defaultProps: {
        children: "children",
        label: "name",
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
      listRole({ page: p, size: this.size }).then((response) => {
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
      getResourceListByRoleId(row.id).then((resp) => {
        const { data } = resp;
        this.rootResource = data;
        let arr = new Array();
        for (let i in data) {
          if (data[i].selected == 1) {
            arr.push(data[i].id);
          }
          if (data[i].children != null) {
            for (let j in data.children) {
              if (data.children[i].selected == 1) {
                arr.push(data.children[i].id);
              }
            }
          }
        }
        this.$refs.tree.setCheckedKeys(arr);
      });
    },
    handleShowAddClick() {
      this.dialogFormVisible = true;
      this.form = {
        id: null,
        name: "",
        code: "",
        remark: "",
        resourceList: [],
      };
    },
    handleDeleteClick(row) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteRole(row.id).then(() => {
          this.$message({ type: "success", message: "删除成功!" });
          this.onSearch();
        });
      });
    },
    handleEditSubmit() {
      let arr = this.$refs.tree.getCheckedKeys();
      for (let i in arr) {
        this.form.resourceList.push({ id: arr[i] });
      }
      if (this.form.id == null) {
        addRole(this.form).then(() => {
          this.dialogFormVisible = false;
          this.$message({
            type: "success",
            message: "保存成功!",
          });
          this.onSearch();
        });
      } else {
        updateRole(this.form).then(() => {
          this.dialogFormVisible = false;
          this.$message({
            type: "success",
            message: "保存成功!",
          });
        });
      }
    },
  },
};
</script>
