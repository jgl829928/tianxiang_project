<template>
    <div class="common_page">
        <div class="title">Change Your Password</div>
        <hr>
        <div class="form_content">
            <el-form :model="reqData" status-icon :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm" hide-required-asterisk>
                <el-form-item label="Old Password" prop="oldpwd">
                    <el-input type="password" v-model="reqData.oldpwd" autocomplete="off" placeholder="Old Password"></el-input>
                </el-form-item>
                <el-form-item label="New Password" prop="newpwd">
                    <el-input type="password" v-model="reqData.newpwd" placeholder="New Password"></el-input>
                </el-form-item>
                <el-form-item label="Confim Password" prop="confim">
                    <el-input  type="password" v-model="reqData.confim" placeholder="Confim Password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import api from "@/utils/api";
import { encrypt } from "@/utils/auth";
export default {
  name: "AdminPwd",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.reqData.newpwd !== "") {
          this.$refs.ruleForm.validateField("confim");
        }
        callback();
      }
    };
    // 验证两次密码是否一致
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.reqData.newpwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // 表单数据
      reqData: {
        oldpwd: "",
        newpwd: "",
        confim: ""
      },
      // 验证规则
      rules: {
        oldpwd: [
          { required: true, message: "请输入原密码", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9_]{8,20}$/,
            message: "请输入长度为8-20的字符",
            trigger: "blur"
          }
        ],
        newpwd: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { validator: validatePass, trigger: "blur" },

          {
            pattern: /^[a-zA-Z0-9_]{8,20}$/,
            message: "请输入长度为8-20的字符",
            trigger: "blur"
          }
        ],
        confim: [
          { required: true, message: "请确认密码", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (!valid) {
          return false;
        }
        let data = {};
        data["oldpwd"] = encrypt(this.reqData.oldpwd);
        data["newpwd"] = encrypt(this.reqData.newpwd);
        let res = await this.$http.post(api.adminpasswd, data);
        if (!res||res.Code !== 1) {
          this.$message.error("修改失败，请重试");
          return false;
        }
        this.$message({
          message: "修改成功",
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