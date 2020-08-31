<template>
  <div class="app-container">
    <el-row>
      <el-col :span="10">
        <div>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label>
              <el-button size="small" @click="handleShowAddClick" icon="el-icon-plus">添加字典类型</el-button>
            </el-form-item>
          </el-form>

          <el-table
            v-loading="listLoading"
            :data="rows"
            size="mini"
             height="400"
            element-loading-text="Loading" 
            border
            fit
            highlight-current-row
          >
            <el-table-column align="center" label="ID" width="35">
              <template slot-scope="scope">{{ ((page-1) * size) + (scope.$index + 1) }}</template>
            </el-table-column>
            <el-table-column label="应用">
              <template slot-scope="scope">{{ scope.row.appId | appFilter }}</template>
            </el-table-column>
            <el-table-column label="类型名称">
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column label="描述" align="left">
              <template slot-scope="scope">{{ scope.row.desc }}</template>
            </el-table-column>
            <el-table-column align="center" prop="created_at" label="操作">
              <template slot-scope="scope">
                <el-button @click="handleSelectClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button @click="handleShowValueAddClick(scope.row)" type="text" size="small">添加</el-button> 
                <el-button @click="handleDeleteClick(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex; flex-direction: row-reverse; padding: 15px;">
            <el-pagination
              background
              layout=" prev, pager, next"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="pageSizes"
              :page-size="size"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </el-col>
      <el-col :span="13" :offset="1">
        <div>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label>
              <el-button size="small" @click="handleShowValueAddClick" icon="el-icon-plus">{{selectedTypeName+" - "}}添加字典值</el-button>
            </el-form-item>
          </el-form>

          <el-table
            v-loading="listRightLoading"
            :data="rightRows"
            height="400"
            size="mini"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
          >
            <el-table-column align="center" label="ID" width="35">
              <template slot-scope="scope">{{ ((page-1) * size) + (scope.$index + 1) }}</template>
            </el-table-column>
            <el-table-column label="编码" align="left">
              <template slot-scope="scope">{{ scope.row.dataCode }}</template>
            </el-table-column>
            <el-table-column label="名称">
              <template slot-scope="scope">{{ scope.row.dataValue }}</template>
            </el-table-column>

            <el-table-column align="center" prop="created_at" label="操作">
              <template slot-scope="scope">
                <el-button @click="handleRgihtDeleteClick(scope.row)" type="text" style="color:red;" >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      :title="dialogFormTitle"
      width="30%"
      :visible.sync="dialogTypeFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="form">
        <el-form-item label="应用" :label-width="formLabelWidth">
          <el-select size="small" v-model="form.appId" placeholder="请选择">
            <el-option
              v-for="item in listApp"
              :key="item.appId"
              :label="item.name"
              :value="item.appId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.desc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSubmit">确 定</el-button>
      </div>
    </el-dialog>




   <el-dialog
      title="添加字典值"
      width="30%"
      :visible.sync="dialogValueFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="valueForm">
        <el-form-item label="字典类型" :label-width="formLabelWidth">
           <el-input disabled v-model="valueForm.dictTypeName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="编码" :label-width="formLabelWidth">
          <el-input v-model="valueForm.dataCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="valueForm.dataValue" auto-complete="off"></el-input>
        </el-form-item>
      
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogValueFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleValuesSubmit">确 定</el-button>
      </div>
    </el-dialog>



  </div>
</template>




<script>
import {
  listDictType,
  listDictValue,
  addDictType,
  addDictValue,
  updateDictType,
  deleteDictType,
  deleteDictValue,
  listApp,
} from "@/api/apis";
import { defaultSize, defaultPageSizes } from "@/settings";
var app0;
export default {
  filters: {
    appFilter(id) {
      for (let i in app0.listApp) {
        if (id === app0.listApp[i].appId) {
          return app0.listApp[i].name;
        }
      }
      return id;
    },
  },
  data() {
    return {
      dialogTypeFormVisible: false,
      dialogValueFormVisible: false,
      dialogFormTitle: "编辑",
      formLabelWidth: "80px",
      form: {},
      valueForm: {},
      page: 1,
      size: defaultSize,
      pageSizes: defaultPageSizes,
      total: 0,
      rows: [],
      rightRows: [],
      listLoading: true,
      listRightLoading: false,
      IS_ADD: true,
      queryform: {
        name: "",
        status: "",
      },
      listApp: [],
      selectedTypeName:''
    };
  },
  created() {
    this.handleCurrentChange(1);
  },
  beforeCreate: function () {
    app0 = this;
  },
  methods: {
    handleCurrentChange(p) {
      console.log(`当前页: ${p}`);
      this.listLoading = true;
      listApp({ page: 1, size: 100 }).then((resp) => {
        this.listApp = resp.data.rows;
      });
      let self = this
      listDictType({ page: p, size: this.size }).then((response) => {
        self.rows = response.data.rows;
        self.page = p;
        self.total = response.data.total;
        self.listLoading = false;
        if(self.rows.length >0){
          self.selectedTypeName = self.rows[0].name
          self.handleSelectClick(self.rows[0])
        }
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
      this.dialogTypeFormVisible = !this.dialogTypeFormVisible;
    },
    handleShowAddClick() {
      this.dialogTypeFormVisible = true;
      this.IS_ADD = true;
      this.form = {
        appId: null,
        name: "",
        desc: "",
      };
    },
    handleShowValueAddClick(row){
      this.dialogValueFormVisible = true; 
      this.valueForm = {
        dictTypeId: row.id,
        dictTypeName:row.name,
        dataCode: "",
        dataValue: "",
      };
    },
    handleDeleteClick(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteDictType(row.dataCode).then(() => {
          this.$message({ type: "success", message: "删除成功!" });
          this.onSearch();
        });
      });
    },
    handleRgihtDeleteClick(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteDictValue(row.id).then(() => {
          this.$message({ type: "success", message: "删除成功!" });
          this.handleSelectClick(row.dictTypeId)
        });
      });
    },
    handleEditSubmit() {
      console.log(this.IS_ADD);
      if (this.IS_ADD == true) {
        addDictType(this.form).then(() => {
          this.dialogTypeFormVisible = false;
          this.$message({ type: "success", message: "保存成功!" });
          this.onSearch();
        });
      } else {
        updateDictType(this.form).then(() => {
          this.dialogTypeFormVisible = false;
          this.$message({ type: "success", message: "保存成功!" });
        });
      }
    },
    handleSelectClick(row) {
      this.selectedTypeName = row.name
      listDictValue({ page: 1, size: 500, dictTypeId:row.id }).then((resp)=>{
        this.rightRows = resp.data.rows;
      }) 
    },
    handleValuesSubmit() {
      addDictValue(this.valueForm).then(() => {
        this.dialogValueFormVisible = false;
        this.$message({ type: "success", message: "保存成功!" });
        this.handleSelectClick(this.valueForm.dictTypeId)
      });
    }
  },
};
</script>
