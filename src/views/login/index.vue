<template>
  <div class="login">
    <div class="container">
      <h1>NEBULA WEBCONSOLE</h1>
      <h3>Project001</h3>
      <el-form :model="reqData" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账号" prop="usr">
          <el-input type="text" v-model="reqData.usr" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input type="password" v-model="reqData.pwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" :disabled="isDisable">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <footer>copyright&copy; 2017-2019 Nebula Inc All rights reserved</footer>
  </div>
</template>

<script>
  import api from "@/utils/api";
  import { initRouterNode } from "@/utils/menu";
  import { encrypt, _debounce } from "@/utils/auth";
  export default {
    name: "Login",
    data() {
      return {
        reqData: {
          // 表单数据
          usr: "",
          pwd: ""
        },
        rules: {
          //验证规则
          usr: [{ required: true, message: "请输入账号", trigger: "blur" }],
          pwd: [{ required: true, message: "请输入密码", trigger: "blur" }]
        },
        isDisable: false
      };
    },
    methods: {
      submitForm: _debounce(function (formName) {
        this.$refs[formName].validate(async valid => {
          if (!valid) {
            return false;
          }
          //加密
          let usr = encrypt(this.reqData.usr);
          let pwd = encrypt(this.reqData.pwd);

          let res = await this.$http.get(
            api.login + "?usr=" + usr + "&pwd=" + pwd
          );
          if (res) {
            this.isDisable = false;
          }
          if (res.Code === -103 || res.Code === -102) {
            this.$message.error("账号或密码错误，请重试");
            return false;
          }
          if (res.Code === -104) {
            this.isDisable = true;
            this.$message.error("密码错误次数过多，请联系管理员！");
            return false;
          }
          if (res.Code === -101) {
            this.$message.error("登录失败，请重试");
            return false;
          }
          if (res && res.Code === 1) {
            this.dealData(res.Data);
          }
        });
      }, 500),
      // 登录成功后处理相关数据
      dealData(data) {
        let menu = data.AuthMenu;
        if (!menu) {
          this.$message.error("该账号权限异常");
          return false;
        }
        //存session'
        let user = {
          title: data.Title,
          userName: data.UserName
        };
        this.$store.commit("SET_TOKEN", data.accesstoken);
        this.$store.commit("SET_USER", user);
        initRouterNode(menu); // 初始化菜单列表
        this.$message({
          message: "登录成功",
          type: "success",
          duration: 1000
        });
        this.$router.push("/admin");
      },
      //重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };
</script>
<style lang='less' scoped>
  @import url("./index.less");
</style>