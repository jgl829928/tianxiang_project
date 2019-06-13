<template>
  <div class="common_content user_content">
    <el-form class="c-search-form special_form" ref="reqData" label-width="80px" :inline="true" label-position="right">
      <el-input placeholder="请输入内容" v-model="text" class="input-with-select">
        <el-select v-model="type" slot="prepend" placeholder="请选择" class="special_selcet">
          <el-option label="RID" value="rid"></el-option>
          <el-option label="UID" value="uid"></el-option>
          <el-option label="Name" value="name"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
    </el-form>
    <div class="detail">
      <el-col :span="8" :xs="24" v-for="(item,index) in userList" :key="index">
        <el-card class="user_card">
          <div slot="header" class="clearfix">
            <span>User Profile</span>
          </div>
          <div class="text item">
            <el-row>
              <el-col :span="12">RID</el-col>
              <el-col :span="12">{{item.RID}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="12">UID</el-col>
              <el-col :span="12">{{item.UID}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="12">Name</el-col>
              <el-col :span="12">{{item.Name}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="12">Level</el-col>
              <el-col :span="12">{{item.Level}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="12">LastLogin</el-col>
              <el-col :span="12">{{item.LastLogin|moment("YYYY-MM-DD HH:mm:ss")}}</el-col>
            </el-row>
          </div>
          <div class="detail_btn">
            <el-button type="primary" @click="toDetail(item.RID)">detail</el-button>
          </div>
        </el-card>
      </el-col>
    </div>
  </div>
</template>
<script>
  import api from "@/utils/api";
  import { _debounce } from "@/utils/auth";
  export default {
    name: "User",
    data() {
      return {
        type: "name", //搜索类型
        text: "", //搜索内容
        userList: [] //用户列表
      };
    },
    methods: {
      // 搜索用户
      search:_debounce(async function() {
        let res = await this.$http.get(
          `${api.userSearch}?type=${this.type}&data=${this.text}`
        );
        if (res && res.Code === 1) {
          this.userList = [];
          if (!res.Data.info) {
            this.$message.error("当前暂无此用户");
            return false;
          }
          res.Data.info.map(item => {
            let userItem = [];
            if (item && item != "null") {
              userItem = JSON.parse(item);
              this.userList.push(...userItem);
            }
          });
        }
      },500),
      // 去用户详情
      toDetail(id) {
        this.$router.push({
          path: "/user/detail",
          query: {
            id: id
          }
        });
      }
    }
  };
</script>
<style lang="less" scoped>
.user_content{
  .c-search-form {
    width: 35%;
    margin: auto;
  }

  .detail {
    .user_card {
      margin: 40px;

      .clearfix {
        color: #fff;
        font-size: 20px;
        text-align: center;
      }

      .el-row {
        height: 30px;

        .el-col-12 {
          height: 100%;
          padding-left: 40px;
        }
      }

      .detail_btn {
        text-align: center;
        margin-top: 20px;

        button {
          width: 140px;
          height: 30px;
          line-height: 10px;
        }
      }
    }
  }
  }
</style>
<style lang="less">
.user_content{
  .detail {
    .el-card__header {
      background: #8a8e92;
      height: 40px;
      line-height: 10px;
    }
  }

  .special_form {
    .el-select .el-input {
      width: 130px;
    }
  }
}
</style>