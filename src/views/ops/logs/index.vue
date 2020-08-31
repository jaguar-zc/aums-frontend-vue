<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryform" ref="queryForm" class="demo-form-inline">
      <el-form-item label>
        <el-button size="small" @click="handleShowAddClick" icon="el-icon-plus" disabled>添加</el-button>
      </el-form-item>
      <el-form-item prop="logsType" label>
        <el-select size="small" v-model="queryform.logsType" placeholder="日志类型">
          <el-option label="请选择" value></el-option>
          <el-option label="正常日志" value="1"></el-option>
          <el-option label="异常日志" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="url" label>
        <el-input
          size="small"
          placeholder="请输入资源地址"
          style="width:500px;"
          v-model="queryform.url"
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
      <el-table-column label="模块" width="50">
        <template slot-scope="scope">{{ scope.row.operModule }}</template>
      </el-table-column>
      <el-table-column label="响应类型" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.logsType == 1" type="success">正常响应</el-tag>
          <el-tag v-if="scope.row.logsType == 2" type="danger">异常响应</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="执行方法">
        <template slot-scope="scope">{{ scope.row.operMethod }}</template>
      </el-table-column>
      <el-table-column label="接口地址" width="150">
        <template slot-scope="scope">{{ scope.row.operUri }}</template>
      </el-table-column>
      <el-table-column label="IP地址" width="115">
        <template slot-scope="scope">{{ scope.row.operIp }}</template>
      </el-table-column>
      <el-table-column label="请求参数" width="80">
        <template slot-scope="scope">
          <el-popover
            ref="popover1"
            placement="top-start"
            width="200"
            trigger="hover"
            :content="scope.row.operReqParam"
          ></el-popover>
          <el-button type="text" v-popover:popover1>查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="响应参数" width="80">
        <template slot-scope="scope">
          <el-popover
            ref="popover2"
            placement="top-start"
            width="200"
            trigger="hover"
            :content="scope.row.operRespParam"
          ></el-popover>
          <el-button type="text" v-popover:popover2>查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作类型" width="80">
        <template slot-scope="scope">{{ scope.row.operType }}</template>
      </el-table-column>
      <el-table-column label="操作描述" width="150">
        <template slot-scope="scope">{{ scope.row.operDesc }}</template>
      </el-table-column>

      <el-table-column label="创建人" width="80">
        <template slot-scope="scope">{{ scope.row.operUserName }}</template>
      </el-table-column>
      <el-table-column label="创建时间" width="150" align="left">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="handleShowEditClick(scope.row)" type="text"  >查看</el-button>
          <!-- <el-button @click="handleDeleteClick(scope.row)" type="text" size="small">删除</el-button> -->
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

    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible"  :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form class="dialog-from" :model="form">
        <el-form-item label="响应类型" :label-width="formLabelWidth">
          <el-tag v-if="form.logsType == 1" type="success">正常响应</el-tag>
          <el-tag v-if="form.logsType == 2" type="danger">异常响应</el-tag>
        </el-form-item>
        <el-form-item label="模块" :label-width="formLabelWidth">{{form.operModule}}</el-form-item>
        <el-form-item label="接口地址" :label-width="formLabelWidth">{{form.operUri}}</el-form-item>
        <el-form-item label="执行方法" :label-width="formLabelWidth">{{form.operMethod}}</el-form-item>
        <el-form-item label="操作类型" :label-width="formLabelWidth">{{form.operType}}</el-form-item>
        <el-form-item label="操作描述" :label-width="formLabelWidth">{{form.operDesc}}</el-form-item>
        <el-form-item label="创建人" :label-width="formLabelWidth">{{form.operUserName}}</el-form-item>
        <el-form-item label="创建时间" :label-width="formLabelWidth">{{form.createTime}}</el-form-item>
        <el-form-item label="IP地址" :label-width="formLabelWidth">{{form.operIp}}</el-form-item>
        <el-form-item label="请求参数" :label-width="formLabelWidth">{{form.operReqParam}}</el-form-item>
        <el-form-item label="响应参数" :label-width="formLabelWidth">{{form.operRespParam}}</el-form-item>
        <el-form-item label="异常信息" :label-width="formLabelWidth">{{form.throwable}}</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<style scoped>

.dialog-from {
  height: 500px;
  overflow-y: scroll;
}
.el-form-item {
    margin-bottom: 1px;
}
</style>
 

<script>
import { listLogs } from "@/api/apis";
import { defaultSize,defaultPageSizes } from "@/settings";
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
      dialogFormTitle: "查看",
      formLabelWidth: "80px",
      form: {},
      page: 1,
      size: defaultSize,
      pageSizes: defaultPageSizes,
      total: 10,
      rows: [],
      listLoading: true,
      IS_ADD: true,
      queryform: {
        logsType: "",
        url: "",
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
      listLogs({
        page: p,
        size: this.size,
        logsType: this.queryform.logsType,
        url: this.queryform.url,
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
      this.dialogFormVisible = !this.dialogFormVisible;
    },
  },
};
</script>
