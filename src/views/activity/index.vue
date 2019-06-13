<template>
    <div class="common_content activity_content">
        <el-tabs type="border-card" v-model="timeType" @tab-click="handleClick">
            <el-tab-pane v-for="(item,index) in typeSelect.referenceTypeSelect" :label="item.Des" :name="item.Type+''"
                :key="index"></el-tab-pane>
        </el-tabs>
        <div class="activity_table">
            <el-table :data="tableData" style="width: 100%" stripe :show-overflow-tooltip="true" max-height="780">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-table :data="props.row.activities" style="width: 100%" border class="activities_table"
                            max-height="280">
                            <el-table-column align="center" prop="Index" label="Index">
                            </el-table-column>
                            <el-table-column align="center" prop="ID" label="ID">
                            </el-table-column>
                            <el-table-column align="center" prop="Ahead" label="Ahead">
                            </el-table-column>
                            <el-table-column align="center" prop="Delay" label="Delay">
                            </el-table-column>
                            <el-table-column align="center" prop="ActivityType" label="ActivityType">
                                <template slot-scope="scope">
                                    <span>{{reverseType(scope.row.ActivityType)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="Time" label="Time">
                                <template slot-scope="scope">
                                    <span v-if="timeType==1">
                                        {{formatUtc(scope.row.TimeArg1*1000)}}-{{formatUtc(scope.row.TimeArg2*1000)}}
                                    </span>
                                    <span v-else>{{scope.row.TimeArg1}}-{{scope.row.TimeArg2}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="State" label="State" v-if="timeType==1">
                                <template slot-scope="scope">
                                    <span :class="[remainingTime(scope.row.TimeArg1,scope.row.TimeArg2)=='进行中'?'green_font':'red_font']">
                                        {{remainingTime(scope.row.TimeArg1,scope.row.TimeArg2)}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="GroupID" label="GroupID"></el-table-column>
                <el-table-column align="center" prop="ServerIDList" label="ServerIDList">
                    <template slot-scope="scope">
                        <span
                            v-if="scope.row.ServerIDList&&scope.row.ServerIDList.length>0">{{scope.row.ServerIDList.join(",")}}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="Comment" label="Comment"></el-table-column>
                <el-table-column align="center" label="Options" width="300">
                    <template slot-scope="scope">
                        <div>
                            <el-button @click="handleEdit(scope.row)" icon="el-icon-edit" type="primary" size="small">
                                edit</el-button>
                            <el-button @click="handleDelete(scope.row)" type="danger" size="small" plain>delete
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    import api from "@/utils/api";
    import { remainTime, formatUtc, _debounce } from "@/utils/auth"
    export default {
        name: "Actives",
        data() {
            return {
                typeSelect: {}, //类型下拉
                timeType: "1",  //时间类型
                tableData: [] //表格数据
            };
        },
        mounted() {
            this.getData();
        },
        methods: {
            // 获取下拉初始数据
            async getData() {
                this.timeType = this.$route.params.timeType ? this.$route.params.timeType : "1";
                let res = await this.$http.get(api.active);
                if (res && res.Code === 1) {
                    this.typeSelect = res.Data;
                }
                this.getTbaleData();
            },

            // 切换tab标签
            handleClick(val) {
                this.getTbaleData();
            },

            // 获取表格初始数据
            async getTbaleData() {
                let res = await this.$http.get(`${api.activeInfo}?referencetype=${this.timeType}`)
                if (res && res.Code === 1) {
                    this.tableData = [];
                    let activitygroups = res.Data.activitygroups;
                    for (let key in activitygroups) {
                        let data = activitygroups[key];
                        this.tableData.push({
                            Comment: data.Comment,
                            GroupID: key,
                            activities: data.Activities,
                            ServerIDList: data.Activities.length > 0 ? data.Activities[0].ServerInfoList : []
                        })
                    }
                }
            },

            // 根据时间计算活动状态
            remainingTime(stime, etime) {
                return remainTime(stime, etime)
            },

            // 转换类型
            reverseType(type) {
                for (let item of this.typeSelect.activityTypeSelect) {
                    if (item.Type == type) {
                        return item.Des
                    }
                }
                return type;
            },

            //  编辑
            handleEdit(row) {
                let actInfo = JSON.parse(JSON.stringify(row))
                actInfo.activities = JSON.stringify(actInfo.activities);
                actInfo.ServerIDList = JSON.stringify(actInfo.ServerIDList);
                actInfo.timeType = this.timeType;
                this.$router.push({
                    path: "/activities/edit",
                    query: actInfo
                })
            },

            //  删除
            handleDelete(row) {
                if (row.ServerInfoList && row.ServerInfoList.length > 0) {
                    this.$message("请先编辑服务器");
                    return;
                }
                this.$confirm('此操作将永久删除该活动, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let _that = this
                    _debounce(function () {
                        _that.deleteSubmit(row);
                    }, 500)()
                })

            },
            // 删除提交请求
            async deleteSubmit(row) {
                let data = {
                    GroupID: Number(row.GroupID)
                };
                let res = await this.$http.post(api.activeDelete, data)
                if (res && res.Code === 1) {
                    this.$message({
                        type: "success",
                        message: "删除成功!"
                    });
                    this.getTbaleData();
                }
            },
            formatUtc(time) {
                return formatUtc(time)
            }
        }
    };
</script>
<style lang="less" scoped>
    .activity_content {
        border: 1px solid #dcdfe6;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
        min-height: 850px;

        .activity_table {
            margin: 20px;

            .green_font {
                color: green;
                font-weight: 600;
            }

            .red_font {
                color: red;
                font-weight: 600;
            }
        }
    }
</style>
<style lang="less">
    .activity_content {
        .el-tabs--border-card {
            border: none;
            box-shadow: none;
        }

        .activities_table {
            tr th {
                background: #f5f7fa;
            }

            tbody tr:hover>td {
                background-color: #fff;
            }
        }

    }
</style>