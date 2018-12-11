<template>
    <div class="common_page">
        <div class="title">Create A New Profile</div>
        <hr>
        <div class="form_content">
            <el-form  :model="reqData" status-icon :rules="rules" ref="reqform" label-width="100px" class="demo-ruleForm" hide-required-asterisk>
                <el-form-item label="Username" prop="usr">
                    <el-input type="text" v-model="reqData.usr" autocomplete="off" placeholder="Username"></el-input>
                </el-form-item>
                <el-form-item label="Password" prop="pwd">
                    <el-input type="password" v-model="reqData.pwd" autocomplete="off" placeholder="Password"></el-input>
                </el-form-item>
                <el-form-item label="Phone" prop="phone">
                    <el-input type="text" v-model="reqData.phone" autocomplete="off" placeholder="Phone"></el-input>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                    <el-input v-model="reqData.email" placeholder="Email"></el-input>
                </el-form-item>
                <el-form-item label="Position" prop="position" class="position_select">
                  <el-select v-model="reqData.position" placeholder="请选择" clearable>
                        <el-option v-for="(item,index) in positionList" :key="index" :value="item" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('reqform')">提交</el-button>
                    <el-button @click="resetForm('reqform')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import api from "@/utils/api";
import { encrypt } from "@/utils/auth";
export default {
  name: "AdminAdd",
  data() {
    return {
      // 请求数据
      reqData: {
        usr: "",
        pwd: "",
        phone: "",
        position: "",
        email: ""
      },
      // 职位列表
      positionList: [],
      // 表单验证
      rules: {
        usr: [
          { required: true, message: "请输入用户姓名", trigger: "blur" },
          {
            pattern: /^[a-zA-Z][a-zA-Z0-9_]{4,20}$/,
            message: "请输入长度为5-20的字符",
            trigger: "blur"
          }
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9]{8,20}$/,
            message: "请输入长度为8-20的字符",
            trigger: "blur"
          }
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[34578]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }
        ],
        position: [{ required: true, message: "请输入职位", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      let res = await this.$http.get(api.adminAdd);
      if (res && res.Code === 1) {
        this.positionList = res.Data.positionlist || [];
      }
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (!valid) {
          return false;
        }
        let data = Object.assign({}, this.reqData);
        data.pwd = encrypt(data.pwd);
        let res = await this.$http.post(api.adminAddSub, data);
        if (!res||res.Code !== 1) {
          this.$message.error("添加失败，请重试");
          return false;
        }
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.$router.push("/admin");
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>