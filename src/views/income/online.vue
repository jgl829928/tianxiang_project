<template>
    <div class="operation_content">
        <el-form ref="reqData" :model="reqData" class="demo-ruleForm" label-width="102px" :inline="true"
            label-position="right">
            <el-row>
                <el-col :span="8" :xs="24">
                    <el-form-item label="日期" prop="time">
                        <el-date-picker v-model="reqData.time" type="daterange" range-separator="至" 
                            start-placeholder="开始时间" :default-time="['00:00:00', '23:59:59']" end-placeholder="结束时间"
                            value-format="yyyy-MM-ddTHH:mm:ssZ"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8" :xs="24">
                    <el-form-item label="平台" prop="PlatformList">
                        <el-select v-model="reqData.PlatformList" clearable placeholder="Platform">
                            <el-option label="ios" value="ios"></el-option>
                            <el-option label="android" value="android"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" :xs="24">
                    <el-form-item label="区服" prop="ZoneList">
                        <div class="checkbox">
                            <el-scrollbar style="height: 100%">
                                <el-checkbox :indeterminate="isSeverIdte" v-model="serverCheckAll"
                                    @change="serverChange">全选</el-checkbox>
                                <el-checkbox-group v-model="reqData.ZoneList">
                                    <el-checkbox v-for="(item,index) in  serveList" :label="item" :key="index"
                                        :value="item"></el-checkbox>
                                </el-checkbox-group>
                            </el-scrollbar>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" :xs="24">
                    <el-form-item label="国家" prop="CountryList">
                        <div class="checkbox">
                            <el-scrollbar style="height: 100%">
                                <el-checkbox :indeterminate="isCountryIdte" v-model="countryCheckAll"
                                    @change="countryChange">全选</el-checkbox>
                                <el-checkbox-group v-model="reqData.CountryList">
                                    <el-checkbox v-for="(item,index) in  allLang" :label="item" :key="index">{{item}}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </el-scrollbar>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" :xs="24">
                    <el-form-item label="LTV" prop="LtvList">
                        <div class="checkbox">
                            <el-scrollbar style="height: 100%">
                                <el-checkbox :indeterminate="isLTVIdte" v-model="ltvCheckAll" @change="ltvChange">全选
                                </el-checkbox>
                                <el-checkbox-group v-model="reqData.LtvList">
                                    <el-checkbox v-for="(item,index) in  remainList" :label="item" :key="index">{{item}}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </el-scrollbar>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" :xs="24">
                    <el-form-item label="留存" prop="KeepDayList">
                        <div class="checkbox">
                            <el-scrollbar style="height: 100%">
                                <el-checkbox :indeterminate="isRemainIdte" v-model="remainCheckAll"
                                    @change="remainChange">全选</el-checkbox>
                                <el-checkbox-group v-model="reqData.KeepDayList">
                                    <el-checkbox v-for="(item,index) in  remainList" :label="item" :key="index">{{item}}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </el-scrollbar>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="operate_btn">
            <el-button type="primary" icon="el-icon-search" @click="search">search</el-button>
            <el-button type="plain" icon="el-icon-refresh" @click="resetForm('reqData')">reset</el-button>
        </div>
        <div class="download_btn">
            <el-button type="success" icon="el-icon-download" @click="download" plain :disabled="tableData.length <= 0">
                download</el-button>
        </div>
        <!-- 数据表格 -->
        <el-table :data="tableData" border style="width: 100%" max-height="600"  v-loading="loading">
            <el-table-column :label="data" v-for="(data, key) in tableHeads" :key="key" :prop="tableProps[key]">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import api from "@/utils/api";
    import { allCountry, formatUtc, outexcel, add, divide, _debounce } from "@/utils/auth";
    export default {
        name: "Online",
        data() {
            return {
                isSeverIdte: true,
                serverCheckAll: false,
                isCountryIdte: true,
                countryCheckAll: false,
                isLTVIdte: true,
                ltvCheckAll: false,
                isRemainIdte: true,
                remainCheckAll: false,
                serveList: [],
                allLang: [],
                ltvList: [1, 2, 3, 4, 5, 6, 7, 14, 15, 21, 30, 45, 60, 75, 90, 105, 120, 250, 180, 210, 270, 300, 330, 360, 390, 420, 450, 480, 510, 540, 570, 600, 630, 660, 690, 720],
                remainList: [1, 2, 3, 4, 5, 6, 7, 14, 15, 21, 30, 45, 60, 75, 90, 105, 120, 250, 180, 210, 270, 300, 330, 360, 390, 420, 450, 480, 510, 540, 570, 600, 630, 660, 690, 720],
                reqData: {
                    StartUnix: "",
                    ZoneList: [],
                    PlatformList: "",
                    CountryList: [],
                    time: [],
                    LtvList: [],
                    KeepDayList: [],
                    LoserList: [1, 3, 7],
                    BackUserList: [3, 7]
                },
                tableData: [],
                initHeads: ["区服", "平台", "日期", "PCU", "PCU-Time", "ACU", "活跃账号平均在线时长(分)", "回流用户数", "日新手引导完成数"],
                tableHeads: [],
                initProps: ["QueryZoneList", "QueryPlatformList", "Unix", "PCU", "PCUUnix", "ACUCount", "AvgOnlineCount", "BackUser", "NewPlayer"],
                tableProps: [],
                decimalNum: 3,
                loading:false,
            };
        },
        mounted() {
            this.getData();
            allCountry().then(value => {
                this.allLang = value;
            });
        },
        methods: {
            async getData() {
                let res = await this.$http.get(api.income);
                if (res && res.Code === 1) {
                    this.serveList = res.Data.incomelist;
                }
            },

            // 服务器全选
            serverChange(val) {
                this.reqData.ZoneList = val ? this.serveList : [];
                this.isSeverIdte = false;
            },

            // 国家全选
            countryChange(val) {
                this.reqData.CountryList = val ? this.allLang : [];
                this.isCountryIdte = false;
            },
            // ltv全选
            ltvChange(val) {
                this.reqData.LtvList = val ? this.ltvList : [];
                this.isLTVIdte = false;
            },
            // 留存全选
            remainChange(val) {
                this.reqData.KeepDayList = val ? this.remainList : [];
                this.isRemainIdte = false;
            },
            // 搜索
            search: _debounce(function () {
                this.loading=true;
                let data = JSON.parse(JSON.stringify(this.reqData));

                let time = this.reqData.time;
                data.StartUnix = time && time.length > 0 ? Date.parse(time[0]) / 1000 : "";
                let usedTime = time && time.length > 0 ? Date.parse(time[1]) - Date.parse(time[0]) : 0; //两个时间戳相差的毫秒数
                data.Day = Math.ceil(usedTime / (24 * 3600 * 1000));
                delete data.time;


                data.CountryList = data.CountryList.map(item => {
                    return `'${item}'`;
                }).join(",");

                data.ZoneList = data.ZoneList.join(",");

                this.requestData(data);
            }, 500),
            // 请求数据
            async requestData(data) {
                let res = await this.$http.post(api.incomeOnline, data);
                if (!res || res.Code !== 1 || !res.Data.online) {
                    this.tableData = [];
                    return;
                }
                this.loading=false;
                // 排序
                let tableData = res.Data.online.sort((a, b) => {
                    return b.Unix - a.Unix;
                });

                this.addHeadProps(tableData)
                this.tableData = this.dealTableData(tableData);
            },
            addHeadProps(data) {

                if (!data || data.length <= 0) return false;
                let firstItem = data[0]
                this.tableHeads = [];
                this.tableProps = [];
                let tableHeads = JSON.parse(JSON.stringify(this.initHeads))
                let tableProps = JSON.parse(JSON.stringify(this.initProps))
                if (firstItem.QueryLoserList && firstItem.QueryLoserList.length > 0) {
                    for (let item of firstItem.QueryLoserList) {
                        tableHeads.push(`(${item}日)流失率`)
                        tableProps.push(`Lose${item}`)
                    }
                }

                if (firstItem.QueryKeepList && firstItem.QueryKeepList.length > 0) {
                    for (let item of firstItem.QueryKeepList) {
                        tableHeads.push(`留存${item}`)
                        tableProps.push(`Keep${item}`)
                    }
                }

                if (firstItem.QueryLtvList && firstItem.QueryLtvList.length > 0) {
                    for (let item of firstItem.QueryLtvList) {
                        tableHeads.push(`LTV${item}`)
                        tableProps.push(`Ltv${item}`)
                    }
                }

                this.tableHeads = tableHeads;
                this.tableProps = tableProps;

            },

            // props
            dealTableData(data) {
                if (!data || data.length <= 0) return false;

                data.map((item, index) => {

                    if (item.QueryZoneList == "") {
                        item.QueryZoneList = "全服";
                    }

                    if (item.QueryPlatformList == "") {
                        item.QueryPlatformList = "ios，andriod";
                    }

                    item.PCUUnix = formatUtc(item.PCUUnix * 1000, false).split(" ")[1];
                    item.Unix = formatUtc(item.Unix * 1000, false).split(" ")[0];
                    item.BackUser = this.getBackUser(item.BackUserList)
                    item.NewPlayer=0;
                    item.NewPlayerNodeList && item.NewPlayerNodeList.length >= 0 ? item.NewPlayerNodeList.map(newPlyerItem => {
                        if(newPlyerItem.NodeID===10004){
                            item.NewPlayer= newPlyerItem.Count;
                        }
                    }) : ""
                    
                    item.KeepList && item.KeepList.length >= 0 ? item.KeepList.map(keepItem => {
                        item[`Keep${keepItem.Day}`] = (divide(keepItem.KeepUserCount, keepItem.NewUserCount) * 100).toFixed(this.decimalNum) + "%";
                    }) : ""

                    item.LtvList && item.LtvList.length >= 0 ? item.LtvList.map(ltvItem => {
                        item[`Ltv${ltvItem.Day}`] = (divide(ltvItem.Amount, ltvItem.NewUserCount)).toFixed(this.decimalNum);
                    }) : ""

                    item.LoserList && item.LoserList.length >= 0 ? item.LoserList.map(loseItem => {
                        item[`Lose${loseItem.Day}`] = (divide(loseItem.LoseUserCount, loseItem.ActiveUserCount) * 100).toFixed(this.decimalNum) + "%";
                    }) : ""
                });

                return data;
            },


            // 获取backuser总数
            getBackUser(data) {
                if (!data || data.length <= 0) return
                var result = 0;
                for (let i = 0; i < data.length; i++) {
                    result = add(result, data[i].BackUser);
                }
                return result
            },


            // 重置
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            // 下载
            download: _debounce(function () {
                let data = JSON.parse(JSON.stringify(this.tableData));
                outexcel(this.tableHeads, this.tableProps, data, "在线数据xls");
            }, 500),

        }
    };
</script>