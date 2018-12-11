<template>
  <div class="common_page">
    <div class="title">Create Server Profile</div>
    <hr>
    <div class="form_content">
      <el-form
        :model="reqData"
        status-icon
        :rules="rules"
        ref="reqform"
        label-width="160px"
        class="demo-ruleForm"
        hide-required-asterisk
      >
        <el-form-item label="Server ID" prop="id">
          <el-input
            type="text"
            v-model.number="reqData.id"
            autocomplete="off"
            placeholder="ServerID"
          ></el-input>
        </el-form-item>
        <el-form-item label="Server Type" prop="请选择">
          <el-select v-model="reqData.type" placeholder="all" clearable>
            <el-option v-for="(item,index) in typeList" :key="index" :value="item" :label="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Server Name" prop="name">
          <el-input type="text" v-model="reqData.name" autocomplete="off" placeholder="ServerName"></el-input>
        </el-form-item>
        <el-form-item label="Server Area" prop="area">
          <el-select v-model="reqData.area" placeholder="all" clearable>
            <el-option v-for="(item,index) in areaList" :key="index" :value="item" :label="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Exter IP" prop="exterip">
          <el-input v-model="reqData.exterip" placeholder="ExterIP"></el-input>
        </el-form-item>
        <el-form-item label="Inner IP" prop="innerip">
          <el-input v-model="reqData.innerip" placeholder="InnerIP"></el-input>
        </el-form-item>
        <el-form-item label="Client Port" prop="clientport">
          <el-input v-model.number="reqData.clientport" placeholder="ClientPort"></el-input>
        </el-form-item>
        <el-form-item label="Command Port" prop="commandport">
          <el-input v-model.number="reqData.commandport" placeholder="CommandPort"></el-input>
        </el-form-item>
        <el-form-item label="Linux User" prop="linuxuser">
          <el-input v-model="reqData.linuxuser" placeholder="LinuxUser"></el-input>
        </el-form-item>
        <el-form-item label="Project Root" prop="projectroot">
          <el-input v-model="reqData.projectroot" placeholder="ProjectRoot"></el-input>
        </el-form-item>
        <el-form-item label="Watch Port(only for chatserver)" prop="watchport">
          <el-input v-model.number="reqData.watchport" placeholder="WatchPort(only for chatserver)"></el-input>
        </el-form-item>
        <el-form-item label="Watch URL(only for chatserver)" prop="watchurl">
          <el-input v-model.number="reqData.watchurl" placeholder="WatchUrl"></el-input>
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
export default {
  name: "ServerAdd",
  data() {
    let IP_reg = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/;
    let port_reg = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入port"));
      } else {
        if (value != 0 && (value < 1024 || value > 49151)) {
          callback(new Error("请输入正确的port"));
        }
        callback();
      }
    };
    let url_reg = /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+.?$/;
    return {
      areaList: [], // 地区列表
      typeList: [], // 类型列表
      reqData: {
        //表单数据
        id: "",
        type: "",
        name: "",
        exterip: "",
        innerip: "",
        clientport: "",
        commandport: "",
        watchport: "",
        linuxuser: "",
        projectroot: "",
        area: "",
        watchurl: ""
      },
      rules: {
        //验证规则
        id: [{ required: true, message: "请输入id", trigger: "blur" }],
        type: [{ required: true, message: "请输入type", trigger: "blur" }],
        name: [{ required: true, message: "请输入name", trigger: "blur" }],
        exterip: [
          { required: true, message: "请输入exterip", trigger: "blur" },
          {
            pattern: IP_reg,
            message: "请输入正确的格式",
            trigger: "blur"
          }
        ],
        innerip: [
          { required: true, message: "请输入innerip", trigger: "blur" },
          {
            pattern: IP_reg,
            message: "请输入正确的格式",
            trigger: "blur"
          }
        ],
        clientport: [
          { required: true, message: "请输入clientport", trigger: "blur" },
          { validator: port_reg, trigger: "blur" }
        ],
        commandport: [
          { required: true, message: "请输入commandport", trigger: "blur" },
          { validator: port_reg, trigger: "blur" }
        ],
        watchport: [
          { required: true, message: "请输入watchport", trigger: "blur" },
          { validator: port_reg, trigger: "blur" }
        ],
        watchurl: [
          { required: false, message: "请输入watchurl", trigger: "blur" },
          {
            pattern: url_reg,
            message: "请输入正确的格式",
            trigger: "blur"
          }
        ],
        linuxuser: [
          { required: true, message: "请输入linuxuser", trigger: "blur" }
        ],
        projectroot: [
          { required: true, message: "请输入projectroot", trigger: "blur" }
        ],
        area: [{ required: true, message: "请输入area", trigger: "change" }]
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 获取初始数据
    async getData() {
      let res = await this.$http.get(api.serverSelect);
      if (res.Code === 1) {
        this.areaList = res.Data.serverarealist;
        this.typeList = res.Data.servertypelist;
      }
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res = await this.$http.post(api.serverAdd, this.reqData);
          if (!res || res.Code !== 1) {
            this.$message.error("添加失败，请重试");
            return false;
          }
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.$router.push("/server");
        } else {
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>