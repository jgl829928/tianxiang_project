<template>
  <div class="common_content chat_content">
    <el-form class="c-search-form" ref="reqData" label-width="102px" :inline="true" label-position="right">
      <el-row>
        <el-col :span="8" :xs="24">
          <el-form-item label="Server ID" prop="serveList" min-width="120">
            <el-select v-model="serverId" clearable placeholder="Server ID">
              <el-option v-for="(item,index) in serveList" :label="item" :value="item" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :xs="24">
          <el-form-item label="groupId" prop="id">
            <el-select v-model="groupId" clearable placeholder="Channel ID">
              <el-option v-for="(item,index) in groupList" :label="item" :value="item" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" :xs="24">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">search</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Chat Message</span>
      </div>
      <div class="box-content">
        <el-scrollbar style="height: 100%" ref="myScrollbar">
          <div v-for="(item,index) in chatList" :key="index">
            <p class="serverId">SenderID：{{item.SenderID}}</p>
            <div class="chat">
              <div class="triangle-box">
                <div class="triangle"></div>
              </div>
              <div class="chatText">{{item.Content}}</div>
            </div>
            <p class="otherInfo">Group:{{item.GroupID}} {{item.SendUnix|moment("YYYY-MM-DD HH:mm:ss")}}</p>
          </div>
        </el-scrollbar>
      </div>
    </el-card>
  </div>
</template>

<script>
  import api from "@/utils/api";
  import { _debounce } from "@/utils/auth";
  export default {
    name: "Chat",
    data() {
      return {
        serveList: [],
        serverId: "",
        groupList: [0],
        groupId: "",
        chatList: [],
        url: "",
        ws: ""
      };
    },
    mounted() {
      this.getData();
    },
    beforeRouteLeave(to, from, next) {
      this.ws = "";
      next();
    },
    methods: {
      async getData() {
        let res = await this.$http.get(api.chat);
        if (res && res.Code === 1) {
          this.serveList = res.Data.serverlist;
          this.url = res.Data.url;
          this.search();
        }
      },
      search: _debounce(function () {
        let _this = this;
        _this.chatList = [];
        // 打开一个 web socket
        let request_type = location.protocol == "http:" ? "ws" : "wss";
        _this.ws = new WebSocket(`${request_type}://${_this.url}`);

        _this.ws.onopen = function () {
          // Web Socket 已连接上，使用 send() 方法发送数据
          let data = {
            MsgType: "login",
            ServerID: _this.serverId,
            GroupID: _this.groupID,
            Cookie: _this.$store.state.token
          };
          _this.ws.send(JSON.stringify(data));
        };
        // 返回数据
        _this.ws.onmessage = function (evt) {
          let received_msg = JSON.parse(evt.data);
          if (!received_msg.Data) return false;
          received_msg.Data.map(item => {
            _this.chatList.push(item);
            _this.groupList.push(item.GroupID);
          });
          _this.groupList = Array.from(new Set(_this.groupList));
          // 将滚动条滚动至最底部
          _this.$nextTick(() => {
            if (_this.$refs["myScrollbar"]) {
              _this.$refs["myScrollbar"].wrap.scrollTop =
                _this.$refs["myScrollbar"].wrap.scrollHeight;
            }
          });
        };
        // 报错处理
        _this.ws.onerror = function () {
          _this.$message.error("通信异常,获取聊天记录失败");
        };
      }, 500)
    }
  };
</script>

<style scoped lang="less">
  @import url("./index.less");
</style>
<style lang="less">
  .chat_content {
    .el-card__header {
      border-bottom: 1px solid #d5d7d7;
    }

    .el-card__body {
      padding: 0;
    }
  }
</style>