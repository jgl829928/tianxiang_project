<template>
    <div class="common_content">
        <el-table :data="tableData" style="width: 100%" border stripe :show-overflow-tooltip="true" class="content_table">
            <el-table-column align="center" prop="ID" label="ID" width="150"  >
            </el-table-column>
            <el-table-column align="center" prop="Name" label="Name" min-width="100">
            </el-table-column>
            <el-table-column align="center" prop="Phone" label="Phone" min-width="100">
            </el-table-column>
            <el-table-column align="center" prop="Email" label="Email" min-width="120">
            </el-table-column>
            <el-table-column align="center" prop="Position" label="Position" min-width="120">
            </el-table-column>
            <el-table-column align="center" prop="CreatedBy" label="CreatedBy" min-width="120">
            </el-table-column>
            <el-table-column align="center" prop="LastLogin" label="LastLogin" min-width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.LastLogin|moment("YYYY-MM-DD HH:mm:ss")}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="options" min-width="100" v-if="edit">
                <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.row)" icon="el-icon-edit" type="primary" size="small" >edit</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import api from '@/utils/api'
    export default {
        name:"Admin",
        data() {
            return {
                tableData: [], //表格数据
                edit:false, //是否有编辑权限
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            // 获取初始数据
            async getData() {
                let res = await this.$http.get(api.admin)
                if (res && res.Code===1) {
                    this.tableData = res.Data.admin||[];
                    this.edit=res.Data.edit
                }
            },
            handleEdit(row) {
                this.$router.push({
                    path:"admin/edit",
                    query:{
                        Name:row.Name,
                        ID:row.ID
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>