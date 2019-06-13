<template>
    <div class="common_content">
        <el-table :data="tableData" style="width: 100%" border stripe :show-overflow-tooltip="true" class="content_table">
            <el-table-column align="center" prop="ServerID" label="ServerID" width="150"></el-table-column>
            <el-table-column align="center" prop="ServerName" label="ServerName" min-width="100"></el-table-column>
            <el-table-column align="center" prop="Area" label="Area" min-width="100"></el-table-column>
            <el-table-column align="center" prop="ExterIP" label="ExterIP" min-width="120"></el-table-column>
            <el-table-column align="center" prop="AndroidMinVersion" label="AndroidMinVersion" min-width="120"></el-table-column>
            <el-table-column align="center" prop="AndroidMaxVersion" label="AndroidMaxVersion" min-width="120"></el-table-column>
            <el-table-column align="center" prop="IOSMinVersion" label="IOSMinVersion" min-width="120"></el-table-column>
            <el-table-column align="center" prop="IOSMaxVersion" label="IOSMaxVersion" min-width="120"></el-table-column>
        </el-table>
    </div>
</template>
<script>
    import api from '@/utils/api'
    export default {
        name: "Version",
        data() {
            return {
                tableData: [], //表格数据
            };
        },
        mounted() {
            this.getData()
        },
        methods: {
            // 获取初始数据
            async getData() {
                let res = await this.$http.get(api.version)
                if (res && res.Code === 1) {
                    this.tableData = res.Data.versionInfoList || [];
                }
            },
        }
    };
</script>