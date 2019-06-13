<template>
    <div class="common_content">
        <Check :alldata="alldata" :clear="clear"></Check>
        <el-form class="cfgedit_form" ref="reqData_form" label-width="102px" :inline="true" label-position="right"
            :model="reqData" :rules="rules">
            <el-row>
                <el-col :span="12" :xs="24">
                    <el-form-item label="Server ID" prop="serverId" min-width="120">
                        <el-select v-model="reqData.serverId" multiple clearable placeholder="Server ID">
                            <el-option v-for="(item,index) in serveList" :label="item.ID" :value="item.ID" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('reqData_form')">submit</el-button>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>
    </div>
</template>
<script>
    import Check from "./check.vue"
    export default {
        name: "ConfigEdit",
        components: { Check },
        data() {
            return {
                clear: false,
                alldata: "",
                serveList: "",
                reqData: {
                    serverId: "",
                },
                rules: {
                    serverId: [
                        { required: true, message: '请选择serverId', trigger: 'blur' },
                    ]
                }
            };
        }
    };
</script>
<style lang="less" scoped>
    .cfgedit_form {
        width:80%;
        text-align:center;
        margin:30px auto;
    }
</style>