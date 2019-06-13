<template>
  <div class="common_content">
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      stripe
      :show-overflow-tooltip="true"
      class="content_table"
    >
      <el-table-column align="center" prop="ID" label="ID" width="150"></el-table-column>
      <el-table-column align="center" prop="Name" label="Name" min-width="100"></el-table-column>
      <el-table-column align="center" prop="Area" label="Area" min-width="100"></el-table-column>
      <el-table-column align="center" prop="StatusOK" label="StatusOK" min-width="120">
        <template slot-scope="scope">
          <span>{{scope.row.StatusOK}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="TotalPay" label="TotalPay" min-width="120">
        <template slot-scope="scope">
          <span>${{scope.row.TotalPay.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="Cached" label="Cached" min-width="120"></el-table-column>
      <el-table-column align="center" prop="MaxCache" label="MaxCache" min-width="120">
        <template slot-scope="scope">
          <div class="options">
            <span>{{scope.row.MaxCache}}</span>
            <a @click="editNum(scope.row)">edit</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="IsOpened" min-width="100">
        <template slot-scope="scope" class="options">
          <div class="options">
            <span>{{scope.row.IsOpened}}</span>
            <a @click="changeState(scope.row)" v-if="!scope.row.IsOpened">open</a>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="small_dialog">
      <el-dialog title="MaxCache-Edit" :visible.sync="common_dialog">
        <el-form :model="reqdata">
          <el-form-item label="MaxCache">
            <el-input-number
              v-model="reqdata.MaxCache"
              controls-position="right"
              :max="60000"
              :min="1"
            ></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="common_dialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmEdit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import api from "@/utils/api";
import { _debounce } from "@/utils/auth";
export default {
  name: "Common",
  data() {
    return {
      tableData: [],
      reqdata: {
        ID: 0,
        MaxCache: 0
      },
      common_dialog: false
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //   初始化数据
    async getData() {
      let res = await this.$http.get(api.common);
      if (res && res.Code === 1) {
        this.tableData = res.Data.commonlist || [];
      }
    },
    //   改变状态
    changeState(row) {
      this.$confirm("请确认是否打开", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        let _that = this;
        _debounce(function() {
          _that.$http.get(`${api.commonOpen}?serverid=${row.ID}`).then(res => {
            if (res && res.Code === 1) {
              _that.getData();
            }
          });
        }, 500)();
      });
    },
    // 编辑最大数量
    editNum(row) {
      this.common_dialog = true;
      this.reqdata.MaxCache = row.MaxCache;
      this.reqdata.ID = row.ID;
    },
    // 确认修改
    confirmEdit: _debounce(async function() {
      let serverid = this.reqdata.ID;
      let count = this.reqdata.MaxCache;
      let res = await this.$http.get(
        `${api.commonEdit}?serverid=${serverid}&count=${count}`
      );
      if (res && res.Code === 1) {
        this.common_dialog = false;
        this.getData();
      }
    }, 500)
  }
};
</script>
<style lang="less" scoped>
.options {
  a {
    color: #409eff;
    display: inline-block;
    cursor: pointer;
    margin-left: 20px;
    font-weight: 600;
  }
  span {
    display: inline-block;
    width: 40px;
  }
}
</style>