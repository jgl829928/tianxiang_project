<template>
  <div class="select_server">
    <span class="left_name">id</span>
    <el-select v-model="reqdata.selectId" placeholder="请选择">
      <el-option v-for="(item,index) in serverList" :label="item" :value="item" :key="index"></el-option>
    </el-select>
    <el-button class="right_btn" type="info" plain icon="el-icon-search" @click="search" :disabled="disabled"></el-button>
  </div>
</template>
<script>
import api from "@/utils/api";
export default {
  name: "selectServer",
  props: ["reqdata","name","disabled"],
  data() {
    return {
      serverList: [],
      typeList:[],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 获取搜索下拉框数据
    async getData() {
      let res = await this.$http.get(api[this.name]);
      if (res && res.Code === 1) {
        this.serverList = res.Data.serverlist || [];
        if(this.name=="worldmap"){
          this.$emit("typeList", res.Data.mapcitytypelist);
        }
      }
    },
    search() {
      this.$emit("getserver", this.reqdata.selectId);
    }
  }
};
</script>

