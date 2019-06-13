<template>
  <div class="common_page activity_edit">
    <div class="title addHeader">Edit A Profile</div>
    <hr>
    <div class="common_args">
      <el-row>
        <el-col :span="8" :xs="24">
          <div>
            <label>groupid</label>
            <span>{{activityInfo.GroupID}}</span>
          </div>
        </el-col>
        <el-col :span="8" :xs="24">
          <div>
            <label>comment</label>
            <span class="commentInput">
              <el-input type="textarea" v-model="activityInfo.Comment" clearable placeholder="Comment"></el-input>
            </span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" :xs="24">
          <label>serverList</label>
          <span class="serverCheck">
            <el-scrollbar style="height: 100%">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="activityInfo.ServerIDList">
                <el-checkbox v-for="(item,index) in activitySelect.serverList" :label="item" :key="index">{{item}}</el-checkbox>
              </el-checkbox-group>
            </el-scrollbar>
          </span>
        </el-col>
      </el-row>
      <div class="operate_btn">
        <el-button type="primary" @click="handleEdit">提交</el-button>
        <el-button type="plain" @click="outExcel">导出</el-button>
      </div>
    </div>
    <el-card class="box-card">
      <el-collapse v-model="activeNames">
        <el-collapse-item :name="index" v-for="(item,index) in activityInfo.ActiveList" :key="index">
          <template slot="title">Activity {{index+1}}</template>
          <div class="activity_item">
            <div class="info_title">BASE PARAMS</div>
            <div class="info_content">
              <el-row>
                <el-col :span="8" :xs="24">
                  <div>
                    <label>Activity Type</label>
                    <span>{{reverseType('activityTypeSelect',item.ActivityType)}}</span>
                  </div>
                </el-col>
                <el-col :span="8" :xs="24">
                  <div>
                    <label>Reference Type</label>
                    <span>{{reverseType('referenceTypeSelect',item.ReferenceType)}}</span>
                  </div>
                </el-col>
                <el-col :span="8" :xs="24">
                  <div>
                    <label>Time</label>
                    <span v-if="item.ReferenceType==1">
                      {{formatUtc(item.TimeArg1*1000)}} -
                      {{formatUtc(item.TimeArg2*1000)}}
                    </span>
                    <span v-else>{{item.TimeArg1}}—{{item.TimeArg2}}</span>
                  </div>
                </el-col>
                <el-col :span="8" :xs="24">
                  <div>
                    <label>Ahead</label>
                    <span>{{item.Ahead}}</span>
                  </div>
                </el-col>
                <el-col :span="8" :xs="24">
                  <div>
                    <label>Delay</label>
                    <span>{{item.Delay}}</span>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="info_title">CLIENT PARAMS</div>
            <div class="info_content">
              <el-row>
                <el-col :span="12" :xs="24" v-for="(clientItem,index) in item.ClientParams" :key="index">
                  <div class="clientItem">
                    <label>{{clientItem.Key}}</label>
                    <span v-if="clientItem.Key=='INT_ACTIVITIES_TYPE'">{{reverseType('INT_ACTIVITIES_TYPESelect',clientItem.Value)}}</span>
                    <span v-else>{{clientItem.Value}}</span>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="info_title">ACTION PARAMS</div>
            <div class="info_content">
              <el-row>
                <el-col :span="8" :xs="24" v-for="(actionItem,index) in item.ActionParams" :key="index">
                  <div>
                    <label>{{actionItem.Key}}</label>
                    <span v-if="actionItem.Key=='shopId'">{{reverseType('activityShopSelect',actionItem.Value)}}</span>
                    <span v-else-if="actionItem.Key=='rankListId'">{{reverseType('activityRankTypeSelect',actionItem.Value)}}</span>
                    <span v-else-if="actionItem.Key=='rewardgroup'">{{reverseType('activityRankRewardSelect',actionItem.Value)}}</span>
                    <span v-else-if="actionItem.Key=='rankName'">{{reverseType('activityRankNameSelect',actionItem.Value)}}</span>
                    <span v-else-if="actionItem.Key=='taskmailTitle'">{{reverseType('activityMailTitleSelect',actionItem.Value)}}</span>
                    <span v-else-if="actionItem.Key=='tasklimit_type'">{{reverseType('activityTaskLimiteSelect',actionItem.Value)}}</span>
                    <span v-else-if="actionItem.Key=='tasklimit_range1'">{{reverseType('activityRangeTypeSelect',actionItem.Value)}}</span>
                    <span v-else-if="actionItem.Key=='tasklimit_recordtype'">{{reverseType('activityRecordTypeSelect',actionItem.Value)}}</span>
                    <span v-else>{{actionItem.Value}}</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" @closed="handleClose">
      <div v-if="setResults.addSuccessServerIDList">添加成功的服务器：{{setResults.addSuccessServerIDList.join(",")}}</div>
      <div v-if="setResults.addFailedServerIDList">添加失败的服务器：{{setResults.addFailedServerIDList.join(",")}}</div>
      <div v-if="setResults.delSuccessServerIDList">删除成功的服务器：{{setResults.delSuccessServerIDList.join(",")}}</div>
      <div v-if="setResults.delFailedServerIDList">删除失败的服务器：{{setResults.delFailedServerIDList.join(",")}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import api from "@/utils/api";
  import { formatUtc ,_debounce} from "@/utils/auth";
  import { dealAndOutExcel } from "@/excel/dealOutData";
  export default {
    name: "activityEdit",
    data() {
      return {
        activeNames: "",
        activityInfo: {},
        activitySelect: {},
        checkAll: false,
        isIndeterminate: true,
        setResults: {},
        dialogVisible: false
      };
    },
    mounted() {
      this.getParams();
      this.getData();
    },
    methods: {
      // 获取下拉数据
      async getData() {
        let res = await this.$http.get(api.activeEdit);
        if (res && res.Code === 1) {
          this.activitySelect = res.Data;
        }
      },

      // 获取传入参数
      getParams() {
        let actInfo = this.$route.query;
        actInfo.ServerIDList =
          actInfo.ServerIDList == "null" ? [] : JSON.parse(actInfo.ServerIDList);
        actInfo.ActiveList = JSON.parse(actInfo.activities);
        this.activityInfo = actInfo;
      },

      // 转换类型
      reverseType(selcet, data) {
        let list = [];
        if (this.activitySelect[selcet]) {
          list = JSON.parse(JSON.stringify(this.activitySelect[selcet]));
        }
        for (let item of list) {
          if (item.Type == data) {
            return item.Des;
          }
        }
        return data;
      },

      // 全选
      handleCheckAllChange(val) {
        this.activityInfo.ServerIDList = val
          ? this.activitySelect.serverList
          : [];
        this.isIndeterminate = false;
      },

      // 编辑
      handleEdit() {
        this.$confirm("请确认是否修改?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.editSubmit();
        });
      },

      // 提交编辑
      editSubmit:_debounce(function() { 
        let data = {
          GroupID: Number(this.activityInfo.GroupID),
          ServerIDList: this.activityInfo.ServerIDList
          // Comment:this.activityInfo.Comment
        };
        this.$http.post(api.actEditSubmit, data).then(res => {
          if (res && res.Code === 1) {
            this.$message({
              message: "编辑成功",
              type: "success"
            });
            this.setResults = res.Data;
            this.dialogVisible = true;
          }
        });
      },500),
      
      // 导出
      outExcel:_debounce(function() {
        dealAndOutExcel(this.activityInfo);
      },500),

      handleClose() {
        this.$router.push({
          name: "activity",
          params: {
            timeType: this.activityInfo.timeType
          }
        });
      },
      formatUtc(time) {
        return formatUtc(time);
      }
    }
  };
</script>
<style lang="less" scoped>
  @import url("./edit.less");
</style>
<style lang="less">
  .activity_edit {
    .el-collapse-item__header {
      text-align: center;
      font-size: 16px;
      font-weight: 600;
    }

    .common_args {
      .el-row {
        margin: 20px 0;
      }
    }
  }
</style>