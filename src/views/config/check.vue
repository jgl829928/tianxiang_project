<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>CHECK INFO</span>
    </div>
    <div class="box-content">
      <el-collapse v-model="activeVal" accordion @change="handleChange">
        <el-collapse-item :title="item.FileName" :name="index" v-for="(item,index) in alldata" :key="index">
          <el-row>
            <el-col :span="12" :xs="24">
              <div class="table_content">
                <div class="table_title">OldFile</div>
                <el-table :data="item.oldPageFile" border class="old_table">
                  <el-table-column :label="data" v-for="(data, key) in item.oldHead" :key="key">
                    <template slot-scope="scope">
                      <div class="td_item" :title="item.oldPageFile[scope.$index][key].value">
                        <span :class="item.oldPageFile[scope.$index][key].class?'':'red_font'">{{item.oldPageFile[scope.$index][key].value}}</span>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-col>
            <el-col :span="12" :xs="24">
              <div class="table_content">
                <div class="table_title">NewFile</div>
                <el-table :data="item.newPageFile" border class="new_table">
                  <el-table-column :label="data" v-for="(data, key) in item.newHead" :key="key">
                    <template slot-scope="scope">
                      <div class="td_item" :title="item.newPageFile[scope.$index][key].value">
                        <span :class="item.newPageFile[scope.$index][key].class?'':'red_font'">{{item.newPageFile[scope.$index][key].value}}</span>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-col>
          </el-row>
          <div class="page" v-if="item.totalpage>1">
            <el-pagination layout="prev, pager, next" background :total="item.totalpage*10" @current-change="pageChange"></el-pagination>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-card>
</template>
<script>
  export default {
    name: "CheckFile",
    props: ["alldata", "clear"],
    data() {
      return {
        activeVal: "",
        count: [],
        pageCell: 100
      };
    },
    watch: {
      clear: {
        handler(newValue, oldValue) {
          if (newValue != oldValue) {
            this.activeVal = "";
            this.count = [];
          }
        },
        deep: true
      }
    },
    methods: {
      // 比较两文件
      compare(OldFile, NewFile) {
        let tempData = [];
        for (let i in OldFile) {
          let item = [];
          for (let j in OldFile[i]) {
            let temp = {
              value: OldFile[i][j],
              class: true
            };
            if (!NewFile[i] || OldFile[i][j] != NewFile[i][j]) {
              temp.class = false;
            }
            item.push(temp);
          }
          tempData.push(item);
        }
        tempData.splice(0, 1);
        return tempData;
      },
      // 折叠面板打开
      handleChange(val) {
        if (!val && val !== 0) return false;
        if (this.count.includes(val)) {
          return false;
        } else {
          this.count.push(val);
        }
        let data = this.alldata[val];
        data.oldHead = data.OldFile[0];
        data.newHead = data.NewFile[0];
        let OldFile = this.compare(data.OldFile, data.NewFile);
        let NewFile = this.compare(data.NewFile, data.OldFile);
        data.OldFile = JSON.parse(JSON.stringify(OldFile));
        data.NewFile = JSON.parse(JSON.stringify(NewFile));

        let oldlength = data.OldFile.length;
        let newlength = data.NewFile.length;
        data.totalpage =
          oldlength >= newlength
            ? oldlength / this.pageCell
            : newlength / this.pageCell;

        data.oldPageFile = data.OldFile.slice(0, this.pageCell);
        data.newPageFile = data.NewFile.slice(0, this.pageCell);
      },
      // 翻页
      pageChange(val) {
        let data = this.alldata[this.activeVal];
        let start = (val - 1) * this.pageCell;
        let end = start + this.pageCell;
        data.oldPageFile = data.OldFile.slice(start, end);
        data.newPageFile = data.NewFile.slice(start, end);
        this.$set(this.alldata, this.activeVal, data);
      }
    }
  };
</script>
<style scoped lang="less">
  .box-card {
    .table_content {
      text-align: center;

      .table_title {
        width: 100%;
        height: 40px;
        line-height: 40px;
        background: #f4f8fb;
      }

      .td_item {
        height: 20px;
      }

      .old_table {
        border-right: 0.5px solid #e5e5e5;
      }

      .new_table {
        border-left: 0.5px solid #e5e5e5;
      }
    }

    .clearfix {
      text-align: center;
    }

    .red_font {
      color: red;
      font-weight: 600;
    }

    .page {
      text-align: center;
      margin-top: 20px;
    }
  }
</style>
<style lang="less">
  .box-card {
    .el-card__header {
      background: #f2f2f2;
    }

    .table_content {
      .el-table--border td {
        padding: 6px;
      }
    }
  }
</style>