<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryform" ref="queryForm" class="demo-form-inline">
      <el-form-item label>
        <el-button size="small" @click="handleShowAddClick" icon="el-icon-plus">添加</el-button>
      </el-form-item>

      <el-form-item prop="appId" label="应用名称">
        <el-select size="small" v-model="queryform.appId" placeholder="请选择">
          <el-option
            v-for="item in listApp"
            :key="item.appId"
            :label="item.name"
            :value="item.appId"
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
      <el-table-column type="expand"  label>
        <template slot-scope="prop" >
          <el-table
            :data="prop.row.childList"
            size="mini"
            border
            fit
            highlight-current-row
            :show-header="false"
            style="width: 100%;padding:0px"
          >
            <el-table-column prop="name" label="名称" width="110"></el-table-column>
            <el-table-column prop="code" label="编码" width="110"></el-table-column> 
            <el-table-column prop="resourceLevel" label="级别" width="50" align="center"></el-table-column>
            <el-table-column label="类型" width="110" align="center">
              <template slot-scope="props">{{ props.row.type | moduleType }}</template>
            </el-table-column>
            <el-table-column label="地址" width="110" align="center">
              <template slot-scope="props">{{ props.row.uri }}</template>
            </el-table-column>
            <el-table-column label="图标" width="110" align="center">
              <template slot-scope="props">{{props.row.icon}}</template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" align="center" width="50"></el-table-column>
            <el-table-column class-name="status-col" label="启用" width="80" align="center">
              <template slot-scope="props">
                <el-tag v-if="props.row.enable == 1 "  size="small" type="success">启用</el-tag>
                <el-tag v-if="props.row.enable == 0 "  size="small" type="warning">停用</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="描述" align="left">
              <template slot-scope="props">{{ props.row.remark }}</template>
            </el-table-column>

            <el-table-column align="center" prop="created_at" label="操作" width="200">
              <template slot-scope="props">
                <el-button @click="handleShowEditClick(props.row)" type="text" >编辑</el-button>
                <el-button @click="handleDeleteClick(props.row)" type="text" style="color:red;" >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="110">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="编码" width="110">
        <template slot-scope="scope">{{ scope.row.code }}</template>
      </el-table-column>
      <el-table-column label="级别" width="50" align="center">
        <template slot-scope="scope">{{ scope.row.resourceLevel }}</template>
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
      <el-table-column class-name="status-col" label="启用" width="80" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.enable == 1 "  size="small" type="success">启用</el-tag>
          <el-tag v-if="scope.row.enable == 0 "  size="small" type="warning">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="left">
        <template slot-scope="scope">{{ scope.row.remark }}</template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="handleShowEditClick(scope.row)" type="text" >编辑</el-button>
          <el-button @click="handleDeleteClick(scope.row)" type="text" style="color:red;"  >删除</el-button>
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
      :title="dialogFormTitle"
      width="30%"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="form">
       <el-form-item label="资源类型" :label-width="formLabelWidth">
           <el-radio-group v-model="form.type">
            <el-radio disabled label="APP">应用</el-radio>
            <el-radio  label="GROUP">分组</el-radio>
            <el-radio  label="MODULE">模块</el-radio>
            <el-radio  label="BUTTON">操作</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="上级菜单" :label-width="formLabelWidth">
          <el-select v-model="form.parentId" auto-complete="off">
            <el-option label="请选择" value></el-option>
            <el-option
              v-for="item in rows"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="编码" :label-width="formLabelWidth">
          <el-input v-model="form.code" auto-complete="off"></el-input>
        </el-form-item>
      
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="form.uri" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="图标" :label-width="formLabelWidth">
          <el-input v-model="form.icon" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input-number v-model="form.sort"   :min="1" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="启用" :label-width="formLabelWidth">
          <el-switch v-model="formEnable" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<style>
.el-table__expanded-cell[class*=cell] {
    padding: 0px 0px 0px 47px;
}
</style>

<script>
import {
  listResource,
  addResource,
  updateResource,
  deleteResource,
  listApp,
} from "@/api/apis";
import { defaultSize, defaultPageSizes } from "@/settings";
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
      dialogFormTitle: "资源",
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
        appId: "",
        name: "",
      }, 
      listApp: [],
    };
  },
  created() {
    listApp({ page: 1, size: 100 }).then((resp) => {
      this.listApp = resp.data.rows;
      this.queryform.appId = this.listApp[0].appId;
      this.handleCurrentChange(1);
    });
  },
  methods: {
    handleCurrentChange(p) {
      console.log(`当前页: ${p}`);
      this.listLoading = true;

      listResource({
        page: p,
        size: this.size,
        appId: this.queryform.appId,
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
      this.formEnable = row.enable == 1 ? true : false;
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
      this.form.enable = this.formEnable ? 1 : 0;
      this.form.appId = this.queryform.appId
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
