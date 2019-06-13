<template>
  <div class="chart_content" ref="sampling">
    <select-server :reqdata="reqdata" @getserver="search" :name="name"></select-server>
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
          </div>
        </el-col>

        <el-col :span="8" :xs="24">
          <div class="frame fileTable">
            <div class="frameTop">
              <span class="frameName">FileList</span>
            </div>
            <el-form
              status-icon
              ref="reqform"
              label-width="65px"
              class="second_form"
              hide-required-asterisk
            >
              <el-row>
                <el-col :span="10" :xs="24">
                  <el-form-item label="Type" prop="seconds">
                    <el-select v-model="type" placeholder="请选择类型">
                      <el-option label="CPU" value="cpu"></el-option>
                      <el-option label="RAM" value="ram"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10" :xs="24">
                  <el-form-item label="Seconds" prop="seconds" v-if="type=='cpu'">
                    <el-input-number v-model="seconds" controls-position="right" :min="1" :max="30"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="4" :xs="24">
                  <el-form-item>
                    <el-button type="primary" @click="submitForm('reqform')">submit</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div class="frame_content">
              <el-table
                :data="fileList"
                style="width: 100%"
                class="level_tab tables"
                max-height="580"
              >
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column align="center" label="File Name">
                  <template slot-scope="scope">{{scope.row}}</template>
                </el-table-column>
                <el-table-column prop="Name" align="center" label="option" width="220">
                  <template slot-scope="scope">
                    <el-button
                      @click="handleOpen(scope.$index,scope.row)"
                      class="common_btn"
                      type="success"
                      size="small"
                      plain
                      :disabled="isOpen"
                    >open</el-button>
                    <el-button
                      @click="handleDelete(scope.$index,scope.row)"
                      class="el-icon-delete delete_btn"
                      type="danger"
                      size="small"
                      plain
                    >delete</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      :visible.sync="file_dialog"
      width="80%"
      center
      class="file_dailog"
      @close="file_close"
    >
      <iframe :src="fileUrl" frameborder="0" width="100%" height="800"></iframe>
    </el-dialog>
  </div>
</template>
<script>
import echarts from "echarts";
import LineChart from "@/components/line";
import selectServer from "@/components/selectServer";
import api from "@/utils/api";
import { timeFormat, _debounce } from "@/utils/auth";
export default {
  name: "Sampling",
  components: { LineChart, selectServer },
  data() {
    return {
      // 下拉搜索
      name: "sampling",
      reqdata: {
        selectId: ""
      },
      id: "",
      // 基础信息
      baseInfo: [],
      //  定时器
      timeInterval: "",
      // 折线图数据
      cpuData: {},
      diskData: {},
      pingData: {},
      ramData: {},
      // 文件列表
      fileList: [],
      // 提交类型与时间
      type: "cpu",
      seconds: 30,
      // 定时器
      fileInterval: "",
      fileUrl: "",
      file_dialog: false,
      isOpen: false
    };
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timeInterval);
    clearInterval(this.fileInterval);
    next();
  },
  methods: {
    // 搜索
    search:_debounce(function(id) {
      if (!id) return false;
      this.id = id;
      clearInterval(this.timeInterval);
      this.getLineData(); //折线图及基本数据
      this.getOldFile(); //获取历史文件
      this.timeInterval = setInterval(this.getLineData, 5 * 1000); //定时更新数据
    },500),

    // 获取折线图数据
    async getLineData() {
      let res = await this.$http.get(`${api.samInfo}?serverid=${this.id}`);
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
        timeData.push(timeFormat(item.RecordTime * 1000,"hour"));
        numData.push(item.Utilization);
      });
      return {
        timeData,
        numData,
        name,
        rotate: false
      };
    },

    // 提交表单
    submitForm:_debounce(function() {
      this.getNewFile();
    },500),

    // 获取文件数据
    getOldFile() {
      this.$http.get(`${api.samFile}?serverid=${this.id}`).then(res => {
        if (res && res.Code === 1) {
          this.fileList = res.Data.filelist || [];
          if (!this.fileList || this.fileList.length <= 0) return;
        }
      });
    },

    //获取最新生成的文件
    getNewFile() {
      let data = `serverid=${this.id}&sampling=${this.type}`;
      data = this.type == "cpu" ? `${data}&seconds=${this.seconds}` : data;
      this.$http.get(`${api.createFile}?${data}`).then(res => {
        if (res && res.Code === 1) {
          this.fileList = res.Data.filelist || [];
        }
      });
    },
     handleOpen:_debounce(async function(index, row) {
      this.isOpen = true;
      setTimeout(() => {
        this.isOpen = false;
      }, 3 * 1000);

      let res = await this.$http.get(`${api.openFile}?file=${row}`);
      if (!res || res.Code !== 1) return false;
      this.heartCheck();
      clearInterval(this.fileInterval);
      // 每十秒检测心跳
      this.fileInterval = setInterval(this.heartCheck, 10 * 1000);
      // 2秒之后获取资源
      setTimeout(() => {
        this.getSource();
        this.isOpen = false;
      }, 2 * 1000);
    },500),

    // 关闭文件
    async file_close() {
      clearInterval(this.fileInterval);
      // closeFile
      let res = await this.$http.get(api.closeFile);
    },

    // 心跳链接
    async heartCheck() {
      let res = await this.$http.get(api.heartCheck);
    },

    // 获取资源
    async getSource() {
      let time = new Date().getTime();
      this.fileUrl = `${api.openLink}?accesstoken=${
        this.$store.state.token
      }&time=${time}`;
      this.file_dialog = true;
    },

    // 删除文件
    handleDelete(index, row) {
      this.$confirm("请确认是否删除", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        let _that=this
        _debounce(function(){
          _that.delRequest(row)
        },500)()
      });
    },
    
    delRequest(row){
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

    },
  }
};
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>
<style lang="less">
@import url("./ele_index.less");
</style>