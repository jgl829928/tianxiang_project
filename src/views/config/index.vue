<template>
    <div class="common_content config_content">
        <div class="control_btn">
            <el-upload ref="upload_model" class="upload_content" multiple :file-list="fileList" :show-file-list="true"
                :on-change="upload_change" :on-remove="upload_remove" :http-request="upload" :action="$http.defaults.baseURL+'/subaction/config/upload'"
                :auto-upload="false">
                <el-button size="small" slot="trigger" type="success" plain>选择文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="primary" @click="submitUpload">upload</el-button>
            </el-upload>
        </div>
        <el-button size="small" type="primary" @click="check">check</el-button>
        <div v-if="showInfo" class="checkInfo">
            <Check :alldata="alldata" :clear="clear"></Check>
            <div>
                <el-form class="cfgadd_form" ref="reqData_form" label-width="102px" :inline="true" label-position="right"
                    :model="reqData" :rules="rules">
                    <el-row>
                        <el-col :span="8" :xs="24">
                            <el-form-item label="Server ID" prop="serverId" min-width="120">
                                <el-select v-model="reqData.serverId" clearable multiple placeholder="Server ID">
                                    <el-option v-for="(item,index) in serveList" :label="item.ID" :value="item.ID" :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" :xs="24">
                            <el-form-item label="Version" prop="version">
                                <el-input v-model="reqData.version"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10" :xs="24">
                            <el-form-item label="Comment" prop="comment" min-width="120">
                                <el-input type="textarea" v-model="reqData.comment"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('reqData_form')">submit</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <el-dialog title="错误提示" :visible.sync="dialogVisible" width="80%" :close-on-click-modal="false"
            :close-on-press-escape="false" :show-close="false" center>
            <div v-html="errorMes">{{errorMes}}</div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import api from "@/utils/api";
    import { _debounce } from "@/utils/auth";
    import Check from "./check.vue";
    export default {
        name: "ConfigAdd",
        components: { Check },
        data() {
            return {
                fileList: [],
                fileData: [],
                alldata: [],
                clear: true,
                reqData: {
                    serverId: "",
                    version: "",
                    comment: ""
                },
                serveList: [{ ID: "1" },{ID:"2"}],
                showInfo: false,
                rules: {
                    serverId: [
                        { required: true, message: "请选择serverId", trigger: "blur" }
                    ],
                    version: [{ required: true, message: "请输入版本", trigger: "change" }]
                },
                dialogVisible: false,
                errorMes: ""
            };
        },
        computed: {
            token: function () {
                return this.$store.state.token;
            }
        },
        methods: {

            upload_change(file, fileList) {
                this.fileList = fileList;
            },

            upload_remove(file, fileList) {
                this.fileList = fileList;
            },

            submitUpload:_debounce(function() {
                if (this.fileList.length <= 0) {
                    this.$message.error("请选择需要上传的文件");
                    return false;
                }
                this.fileData = new FormData();
                this.$refs.upload_model.submit();
                this.$http.post(api.upload, this.fileData).then(res => {
                    this.fileList = [];
                    if (res && res.Code === 1) {
                        this.$message({
                            message: "恭喜你,文件上传成功,请检查",
                            type: "success"
                        });
                        this.alldata = [];
                        this.clear = !this.clear;
                        this.showInfo = false;
                    } else if (res.Code==-504) {
                        this.errorMes = res.Data.error
                        this.dialogVisible = true;
                        this.showInfo = false;
                    }
                });
            },500),

            upload(file) {
                this.fileData.append("file", file.file);
            },

            check:_debounce(async function(){
                this.alldata = [];
                this.clear = !this.clear;
                let res = await this.$http.get(api.configCheck);
                if (res && res.Code === 1) {
                    this.showInfo = true;
                    if(res.Data) this.alldata = JSON.parse(JSON.stringify(res.Data.list));
                } else if (res.Code === -505) {
                    this.errorMes = res.Data.error.join("<br/>");
                    this.dialogVisible = true;
                }
            },500),
            
            submitForm:_debounce(function(formName) {
                
                this.$refs[formName].validate(valid => {
                    if (!valid) return false;
                });

            },500)
        }
    };
</script>
<style scoped lang="less">
    .config_content {
        .control_btn {
            .upload_content {
                float: left;
                margin-right: 20px;
            }
        }

        .checkInfo {
            clear: both;
            padding-top: 30px;
        }

        .cfgadd_form {
            margin-top: 30px;
            text-align: center;
        }
    }
</style>
<style lang="less">
    .config_content {

        .cfgadd_form {
            .el-textarea {
                width: 300px;
            }
        }
    }
</style>