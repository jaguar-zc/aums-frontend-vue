<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryform" ref="queryForm" class="demo-form-inline">
      <el-form-item label>
        <el-button disabled size="small" @click="handleShowAddClick" icon="el-icon-plus">添加</el-button>
      </el-form-item>
      <el-form-item prop="name" label>
        <el-input
          size="small"
          disabled=""
          placeholder="请输入资源名称"
          style="width:500px;"
          v-model="queryform.name"
          class="input-with-select"
        />
      </el-form-item>
    </el-form>

    <el-tree
    :data="rows"
      ref="tree2"
      style="width:40%;"
      :props="defaultProps" 
      node-key="id"
      :load="loadData"
      lazy
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :render-content="renderContent"
    ></el-tree>

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
            <el-radio label="GROUP">分组</el-radio>
            <el-radio label="MODULE">模块</el-radio>
            <el-radio label="BUTTON">操作</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="上级菜单" :label-width="formLabelWidth">
          <el-select v-model="form.parentId" auto-complete="off">
            <el-option label="请选择" value></el-option>
            <el-option
              v-for="item in parentRows"
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
          <el-input-number v-model="form.sort" :min="1" :max="100"></el-input-number>
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
.el-table__expanded-cell[class*="cell"] {
  padding: 0px 0px 0px 47px;
}
.class-hide {
visibility:hidden;
}
</style>

<script>
import {
  listResourceLazy,
  addResource,
  updateResource,
  deleteResource,
} from "@/api/apis";
import { defaultSize, defaultPageSizes } from "@/settings";
export default {
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    },
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogFormTitle: "资源",
      formLabelWidth: "80px",
      formEnable: false,
      form: {},
      rows: [],
      parentRows: [],
      defaultProps: {
        children: "childList",
        label: "name",
        isLeaf: "leaf",
      },
      listLoading: true,
      queryform: {
        appId: "",
        name: "",
      },
    };
  },
  created() {
     listResourceLazy().then((response) => {
        this.rows = response.data;
      });
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
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
    loadData(node, resolve) {
      listResourceLazy({parentId:node.data.id}).then((response) => {
         resolve(response.data);
      });
    },
    handleShowEditClick(node,row) {
      this.form = row;
      this.formEnable = row.enable == 1 ? true : false;
      this.parentRows = [{ id: node.parent.data.id, name: node.parent.data.name }];
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    handleShowAddClick(data) {
      this.dialogFormVisible = true;
      this.parentRows = [{ id: data.id, name: data.name }];
      let type = "MODULE";
      if (data.type === "APP") {
        type = "MODULE";
      }
      if (data.type === "MODULE") {
        type = "BUTTON";
      }

      this.form = {
        id: null,
        remark: "",
        parentId: data.id,
        type: type,
        uri: null,
        enable: 1,
        code: "",
        name: "",
        icon: "",
        sort: 1,
        childList: null,
      };
      this.formEnable = true;
    },
    handleDeleteClick(node, row) {
      this.$confirm("此操作将永久删除该资源, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteResource(row.id).then(() => {
          this.$message({ type: "success", message: "删除成功!" });
          const parent = node.parent;
          const children = parent.data.children || parent.data;
          const index = children.findIndex((d) => d.id === data.id);
          children.splice(index, 1);
        });
      });
    },

    handleEditSubmit() {
      this.form.enable = this.formEnable ? 1 : 0;
      this.form.appId = this.queryform.appId;
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

    renderContent(h, { node, data, store }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>
              {this.moduleType(data.type)} - {node.label}
            </span>
          </span>
          <span>
            <el-button style="font-size: 12px;" class={data.type=='BUTTON'?'class-hide':''}  type="text" on-click={() => this.handleShowAddClick(data)}>添加</el-button>
            <el-button style="font-size: 12px;" type="text" on-click={() => this.handleShowEditClick(node,data)}>编辑</el-button> 
            <el-button style="font-size: 12px;color:red;" class={data.leaf?'':'class-hide'} type="text" on-click={() => this.handleDeleteClick(node, data)}>删除</el-button>
          </span>
        </span>
      );
    },
  },
};
</script>
