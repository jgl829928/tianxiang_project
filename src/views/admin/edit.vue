<template>
    <div class="common_content">
        <div class="user_info">Profile -- ID: [{{usr.ID}}] User: [{{usr.Name}}]</div>
        <el-table :data="tableData" style="width: 100%" border class="content_table" stripe>
            <el-table-column align="center" checkList label="MainAuth">
                <template slot-scope="scope">
                    <el-checkbox :label="scope.row.MainAuthName" :checked="scope.row.Authorized" @change="handlechange(scope.row)"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column align="center" label="ViceAuth" min-width="280">
                <template slot-scope="scope">
                    <el-checkbox v-for="(item, index) in scope.row.ViceAuthList" :label="item.ViceAuthName" :key="index"
                        @change="handlechange(item)" :checked="item.Authorized"></el-checkbox>
                </template>
            </el-table-column>
        </el-table>
        <el-button type="primary" @click="submitForm">提交</el-button>
    </div>
</template>

<script>
import api from "../../utils/api";
import {  _debounce } from "@/utils/auth";
export default {
  name:"AdminEdit",
  data() {
    return {
      usr: {
        ID: "",  //用户id
        Name: "" //用户名
      },
      tableData: [] //表格数据
    };
  },
  mounted() {
    this.usr = {
      ID: this.$route.query.ID,
      Name: this.$route.query.Name
    };
    this.getdata();
  },
  methods: {
    
    // 初始化数据
    async getdata() {
      let res = await this.$http.get(api.getAccess, {
        params: { usr: this.$route.query.Name }
      });
      if (res && res.Code === 1) {
        this.tableData = res.Data.auth || [];
      }
    },

    // 多选框改变
    handlechange(row) {
      row.Authorized = !row.Authorized;
    },

    // 提交表单
    submitForm: _debounce(async function (){
      let res = await this.$http.post(
        `${api.editAccess}?usr=${this.usr.Name}`,
        this.tableData
      );
      if (res && res.Code === 1) {
        this.$message({
          message: " 编辑成功",
          type: "success"
        });
        this.$router.push("/admin");
      }
    },500)
  }
};
</script>

<style scoped lang="less">
.common_content {
  text-align: center;
  .user_info {
    margin-left: 20px;
    text-align: left;
  }
}
</style>