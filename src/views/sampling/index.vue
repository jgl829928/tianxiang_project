<template>
    <div class="sampling_content" ref="sampling">
        <div class="select_server">
            <span class="left_name">id</span>
            <el-select v-model="selectId" placeholder="请选择" clearable>
                <el-option v-for="(item,index) in serverList" :label="item.ID" :value="item.ID" :key="index"></el-option>
            </el-select>
            <el-button class="right_btn" type="info" plain icon="el-icon-search" @click="search"></el-button>
        </div>
        <div class="sampling_grid">
            <el-row>
                <el-col :span="16" :xs="24" class="left_grid">
                    <div class="frame">
                        <div class="frameTop">
                            <span class="frameName">TROOPS INFO</span>
                        </div>
                        <div class="frameDiv">
                            <table class="tables">
                                <tr>
                                    <td>ID</td>
                                    <td>{{baseInfo.id}}</td>
                                </tr>
                                <tr>
                                    <td>IP</td>
                                    <td>{{baseInfo.ip}}</td>
                                </tr>
                            </table>
                            <table class="tables">
                                <tr>
                                    <td>NAME</td>
                                    <td>{{baseInfo.name}}</td>
                                </tr>
                                <tr>
                                    <td>TYPE</td>
                                    <td>{{baseInfo.type}}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <el-row>
                        <el-col :span="12" :xs="24">
                            <LineChart :lineData="cpuData"></LineChart>
                        </el-col>
                        <el-col :span="12" :xs="24">
                            <LineChart :lineData="diskData"></LineChart>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12" :xs="24">
                            <LineChart :lineData="pingData"></LineChart>
                        </el-col>
                        <el-col :span="12" :xs="24">
                            <LineChart :lineData="ramData"></LineChart>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="8" :xs="24">
                    <div class="frame fileTable">
                        <div class="frameTop">
                            <span class="frameName">FileList</span>
                        </div>
                        <div class="frameDiv">
                            <el-table :data="fileList" style="width: 100%" border class="level_tab tables" max-height="690">
                                <el-table-column align="center" label="File Name">
                                    <template slot-scope="scope">
                                        {{scope.row}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="Name" align="center" label="option" width="120">
                                    <template slot-scope="scope">
                                        <el-button @click="handleDelete(scope.$index,scope.row)" class="el-icon-delete delete_btn"
                                            type="danger" size="small" plain>delete</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import echarts from "echarts";
import LineChart from "./line.vue";
import api from "@/utils/api";
import { timeFormat } from "@/utils/auth";
export default {
  name: "Sampling",
  components: { LineChart },
  data() {
    return {
      // 下拉搜索
      selectId: "",
      serverList: [],
      // 基础信息
      baseInfo: [],
      // 文件列表
      fileList: [],
      //  定时器
      timeInterval: "",
      // 折线图数据
      cpuData: {},
      diskData: {},
      pingData: {},
      ramData: {}
    };
  },
  created() {
    this.getData();
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timeInterval);
    next();
  },
  methods: {
    // 获取搜索下拉框数据
    async getData() {
      let res = await this.$http.get(api.sampling);
      if (res && res.Code === 1) {
        this.serverList = res.Data.serverlist || [];
      }
    },
    // 搜索
    search() {
      clearInterval(this.timeInterval);
      this.getLineData(); //折线图及基本数据
      this.timeInterval = setInterval(this.getLineData, 5 * 1000); //定时更新数据
      this.getOldFile(); //获取历史文件
    //   this.getNewFile(); //获取最新生成的文件
    },
    // 获取文件数据
    getOldFile() {
      this.$http.get(`${api.samFile}?serverid=${this.selectId}`).then(res => {
        if (res && res.Code === 1) {
          this.fileList = res.Data.filelist || [];
        }
      });
    },
    //获取最新生成的文件
    getNewFile() {
      this.$http.get(`${api.createFile}?serverid=${this.selectId}&seconds=59`).then(res => {
          if (res && res.Code === 1) {
          }
        });
    },
    // 删除文件
    handleDelete(index, row) {
      this.$confirm("请确认是否删除", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "保存",
        cancelButtonText: "取消"
      }).then(() => {
        this.$http.get(`${api.delFile}?file=${row}`).then(res => {
          if (res && res.Code === 1) {
            this.$message({
              message: "删除成功",
              type: "success",
              duration: 1000
            });
            this.getOldFile(); //获取历史文件
          }
        });
      });
    },
    // 获取折线图数据
    async getLineData() {
      let res = await this.$http.get(
        `${api.samInfo}?serverid=${this.selectId}`
      );
      if (res && res.Code === 1) {
        this.baseInfo = res.Data;
        let data = this.baseInfo.historymap;
        this.cpuData = this.delData(data.CPU, "CPU");
        this.diskData = this.delData(data.DISK, "DISK");
        this.pingData = this.delData(data.PING, "PING");
        this.ramData = this.delData(data.RAM, "RAM");
      }
    },
    //处理折线图数据
    delData(data, name) {
      let timeData = [],
        numData = [];
      data.map(item => {
        if (name === "PING") item.Utilization = item.Utilization / 1000000;

        timeData.push(timeFormat(item.RecordTime * 1000));
        numData.push(item.Utilization);
      });
      return {
        timeData,
        numData,
        name
      };
    }
  }
};
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>
<style lang="less">
.select_server {
  .el_select {
    margin: 0px;
  }
  .el-input__inner {
    border-radius: 0px;
  }
}
</style>