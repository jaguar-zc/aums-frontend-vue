<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryform" ref="queryForm" class="demo-form-inline">
      <el-form-item label>
        <el-button size="small" @click="handleShowAddClick" icon="el-icon-plus">添加</el-button>
      </el-form-item>

      <el-form-item prop="parentId" label>
        <el-select size="small" v-model="queryform.parentId" placeholder="请选择">
          <el-option
            v-for="item in rootResource"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="name" label>
        <el-input
          size="small"
          placeholder="请输入资源名称"
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
        <template slot-scope="scope">{{ ((page-1) * size) + (scope.$index + 1) }}</template>
      </el-table-column>
      <el-table-column label="名称" width="110">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="编码" width="110">
        <template slot-scope="scope">{{ scope.row.code }}</template>
      </el-table-column>
      <el-table-column label="上级菜单" width="110">
        <template slot-scope="scope">{{ scope.row.parentName }}</template>
      </el-table-column>

      <el-table-column label="类型" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.type | moduleType }}</template>
      </el-table-column>
      <el-table-column label="地址" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.uri }}</template>
      </el-table-column>
      <el-table-column label="图标" width="110" align="center">
        <template slot-scope="scope">{{scope.row.icon}}</template>
      </el-table-column>
      <el-table-column label="排序" width="50" align="center">
        <template slot-scope="scope">{{scope.row.sort}}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="启用" width="110" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enable == 1 " type="success">启用</el-tag>
          <el-tag v-if="scope.row.enable == 0 " type="warning">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="left">
        <template slot-scope="scope">{{ scope.row.remark }}</template>
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
        :page-sizes="pageSizes"
        :page-size="size"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog :title="dialogFormTitle" width="30%" :visible.sync="dialogFormVisible"  :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="form">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="编码" :label-width="formLabelWidth">
          <el-input v-model="form.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" :label-width="formLabelWidth">
          <el-select v-model="form.parentId" auto-complete="off">
            <el-option label="请选择" value></el-option>
            <el-option
              v-for="item in rootResource"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option label="应用" value="APP"></el-option>
            <el-option label="分组" value="GROUP"></el-option>
            <el-option label="模块" value="MODULE"></el-option>
            <el-option label="操作" value="BUTTON"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="form.uri" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="图标" :label-width="formLabelWidth">
          <el-input v-model="form.icon" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model="form.sort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="启用" :label-width="formLabelWidth">
          <el-switch v-model="formEnable"/>
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
import {
  listResource,
  addResource,
  updateResource,
  deleteResource,
  getResourceMenu,
} from "@/api/apis";
import { defaultSize,defaultPageSizes  } from "@/settings";
export default {
  filters: {
    moduleType(status) {
      const e = {
        APP: "应用",
        GROUP: "分组",
        MODULE: "模块",
        BUTTON: "操作",
        deleted: "",
      };
      return e[status];
    },
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogFormTitle: "编辑",
      formLabelWidth: "80px",
      formEnable: false,
      form: {
        // "id":"1",
        // "remark":"首页",
        // parentId: null,
        // "parentName":null,
        // "type":"MODULE",
        // "uri":null,
        // "enable":1,
        // "code":"HOME",
        // "name":"工作台",
        // "icon":"dashboard",
        // "childList":null,
      },
      page: 1,
      size: defaultSize,
      pageSizes: defaultPageSizes,
      total: 0,
      rows: [],
      listLoading: true,
      queryform: {
        parentId: "",
        name: "",
      },
      rootResource: [],
    };
  },
  created() {
    this.handleCurrentChange(1);
    getResourceMenu({ menuType: "ALL" }).then((response) => {
      const { data } = response;
      for (let i in data) {
        this.rootResource.push({
          id: data[i].id,
          name: data[i].title,
        });
      }
    });
  },
  methods: {
    handleCurrentChange(p) {
      console.log(`当前页: ${p}`);
      this.listLoading = true;

      listResource({
        page: p,
        size: this.size,
        parentId: this.queryform.parentId,
        name: this.queryform.name,
      }).then((response) => {
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
      this.formEnable = row.enable == 1?true:false
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    handleShowAddClick() {
      this.dialogFormVisible = true;
      this.form = {
        id: null,
        remark: "",
        parentId: null,
        type: "MODULE",
        uri: null,
        enable: 1,
        code: "",
        name: "",
        icon: "",
        childList: null,
      };
    },
    handleDeleteClick(row) {
      this.$confirm("此操作将永久删除该资源, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteResource(row.id).then(() => {
          this.$message({ type: "success", message: "删除成功!" });
          this.onSearch();
        });
      });
    },
    handleEditSubmit() {
      this.form.enable = this.formEnable?1:0
      if (this.form.id == null) {
        addResource(this.form).then(() => {
          this.dialogFormVisible = false;
          this.$message({
            type: "success",
            message: "保存成功!",
          });
          this.onSearch();
        });
      } else {
        updateResource(this.form).then(() => {
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
