<template>
  <div class="common_content chart_content">
    <el-form
      class="chart_form"
      ref="reqData"
      label-width="102px"
      :inline="true"
      label-position="right"
    >
      <el-row>
        <el-col :span="8" :xs="24">
          <el-form-item label="Server ID" prop="serveList" min-width="120">
            <el-select v-model="serverId" clearable placeholder="Server ID">
              <el-option
                v-for="(item,index) in serveList"
                :label="item.ID"
                :value="item.ID"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" :xs="24">
          <el-form-item label="Time" prop="id">
            <el-date-picker
              v-model="time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="UTC时间"
              end-placeholder="UTC时间"
              value-format="yyyy-MM-ddTHH:mm:ssZ"
            ></el-date-picker>
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
        <el-col :span="24" :xs="24" class="left_grid">
          <div class="frame">
            <div class="frameTop">
              <span class="frameName">BASE INFO</span>
            </div>
            <div class="frameDiv">
              <table class="tables special_tab">
                <tr>
                  <td>ID</td>
                  <td>{{baseInfo.id}}</td>
                  <td>IP</td>
                  <td>{{baseInfo.ip}}</td>
                  <td>NAME</td>
                  <td>{{baseInfo.name}}</td>
                  <td>TYPE</td>
                  <td>{{baseInfo.type}}</td>
                </tr>
              </table>
            </div>
          </div>
          <div class="lineCharts">
            <el-row>
              <el-col :span="8" :xs="24">
                <LineChart :lineData="arpuData"></LineChart>
              </el-col>
              <el-col :span="8" :xs="24">
                <LineChart :lineData="dauData"></LineChart>
              </el-col>
              <el-col :span="8" :xs="24">
                <LineChart :lineData="dnuData"></LineChart>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import LineChart from "@/components/line.vue";
import api from "@/utils/api";
import { dealData,_debounce } from "@/utils/auth";
export default {
  name: "Monitor",
  components: { LineChart },
  data() {
    return {
      serveList: [],
      serverId: "",
      time: [],
      baseInfo: {},
      arpuData: [],
      dauData: [],
      dnuData: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$http.get(api.statistics).then(res => {
        if (res && res.Code === 1) {
          this.serveList = res.Data.serverlist;
        }
      });
    },
    search:_debounce(function(){
      let start = this.time.length > 0 ? Date.parse(this.time[0]) / 1000 : "";
      let end = this.time.length > 0 ? Date.parse(this.time[1]) / 1000 : "";
      let data = `serverid=${this.serverId}&start=${start}&end=${end}`;
      this.$http.get(`${api.statsInfo}?${data}`).then(res => {
        if (res && res.Code === 1) {
          this.baseInfo = res.Data;
          this.arpuData = dealData(this.baseInfo.list, "ARPU");
          this.dauData = dealData(this.baseInfo.list, "DAU");
          this.dnuData = dealData(this.baseInfo.list, "DNU");
        }
      });
    },500)
  }
};
</script>
<style lang="less" scoped>
@import url("../sampling/index.less");

.frame {
  margin-bottom: 80px;

  .frameDiv .special_tab {
    width: 100% !important;

    tr td:nth-child(2n) {
      width: 20% !important;
      padding-left: 10px;
      word-break: break-all;
      word-wrap: break-all;
      font-size: 14px;
    }
    tr td:nth-child(2n + 1) {
      width: 5% !important;
      padding-left: 10px;
      word-break: break-all;
      word-wrap: break-all;
      font-size: 14px;
    }
  }
}
</style>