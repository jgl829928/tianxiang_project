<template>
    <div class="common_content">
        <div class="common_radio">
            <span>Warning Status</span>
            <el-radio-group v-model="unclose" @change="radioChange">
                <el-radio :label=0>unclose</el-radio>
                <el-radio :label=1>closed</el-radio>
            </el-radio-group>
        </div>
        <el-table :data="tableData" style="width: 100%" border stripe :show-overflow-tooltip="true" class="content_table">
            <el-table-column align="center" prop="ID" label="ID" width="150">
            </el-table-column>
            <el-table-column align="center" prop="Type" label="Type" min-width="100">
            </el-table-column>
            <el-table-column align="center" prop="Title" label="Title" min-width="100">
            </el-table-column>
            <el-table-column align="center" prop="Content" label="Content" min-width="120">
            </el-table-column>
            <el-table-column align="center" prop="LastNotify" label="LastNotify" min-width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.LastNotify|moment("YYYY-MM-DD HH:mm:ss")}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="NotifyCount" label="NotifyCount" min-width="120">
            </el-table-column>
            <el-table-column align="center" prop="Reason" label="Reason" min-width="120" v-if="unclose">
            </el-table-column>
            <el-table-column align="center" prop="ClosedAt" label="ClosedAt" min-width="120" v-if="unclose">
            </el-table-column>
            <el-table-column align="center" prop="Closer" label="Closer" min-width="120" v-if="unclose">
            </el-table-column>
            <el-table-column align="center" fixed="right" label="options" min-width="100" v-if="!unclose" key="options">
                <template slot-scope="scope">
                    <el-button @click="check(scope.row)" type="primary" size="small">
                        <span>close</span>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <footer>
            <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize" :current-page="currentPage"
                @current-change="pageChange">
            </el-pagination>
        </footer>
        <div class="common_dialog">
            <el-dialog title="Warning" :visible.sync="warning_dialog">
                <el-form :model="itemData" label-width="80px" ref="close_form" label-position="left" :rules="rules">
                    <el-row>
                        <el-col :span="12" :xs="24">
                            <el-form-item label="ID" prop="ID" min-width="110">
                                <span>{{itemData.ID}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :xs="24">
                            <el-form-item label="Type" prop="Type">
                                <span>{{itemData.Type}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24" :xs="24">
                            <el-form-item label="Content" prop="Content">
                                <span>{{itemData.Content}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24" :xs="24">
                            <el-form-item label="Reason" prop="Reason">
                                <el-input clearable v-model.trim="itemData.Reason"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="warning_dialog = false">取 消</el-button>
                    <el-button type="primary" @click="confirm_close">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import api from "@/utils/api";
export default {
  name: "Warning",
  data() {
    return {
      unclose: 0, //单选框
      pageSize: 10, //每页显示条数
      currentPage: 1, //当前页数
      tableData: [], //表格数据
      total: 0, //总数量
      warning_dialog: false, //弹框
      itemData: {}, //具体数据
      rules: {
        //验证规则
        Reason: [{ required: true, message: "请输入原因", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 获取初始数据
    async getData() {
      let start = (this.currentPage - 1) * this.pageSize;
      let res = await this.$http.get(
        `${api.warning}?unclose=${this.unclose}&start=${start}&limit=${
          this.pageSize
        }`
      );
      if (res.Code === 1) {
        this.tableData = res.Data.warnningList;
        this.total = res.Data.total;
      }
    },
    // 筛选单选框条件改变
    radioChange(val) {
      this.unclose = val;
      this.currentPage = 1;
      this.getData();
    },
    //翻页
    pageChange(val) {
      this.currentPage = val;
      this.getData();
    },
    // 打开弹窗
    check(row) {
      this.warning_dialog = true;
      this.itemData = row;
    },
    // 确认关闭
    confirm_close() {
      this.$refs["close_form"].validate(valid => {
        if (!valid) {
          return false;
        }
        this.$confirm("确认关闭此条警告?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        }).then(() => {
          let param = {
            id: this.itemData.ID,
            reason: this.itemData.Reason
          };
          this.$http.post(api.warningClose, param).then(res => {
            if (res && res.Code === 1) {
              this.$message({
                type: "success",
                message: "关闭成功!"
              });
              this.warning_dialog = false;
              this.getData();
            }
          });
        });
      });
    }
  }
};
</script>
<style lang="less" scoped>
.common_content {
  footer {
    text-align: center;
  }
}
</style>