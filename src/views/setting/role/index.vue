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
          <el-button @click="handleEditClick(scope.row)" type="text">编辑</el-button>
          <el-button @click="handleDeleteClick(scope.row)" type="text" style="color:red;">删除</el-button>
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
      <el-form :model="form" style="overflow-y: scroll;  max-height: 450px;">
        <el-tabs v-model="tabsActiveName"  >
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
                ref="treeRole"
                :highlight-current="true" 
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
  data() {
    return {
      dialogFormVisible: false,
      dialogFormTitle: "角色编辑",
      formLabelWidth: "80px",
      tabsActiveName: "first",
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
          let item1 = data[i];
          if (item1.selected == 1) {
            arr.push(item1.id);
          }
          if (item1.children != null) {
            for (let j in item1.children) {
              let item2 = item1.children[j];
              if (item2.selected == 1) {
                arr.push(item2.id);
              }
              if (item2.children != null) {
                for (let y in item2.children) {
                  let item3 = item2.children[y];
                  if (item3.selected == 1) {
                    arr.push(item3.id);
                  }
                }
              }
            }
          }
        } 
        this.$refs.treeRole.setCheckedKeys(arr);
      });
    },
    handleShowAddClick() {
      this.form = {
        id: null,
        name: "",
        code: "",
        remark: "",
        resourceList: [],
      };
      this.dialogFormVisible = true; 
      getResourceListByRoleId().then((resp) => {
        const { data } = resp;
        this.rootResource = data;
        let arr = new Array();
        for (let i in data) {
          let item1 = data[i];
          if (item1.selected == 1) {
            arr.push(item1.id);
          }
          if (item1.children != null) {
            for (let j in item1.children) {
              let item2 = item1.children[j];
              if (item2.selected == 1) {
                arr.push(item2.id);
              }
              if (item2.children != null) {
                for (let y in item2.children) {
                  let item3 = item2.children[y];
                  if (item3.selected == 1) {
                    arr.push(item3.id);
                  }
                }
              }
            }
          }
        }  
        this.$refs.treeRole.setCheckedKeys(arr);
      });
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
