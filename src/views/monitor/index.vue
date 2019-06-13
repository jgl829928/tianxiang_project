<template>
  <div class="common_content chart_content">
    <el-form class="chart_form" ref="reqData" label-width="102px" :inline="true" label-position="right">
      <el-row>
        <el-col :span="8" :xs="24">
          <el-form-item label="Server ID" prop="serveList" min-width="120">
            <el-select v-model="serverId" clearable placeholder="Server ID">
              <el-option v-for="(item,index) in serveList" :label="item.ID" :value="item.ID" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item label="Time" prop="id">
            <el-date-picker v-model="time" type="datetimerange" range-separator="至" start-placeholder="UTC时间"
              end-placeholder="UTC时间" value-format="timestamp"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4" :xs="24">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">search</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="chart_grid">
      <el-row>
        <el-col :span="16" :xs="24" class="left_grid">
          <div class="frame">
            <div class="frameTop">
              <span class="frameName">BASE INFO</span>
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
          <div class="lineCharts">
            <el-row>
              <el-col :span="24" :xs="24">
                <LineChart :lineData="cpuData"></LineChart>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" :xs="24">
                <LineChart :lineData="diskData"></LineChart>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" :xs="24">
                <LineChart :lineData="pingData"></LineChart>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" :xs="24">
                <LineChart :lineData="ramData"></LineChart>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="8" :xs="24"></el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import echarts from "echarts";
  import LineChart from "@/components/line";
  import api from "@/utils/api";
  import { dealData ,_debounce} from "@/utils/auth";
  export default {
    name: "Monitor",
    components: { LineChart },
    data() {
      return {
        serveList: [],
        serverId: "",
        time: [],
        cpuData: [],
        diskData: [],
        pingData: [],
        ramData: [],
        baseInfo: {}
      };
    },
    mounted() {
      this.getData();
    },
    methods: {
      // 获取下拉框数据
      getData() {
        this.$http.get(api.monitor).then(res => {
          if (res && res.Code === 1) {
            this.serveList = res.Data.serverlist;
          }
        });
      },
      // 查询数据
      search:_debounce(function() {
        let start = this.time.length > 0 ? this.time[0] / 1000 : "";
        let end = this.time.length > 0 ? this.time[1] / 1000 : "";
        let data = `serverid=${this.serverId}&start=${start}&end=${end}`;
        this.$http.get(`${api.monitorInfo}?${data}`).then(res => {
          if (res && res.Code === 1) {
            this.baseInfo = res.Data;
            this.cpuData = dealData(this.baseInfo.monitorinfo, "CPU");
            this.ramData = dealData(this.baseInfo.monitorinfo, "RAM");
            this.diskData = dealData(this.baseInfo.monitorinfo, "DISK");
            this.pingData = dealData(this.baseInfo.monitorinfo, "PING");
          }
        });
      },500)
    }
  };
</script>
<style lang="less" scoped>
  @import url("../sampling/index.less");
</style>