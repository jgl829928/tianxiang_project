<template>
  <div class="common_content sys_content">
    <el-table :data="tableData" style="width: 100%" stripe border :show-overflow-tooltip="true" class="content_table">
      <el-table-column align="center" prop="ID" label="ID" width="150">
      </el-table-column>
      <el-table-column align="center" prop="Notices" label="Notices" min-width="120">
        <template slot-scope="scope">
          <div class="content_info">
            <el-scrollbar style="height: 100%">
              <el-row v-for="(item,index) in scope.row.Notices" class="notice_info" :key="index">
                <el-col :span="8" :xs="24">
                  {{item.Lan}}
                </el-col>
                <el-col :span="12" :xs="24">
                  <el-popover placement="top-start" width="400" trigger="hover">
                    <div class="ql-container ql-snow editor_input">
                      <div class="ql-editor">
                        <div v-html="item.Content">{{item.Content}}</div>
                      </div>
                    </div>
                    <a slot="reference" class="overflow_content" v-html="item.Content">{{item.Content}}</a>
                  </el-popover>
                </el-col>
              </el-row>
            </el-scrollbar>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="SIDList" label="SIDList" min-width="120">
        <template slot-scope="scope">
          {{scope.row.SIDList.join(",")}}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="options" width="120">
        <template slot-scope="scope">
          <el-button type="danger" size="small" class="el-icon-delete delete_btn" @click="deleteItem(scope.row)" plain>delete</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import api from "@/utils/api";
export default {
  name: "Sysnotice",
  data() {
    return {
      tableData: [] //表格数据
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 初始化数据
    async getData() {
      let res = await this.$http.get(api.sysnotice);
      if (res && res.Code === 1) {
        this.tableData = res.Data.noticelist;
      }
    },
    // 删除某一项
    deleteItem(row) {
      this.$confirm("请确认是否删除", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "保存",
        cancelButtonText: "取消"
      }).then(() => {
        this.$http.get(`${api.sysDelete}?id=${row.ID}`).then(res => {
          if (res.Code === 1) {
            this.$message({
              duration: 1000,
              message: "删除成功",
              type: "success"
            });
            this.getData();
          }
        });
      });
    }
  }
};
</script>

<style scoped lang="less">
.sys_content {
  .ql-container.ql-snow {
    border: none !important;
  }
}
.content_info {
  height: 85px;

  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}

.notice_info {
  text-align: left;
  line-height: 30px;

  .el-col-8 {
    text-align: right;
    padding-right: 20px;
  }

  .overflow_content {
    cursor: pointer;
    display: inline-block;
    width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #409eff;
    font-weight: 500;
  }

  .overflow_content > :not(:first-child) {
    display: none;
  }
}
</style>
<style>
@import url("quill/dist/quill.snow.css");
</style>
