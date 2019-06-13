<template>
    <div class="operation_content">
        <!-- 查询项 -->
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
        </el-form>
        <div class="operate_btn">
            <el-button type="primary" icon="el-icon-search" @click="search">search</el-button>
            <el-button type="plain" icon="el-icon-refresh" @click="resetForm('reqData')">reset</el-button>
        </div>
        <div class="download_btn">
            <el-button type="success" icon="el-icon-download" @click="download" plain :disabled="tableData.length <= 0">
                download</el-button>
        </div>
        <div>
            <!-- 数据表格 -->
            <el-table :data="tableData" border show-summary style="width: 100%" stripe :show-overflow-tooltip="true" v-loading="loading"
                :summary-method="getSummaries" max-height="600">
                <el-table-column prop="QueryZoneList" label="区服"></el-table-column>
                <el-table-column prop="QueryPlatformList" label="平台"></el-table-column>
                <el-table-column prop="date" label="日期"></el-table-column>
                <el-table-column prop="Amount" label="收入"></el-table-column>
                <el-table-column prop="ChargeUserCount" label="付费用户数"></el-table-column>
                <el-table-column prop="payRate" label="用户付费率"></el-table-column>
                <el-table-column prop="NewUserCount" label="新增用户数"></el-table-column>
                <el-table-column prop="ActiveUserCount" label="DAU"></el-table-column>
                <el-table-column prop="RegisterChargeCount" label="当日注册付费人数"></el-table-column>
                <el-table-column prop="RegisterChargeAmount" label="当日注册付费额度"></el-table-column>
                <el-table-column prop="arpu" label="ARPU"></el-table-column>
                <el-table-column prop="arppu" label="ARPPU"></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    import api from "@/utils/api";
    import { allCountry, formatUtc, outexcel, add, divide, _debounce } from "@/utils/auth";
    export default {
        name: "Income",
        data() {
            return {
                isSeverIdte: true,
                serverCheckAll: false,
                isCountryIdte: true,
                countryCheckAll: false,
                serveList: [],
                allLang: [],
                reqData: {
                    StartUnix: "",
                    EndUnix: "",
                    ZoneList: [],
                    PlatformList: "",
                    CountryList: [],
                    time: []
                },
                tableData: [],
                decimalNum: 3,
                sumItem: {},
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

            // 搜索
            search: _debounce(function () {
                this.loading=true;
                let data = JSON.parse(JSON.stringify(this.reqData));

                let time = this.reqData.time;
                data.StartUnix = time && time.length > 0 ? Date.parse(time[0]) / 1000 : "";
                let usedTime = time && time.length > 0 ? Date.parse(time[1]) - Date.parse(time[0]) : 0; //两个时间戳相差的毫秒数
                data.Day = Math.ceil(usedTime / (24 * 3600 * 1000));
                delete data.time;
                delete data.EndUnix;

                data.CountryList = data.CountryList.map(item => {
                    return `'${item}'`;
                }).join(",");

                data.ZoneList = data.ZoneList.join(",");
                this.requestData(data);
            }, 500),

            async requestData(data) {
                let res = await this.$http.post(api.incomeInfo, data);
                if (!res || res.Code !== 1 || !res.Data.income) {
                    this.tableData = [];
                    return;
                }
                this.loading=false;
                let tableData = res.Data.income.sort((a, b) => {
                    return b.Unix - a.Unix;
                });
                this.tableData = this.dealTableData(tableData);
            },

            dealTableData(data) {
                if (!data || data.length <= 0) return false;

                data.map(item => {
                    if (item.QueryZoneList == "") {
                        item.QueryZoneList = "全服";
                    }

                    if (item.QueryPlatformList == "") {
                        item.QueryPlatformList = "ios，andriod";
                    }

                    item.arpu = divide(item.Amount, item.ActiveUserCount).toFixed(this.decimalNum);

                    item.payRate = (divide(item.ChargeUserCount, item.ActiveUserCount) * 100).toFixed(this.decimalNum)+"%";

                    item.arppu = divide(item.Amount, item.ChargeUserCount).toFixed(this.decimalNum);

                    item.date = formatUtc(item.Unix * 1000, false).split(" ")[0];
                });

                return data;
            },

            // 合计
            getSummaries(param) {
                const { columns, data } = param;

                if (!data || data.length <= 0) return [];

                const sums = [],
                    sumItem = {};

                columns.forEach((column, index) => {
                    if (column.property === "arpu") return;
                    if (column.property === "arppu") return;
                    if (column.property === "payRate") return;

                    if (index === 0) {
                        sums[index] = "合计";
                        return;
                    }

                    const values = data.map(item => Number(item[column.property]));

                    if (values.every(value => isNaN(value))) {
                        sums[index] = "N/A";
                        return;
                    }

                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value)) {
                            return add(prev, curr);
                        } else {
                            return prev;
                        }
                    }, 0);

                    sums[index] = sums[index].toFixed(this.decimalNum);
                    sumItem[column.property] = sums[index];
                });

                columns.forEach((column, index) => {
                    switch (column.property) {
                        case "arpu":
                            sums[index] = divide(sumItem.Amount,sumItem.ActiveUserCount).toFixed(this.decimalNum);
                            break;
                        case "payRate":
                            sums[index] = (divide(sumItem.ChargeUserCount, sumItem.ActiveUserCount) * 100).toFixed(this.decimalNum) + "%";
                            break;
                        case "arppu":
                            sums[index] = divide(sumItem.Amount, sumItem.ChargeUserCount).toFixed(this.decimalNum);
                            break;
                        default: ;
                    }

                    sumItem[column.property] = sums[index];
                });

                this.sumItem = sumItem;

                return sums;
            },

            // 重置
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            // 导出excel
            download: _debounce(function () {
                let thead = [
                    "区服",
                    "平台",
                    "日期",
                    "收入",
                    "付费用户数",
                    "用户付费率",
                    "新增用户数",
                    "DAU",
                    "当日注册付费人数",
                    "当日注册付费额度",
                    "ARPU",
                    "ARPPU"
                ];
                let filter = [
                    "QueryZoneList",
                    "QueryPlatformList",
                    "date",
                    "Amount",
                    "ChargeUserCount",
                    "payRate",
                    "NewUserCount",
                    "ActiveUserCount",
                    "RegisterChargeCount",
                    "RegisterChargeAmount",
                    "arpu",
                    "arppu"
                ];
                let data = JSON.parse(JSON.stringify(this.tableData));
                data.push(this.sumItem);
                outexcel(thead, filter, data, "营收数据xls");
            }, 500)
        }
    };
</script>