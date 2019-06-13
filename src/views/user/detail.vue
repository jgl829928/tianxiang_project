<template>
  <div class="common_content">
    <!-- BASE INFO -->
    <div class="frame">
      <div class="frameTop">
        <span class="frameName">BASE INFO</span>
      </div>
      <div class="frameDiv">
        <table class="tables first_table">
          <tr>
            <td>Name</td>
            <td>{{baseInfo.Name}}</td>
          </tr>
          <tr>
            <td>RID</td>
            <td>{{baseInfo.RID}}</td>
          </tr>
          <tr>
            <td>Admin OP</td>
            <td>
              <el-button type="success" plain class="common_btn" @click="getData">Refresh</el-button>
            </td>
          </tr>
          <tr>
            <td>Ban</td>
            <td>
              <span class="ban_state">{{baseInfo.Ban}}</span>
              <el-button type="danger" class="common_btn" @click="ban">Ban</el-button>
            </td>
          </tr>
          <tr>
            <td>Mute</td>
            <td>
              <el-date-picker v-model="muteTime" type="datetime" placeholder="选择日期时间" value-format="timestamp">
              </el-date-picker>
              <el-button type="primary" class="mute_btn" @click="mute">Mute</el-button>
            </td>
          </tr>
          <tr>
            <td>super</td>
            <td class="special_layout">
              <el-select v-model="superGrade" placeholder="请选择">
                <el-option label="0" value="0"></el-option>
                <el-option label="1" value="1"></el-option>
              </el-select>
              <el-button type="primary" class="mute_btn" @click="changeSuper">super</el-button>
            </td>
          </tr>
        </table>
        <table class="tables">
          <tr>
            <td>AppName</td>
            <td>{{baseInfo.AppName}}</td>
          </tr>
          <tr>
            <td>LoginIP</td>
            <td>{{baseInfo.LoginIP}}</td>
          </tr>
          <tr>
            <td>OSVersion</td>
            <td>{{baseInfo.OSVersion}}</td>
          </tr>
          <tr>
            <td>Amount</td>
            <td>${{baseInfo.Amount}}</td>
          </tr>
          <tr>
            <td>IsOnline</td>
            <td>{{baseInfo.IsOnline}}</td>
          </tr>
          <tr>
            <td>GMAccount</td>
            <td class="special_layout" v-if="baseInfo.GMAccount">
              <span>{{baseInfo.GMAccount}}</span>
              <el-button type="primary" class="mute_btn" @click="cancelGmAccess">cancel</el-button>
            </td>
            <td v-else>
              <el-button type="primary" class="mute_btn" @click="getGmAccess">gmaccess</el-button>
            </td>
          </tr>
        </table>
        <table class="tables">
          <tr>
            <td>UID</td>
            <td>{{baseInfo.UID}}</td>
          </tr>
          <tr>
            <td>AppVersion</td>
            <td>{{baseInfo.AppVersion}}</td>
          </tr>
          <tr>
            <td>LoginCount</td>
            <td>{{baseInfo.LoginCount}}</td>
          </tr>
          <tr>
            <td>LastLogin</td>
            <td>{{baseInfo.LastLogin|moment("YYYY-MM-DD HH:mm:ss")}}</td>
          </tr>
          <tr>
            <td>Country</td>
            <td>{{baseInfo.Country}}</td>
          </tr>
        </table>
        <table class="tables">
          <tr>
            <td>Channel</td>
            <td>--</td>
          </tr>
          <tr>
            <td>Campaign</td>
            <td>--</td>
          </tr>
          <tr>
            <td>X</td>
            <td>{{baseInfo.X}}</td>
          </tr>
          <tr>
            <td>Y</td>
            <td>{{baseInfo.Y}}</td>
          </tr>
          <tr>
            <td>CityLevel</td>
            <td>{{baseInfo.CityLevel}}</td>
          </tr>
        </table>
      </div>
    </div>
    <!-- LEAGUE INFO -->
    <div class="frame">
      <div class="frameTop">
        <span class="frameName">LEAGUE INFO</span>
      </div>
      <div class="frameDiv">
        <table class="tables special_tab">
          <tr>
            <td>LID</td>
            <td>{{baseInfo.LID}}</td>
            <td>LName</td>
            <td>{{baseInfo.LName}}</td>
            <td>Position</td>
            <td>{{baseInfo.Position}}</td>
          </tr>
        </table>
      </div>
    </div>
    <!-- RES INFO -->
    <div class="frame">
      <div class="frameTop">
        <span class="frameName">RES INFO</span>
      </div>
      <div class="frameDiv">
        <table class="tables layout_tab">
          <tr>
            <td>Gold</td>
            <td>{{baseInfo.Gold}}</td>
          </tr>
          <tr>
            <td>NSteel</td>
            <td>{{baseInfo.NSteel}}</td>
          </tr>
          <tr>
            <td>NOil</td>
            <td>{{baseInfo.NOil}}</td>
          </tr>
          <tr>
            <td>NRubber</td>
            <td>{{baseInfo.NRubber}}</td>
          </tr>
          <tr>
            <td>NAmmo</td>
            <td>{{baseInfo.NAmmo}}</td>
          </tr>
        </table>
        <table class="tables layout_tab">
          <tr>
            <td>--</td>
            <td>--</td>
          </tr>
          <tr>
            <td>PSteel</td>
            <td>{{baseInfo.PSteel}}</td>
          </tr>
          <tr>
            <td>POil</td>
            <td>{{baseInfo.POil}}</td>
          </tr>
          <tr>
            <td>PRubber</td>
            <td>{{baseInfo.PRubber}}</td>
          </tr>
          <tr>
            <td>PAmmo</td>
            <td>{{baseInfo.PAmmo}}</td>
          </tr>
        </table>
      </div>
    </div>
    <!-- TROOPS INFO -->
    <div class="frame">
      <div class="frameTop">
        <span class="frameName">TROOPS INFO</span>
      </div>
      <div class="frameDiv">
        <el-table :data="baseInfo.ArmyList" style="width: 100%" border class="level_tab" max-height="200">
          <el-table-column prop="ArmyType" align="center" label="ArmyType"></el-table-column>
          <el-table-column prop="Name" align="center" label="Name"></el-table-column>
          <el-table-column prop="HealCount" align="center" label="HealCount"></el-table-column>
          <el-table-column prop="HurtCount" align="center" label="HurtCount"></el-table-column>
        </el-table>
      </div>
    </div>
    <!-- HEROES INFO -->
    <div class="frame">
      <div class="frameTop">
        <span class="frameName">HEROES INFO</span>
      </div>
      <div class="frameDiv">
        <el-table :data="baseInfo.HeroList" style="width: 100%" border class="level_tab" max-height="300">
          <el-table-column prop="HID" align="center" label="HID"></el-table-column>
          <el-table-column prop="HType" align="center" label="Type"></el-table-column>
          <el-table-column prop="Name" align="center" label="Name"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="frame">
      <div class="frameTop">
        <span class="frameName">ORDER INFO</span>
      </div>
      <div class="frameDiv">
        <el-table :data="baseInfo.Order" style="width: 100%" border class="level_tab" max-height="300">
          <el-table-column prop="OrderID" align="center" label="OrderID"></el-table-column>
          <el-table-column prop="Amount" align="center" label="Amount">
            <template slot-scope="scope">${{scope.row.Amount}}</template>
          </el-table-column>
          <el-table-column prop="PackageID" align="center" label="PackageID"></el-table-column>
          <el-table-column prop="PackageName" align="center" label="PackageName"></el-table-column>
          <el-table-column prop="Platform" align="center" label="Platform"></el-table-column>
          <el-table-column prop="ProductID" align="center" label="ProductID"></el-table-column>
          <el-table-column prop="PurchaseTime" align="center" label="PurchaseTime"></el-table-column>
        </el-table>
      </div>
    </div>
    <!--  SystemMail -->
    <div class="frame mailFrame">
      <div class="frameTop">
        <span class="frameName">SystemMail</span>
      </div>
      <div>
        <el-form class="add_form" ref="reqForm" label-width="100px" :inline="true" label-position="right"
          :model="reqData">
          <el-row>
            <el-col :span="8" :xs="24">
              <el-form-item label="Title" prop="title">
                <el-input v-model="reqData.title" placeholder="请输入标题"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="24">
              <el-form-item label="SubTitle" prop="subtitle">
                <el-input v-model="reqData.subtitle" placeholder="请输入副标题"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="24">
              <el-form-item label="Content" prop="content">
                <el-input type="textarea" v-model="reqData.content" placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-for="(item, index) in reqData.mailList" :key="index">
            <el-col :span="8" :xs="24">
              <el-form-item label="Item Class" :prop="'mailList.' + index + '.class'"
                :rules="[{ required: true, message: '请输入道具种类', trigger: 'change' }]">
                <el-select v-model="item.class" placeholder="请选择" @change="classChange(item.class,index)"
                  class="select">
                  <el-option v-for="(item, index) in classList" :key="index" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Item Type" :prop="'mailList.' + index + '.type'"
                :rules="[{ required: true, message: '请输入道具具体类型', trigger: 'change' }]">
                <el-select v-model="item.type" placeholder="请选择">
                  <el-option v-for="(items, index) in item.typeList" :key="index" :label="items.Name"
                    :value="items.Type"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Count" :prop="'mailList.' + index + '.count'"
                :rules="[{ required: true, message: '请输入数量', trigger: 'blur' },{pattern: /^(-)?[1-9][0-9]*$/,message: '发送道具数量不能为0',trigger: 'blur'}]">
                <el-input-number v-model="item.count" controls-position="right" :max="1000000" :min="-1000000">
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="edit_options">
              <el-button type="success" icon="el-icon-plus" circle size="mini" @click="add(index)"></el-button>
              <el-button type="danger" icon="el-icon-minus" circle size="mini" @click="remove(index)"></el-button>
            </el-col>
          </el-row>
          <div class="send_btn">
            <p class="error_message">{{error_msg}}</p>
            <el-button type="success" plain @click="send('reqForm')">Send To Role</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <div class="common_dialog">
      <el-dialog title="Send To Role" :visible.sync="send_dialog">
        <el-form label-width="80px" :inline="true" label-position="right" class="add_form">
          <el-row>
            <el-col :span="12" :xs="24" v-if="reqData.title">
              <el-form-item label="Title" prop="title">
                <el-input v-model="reqData.title" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24" v-if="reqData.subtitle">
              <el-form-item label="SubTitle" prop="subtitle">
                <el-input v-model="reqData.subtitle" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" :xs="24" v-if="reqData.content">
              <el-form-item label="Content" prop="content" class="email_content">
                <el-input type="textarea" v-model="reqData.content" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table ref="multipleTable" :data="sendData" :select-on-indeterminate="true" tooltip-effect="dark"
          style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" width="55"></el-table-column>
          <el-table-column prop="name" align="center" label="type" min-width="300"></el-table-column>
          <el-table-column prop="count" align="center" label="count"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="send_dialog = false">取 消</el-button>
          <el-button type="primary" @click="confirm_send" :disabled="isDisable">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import api from "@/utils/api";
  import { _debounce } from "@/utils/auth";
  export default {
    name: "UserDetail",
    data() {
      return {
        id: "", // 用户ID
        uid: "",//用户uid

        muteTime: "", // 设置mutetime
        superGrade: "", //设置用户等级
        leagueData: [],
        baseInfo: {},

        reqData: {
          mailList: [{ class: "", type: "", count: "", typeList: [] }],
          title: "",
          subtitle: "",
          content: "",
        },

        // 道具所有数据
        allData: {},
        // 道具种类
        classList: [],

        send_dialog: false,
        isRepeat: false,
        error_msg: "",
        sendData: [],
        multipleSelection: [],

        isDisable: false,
      };
    },
    mounted() {
      this.getData();
    },
    methods: {
      // 初始化数据
      async getData() {
        this.id = this.$route.query.id;
        let res = await this.$http.get(`${api.userInfo}?rid=${this.id}`);
        if (res && res.Code === 1) {
          let data = res.Data;

          // 所有基础数据
          if (data.role) {
            this.baseInfo = JSON.parse(data.role);
            this.baseInfo.Order = JSON.parse(this.baseInfo.Order);
            this.uid = this.baseInfo.UID
          }
          if (data.usr) {
            let usr = JSON.parse(data.usr);
            this.baseInfo.Ban = usr.Ban;
            this.baseInfo.GMAccount = usr.GMAccount || "";
            this.baseInfo.Mute = new Date(usr.Mute).getTime();
            this.superGrade = usr.Super;
          }
          this.muteTime = new Date(this.baseInfo.Mute).getTime();

          // 所有道具信息
          this.allData = data.item;
          for (let key in this.allData) {
            this.classList.push(key);
          }
        }
      },
      // 添加一行数据
      add(index) {
        let mailItem = {
          class: "",
          type: "",
          count: "",
          typeList: []
        };
        this.reqData.mailList.splice(index + 1, 0, mailItem);
      },
      // 删除一行数据
      remove(index) {
        if (index !== 0) {
          this.reqData.mailList.splice(index, 1);
        }
      },
      // 种类改变
      classChange(className, index) {
        this.reqData.mailList[index].type = "";
        if (this.allData.hasOwnProperty(className)) {
          this.reqData.mailList[index].typeList = this.allData[className];
        }
      },

      // 禁言
      ban: _debounce(async function () {
        let ban = !this.baseInfo.Ban;
        let res = await this.$http.get(
          `${api.userBan}?rid=${this.id}&ban=${ban}`
        );
        if (res && res.Code === 1) {
          this.getData();
        }
      }, 500),
      // 改变时间
      mute: _debounce(async function () {
        let res = await this.$http.get(
          `${api.userMute}?rid=${this.id}&mute=${this.muteTime / 1000}`
        );
        if (res && res.Code === 1) {
          this.getData();
        }
      }, 500),
      // 取消gm权限
      cancelGmAccess: _debounce(async function () {
        let res = await this.$http.get(
          `${api.userGmcancel}?uid=${this.uid}`
        );
        if (res && res.Code === 1) {
          this.getData();
        }
      }, 500),
      // 获取gm权限
      getGmAccess: _debounce(async function () {
        let res = await this.$http.get(
          `${api.userGmAccess}?uid=${this.uid}`
        );
        if (res && res.Code === 1) {
          this.getData();
        }
      }, 500),
      // 改变super
      changeSuper: _debounce(async function () {
        let res = await this.$http.get(
          `${api.userSuper}?super=${this.superGrade}&rid=${this.id}`
        );
        if (res && res.Code === 1) {
          this.$message({
            message: "权限修改成功",
            type: "success",
            duration: 1000
          });
        }
      }, 500),
      // 点击发送道具进行数据处理
      async send(formName) {
        this.$refs[formName].validate(async valid => {
          if (!valid) return false;
          this.sendData = JSON.parse(JSON.stringify(this.reqData.mailList));
          //  判断重复;
          let typeid = [];
          this.isRepeat = false;
          for (let item of this.sendData) {
            if (!typeid.includes(item.type)) {
              typeid.push(item.type);
            } else {
              this.isRepeat = true;
              this.error_msg = "道具重复！！！ 请检查后重新发送";
              return;
            }
            for (let typeItem of item.typeList) {
              if (item.type === typeItem.Type) {
                item.name = typeItem.Name;
              }
            }
            delete item.typeList;
            delete item.class;
          }
          // 数据无重复,打开弹框进行勾选
          if (!this.isRepeat) {
            this.send_dialog = true;
            this.error_msg = "";
          }
        });
      },
      // 多选
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 确认发送道具
      confirm_send: _debounce(async function () {
        let data = this.multipleSelection;
        if (data.length != this.sendData.length) {
          this.$message.error("有未选择的道具,请检查后重新发送");
          return false;
        }

        data.map(item => {
          delete item.name;
        });
        let param = {
          rid: parseInt(this.id),
          items: data,
          title: this.reqData.title,
          subtitle: this.reqData.subtitle,
          content: this.reqData.content,
        };
        this.isDisable = true;
        let res = await this.$http.post(api.userSend, param);
        if (res) {
          this.isDisable = false;
        }
        if (res && res.Code === 1) {
          this.$message({
            message: "发送成功",
            type: "success",
            duration: 1000
          });
          this.send_dialog = false;
        }
      }, 500)
    }
  };
</script>
<style lang="less" scoped>
  @import url("./detail.less");
</style>
<style lang="less">
  @import url("./ele_detail.less");
</style>