<template>
  <div class="common_content server_content">
    <!-- 单选框 -->
    <div class="common_radio">
      <span>Refresh Interval</span>
      <el-radio-group v-model="updateTime">
        <el-radio :label="5">5s</el-radio>
        <el-radio :label="10">10s</el-radio>
        <el-radio :label="15">15s</el-radio>
      </el-radio-group>
    </div>
    <!-- 是否显示操作框 -->
    <div :class="isOpen?'open':'close'">
      <el-button :icon="isOpen?'el-icon-arrow-right':'el-icon-arrow-left'" circle type="info" @click="isOpen=!isOpen"></el-button>
    </div>
    <!-- server表格 -->
    <el-table :data="tableData" style="width: 100%" border stripe :show-overflow-tooltip="true" class="content_table">
      <el-table-column align="center" prop="ID" label="ID" width="150"></el-table-column>
      <el-table-column align="center" prop="Type" label="Type" min-width="100"></el-table-column>
      <el-table-column align="center" prop="Name" label="Name" min-width="100"></el-table-column>
      <el-table-column align="center" prop="Ping" label="Ping" min-width="120">
        <template slot-scope="scope">
          <span v-if="stateData[scope.$index]">{{stateData[scope.$index].Ping}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="Running" label="Running" min-width="120">
        <template slot-scope="scope">
          <span v-if="stateData[scope.$index]">{{stateData[scope.$index].Running}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="CPU" label="CPU" min-width="120">
        <template slot-scope="scope">
          <span v-if="stateData[scope.$index]">{{stateData[scope.$index].CPUProfile}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="RAM" label="RAM" min-width="120">
        <template slot-scope="scope">
          <span v-if="stateData[scope.$index]">{{stateData[scope.$index].RAMProfile}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="DISK" label="DISK" min-width="120">
        <template slot-scope="scope">
          <span v-if="stateData[scope.$index]">{{stateData[scope.$index].DISKProfile}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="ClientOnline" label="ClientOnline" min-width="120">
        <template slot-scope="scope">
          <span v-if="stateData[scope.$index]">{{stateData[scope.$index].OnlineInfo}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="Status" label="Status" min-width="120">
        <template slot-scope="scope" v-if="stateData[scope.$index]">
          <span v-if="stateData[scope.$index].Status==0">close</span>
          <span v-else-if="stateData[scope.$index].Status==1">open</span>
          <span v-else-if="stateData[scope.$index].Status==2">closing</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="Area" label="Area" min-width="120"></el-table-column>
      <el-table-column align="center" prop="ConnectServers" label="ConnectServers" min-width="210">
        <template slot-scope="scope">
          <div v-if="stateData[scope.$index]">
            <p v-for="(item,index) in stateData[scope.$index].ConnectServers" :key="index">
              {{item.Type}} :
              {{item.Connected}}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="ExterIP" label="ExterIP" min-width="120"></el-table-column>
      <el-table-column align="center" prop="InnerIP" label="InnerIP" min-width="120"></el-table-column>
      <el-table-column align="center" prop="ClientPort" label="ClientPort" min-width="120"></el-table-column>
      <el-table-column align="center" prop="CommandPort" label="CommandPort" min-width="120"></el-table-column>
      <el-table-column align="center" prop="WatchPort" label="WatchPort" min-width="120"></el-table-column>
      <el-table-column align="center" prop="WatchURL" label="WatchURL" min-width="120"></el-table-column>
      <el-table-column align="center" fixed="right" label="options" min-width="250" v-if="isOpen">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.$index,scope.row)" icon="el-icon-edit" type="primary" size="small">edit</el-button>
          <el-button @click="changestatus(scope.$index,scope.row)" size="small" v-if="scope.row.Type=='gameserver'"
            :disabled="(scope.row.time<60&&scope.row.time>0)||scope.row.status=='closing'">
            <span v-if="scope.row.time<60&&scope.row.time>0">{{scope.row.time}}</span>
            <span v-else>{{scope.row.status}}</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import api from "@/utils/api";
  import { formatSeconds } from "@/utils/auth";
  export default {
    name: "Server",
    data() {
      return {
        tableData: [],
        listID: [],
        timeInterval: "",
        reuqestList: [],
        resList: [],
        stateData: [],
        updateTime: 5,
        isOpen: false
      };
    },
    mounted() {
      this.getData();
    },
    beforeRouteLeave(to, from, next) {
      clearInterval(this.timeInterval);
      next();
    },
    methods: {
      // 获取初始数据
      async getData() {
        let res = await this.$http.get(api.server);
        if (res && res.Code === 1) {
          this.tableData = res.Data.status || [];
        }
        this.tableData.map(item => {
          item.status = "";
          item.time = 60;
        });

        this.getStateData();
        // 多个请求动态获取服务器状态
        this.timeInterval = setInterval(
          this.getStateData,
          this.updateTime * 1000
        );
      },
      //动态获取服务器状态
      async getStateData() {
        for (let i = 0; i < this.tableData.length; i++) {
          this.reuqestList.push(
            this.$http.get(`${api.serverStatus}?serverid=${this.tableData[i].ID}`)
          );
        }
        this.resList = await Promise.all(this.reuqestList);
        this.stateData = [];

        this.resList.map(item => {
          if (item.Data && item.Data.status) {
            this.stateData.push(item.Data.status[0]);
          } else {
            this.stateData.push({});
          }
        });
        this.dealData(this.stateData);
        this.reuqestList = [];
      },
      // 设置服务器状态按钮显示
      dealData(data) {
        let tableData = this.tableData;
        data.forEach((item, i) => {
          item.Running = formatSeconds(item.Running);
          if (item.Status === 0) {
            tableData[i].status = "start";
          }
          if (item.Status === 1) {
            tableData[i].status = "close";
          }
          if (item.Status === 2) {
            tableData[i].status = "closing";
          }
        });
      },
      // 编辑
      handleEdit(index, row) {
        this.$router.push({
          path: "server/edit",
          query: {
            id: row.ID
          }
        });
      },
      // 改变状态
      changestatus(index, row) {
        if (row.status == "start") {
          // 停止状态开启服务
          this.$confirm(
            `您确定要开启服务器 ID=${row.ID} 服务器名=${row.Name}?`,
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            }
          ).then(() => {
            this.startServer(index, row);
          });
        }
        if (row.status == "close") {
          // 运行状态关闭服务
          this.$confirm(
            `您确定要关闭服务器 ID=${row.ID} 服务器名=${row.Name}?`,
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消"
            }
          ).then(() => {
            this.closeServer(index, row);
          });
        }
      },
      // 开启服务
      startServer(index, row) {
        this.$http.get(`${api.start}?serverid=${row.ID}`).then(res => {
          if (!res || res.Code !== 1) {
            this.$message.error("服务器打开失败，请重试");
            return false;
          }
          this.getStateData();
          setTimeout(() => {
            this.$message({
              message: "服务器正在打开,请稍等...",
              type: "success"
            });
          }, 3000);
        });
      },
      // 暂停服务
      closeServer(index, row) {
        this.$http.get(`${api.close}?serverid=${row.ID}`).then(res => {
          if (!res || res.Code !== 1) {
            this.$message.error("服务器关闭失败，请重试");
            return false;
          }
          this.$message({
            message: "服务器正在关闭",
            type: "success"
          });
          // 设置定时器
          row.time = 60;
          let myInterval = setInterval(() => {
            if (row.time <= 0) {
              clearInterval(myInterval);
              this.getStateData();
            } else {
              row.time--;
              this.$set(row, "time", row.time);
              this.$set(this.tableData, index, row);
            }
          }, 1000);
        });
      }
    }
  };
</script>

<style scoped lang='less'>
  .server_content {
    .open {
      position: fixed;
      top: 40%;
      right: 260px;
      z-index: 999;
    }

    .close {
      position: fixed;
      top: 40%;
      right: 10px;
      z-index: 999;
    }
  }
</style>