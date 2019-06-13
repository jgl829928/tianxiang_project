<template>
    <div class="common_page">
        <div class="title">Modify A Version</div>
        <hr>
        <div class="form_content">
            <el-form :model="reqData" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
                hide-required-asterisk>
                <el-form-item label="IOSVersion" prop="IOSVersion">
                    <el-col :span="11">
                        <el-form-item prop="IOSMinVersion">
                            <el-input-number v-model="reqData.IOSMinVersion" controls-position="right" :min="0"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-form-item prop="IOSMaxVersion">
                            <el-input-number v-model="reqData.IOSMaxVersion" controls-position="right" :min="0"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="AndroidVersion" prop="position">
                    <el-col :span="11">
                        <el-form-item prop="AndroidMinVersion">
                            <el-input-number v-model="reqData.AndroidMinVersion" controls-position="right" :min="0"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-form-item prop="AndroidMaxVersion">
                            <el-input-number v-model="reqData.AndroidMaxVersion" controls-position="right" :min="0"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="ServerIDList" prop="ServerIDList">
                    <div class="serverCheck">
                        <el-scrollbar style="height: 100%">
                            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                            <el-checkbox-group v-model="reqData.ServerIDList">
                                <el-checkbox v-for="(item,index) in serverIDList" :label="item" :key="index">{{item}}</el-checkbox>
                            </el-checkbox-group>
                        </el-scrollbar>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog title="确认" :visible.sync="confirmDialog" class="confirm_dialog">
            <div>已选择的服务器:{{this.reqData.ServerIDList.join(",")}}</div>
            <div>
                请再次选择服务器
                <div class="serverCheck">
                    <el-scrollbar style="height: 100%">
                        <el-checkbox :indeterminate="dia_isIndeterminate" v-model="dia_checkAll" @change="dialogCheck">全选</el-checkbox>
                        <el-checkbox-group v-model="confirmServer">
                            <el-checkbox v-for="(item,index) in serverIDList" :label="item" :key="index">{{item}}</el-checkbox>
                        </el-checkbox-group>
                    </el-scrollbar>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirm_submit">确 定</el-button>
                <el-button type="primary" @click="confirmDialog = false">取消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" @closed="handleClose">
            <div v-if="setResults.failedIDList">设置失败的服务器：{{setResults.failedIDList.join(",")}}</div>
            <div v-if="setResults.successIDList">设置成功的服务器：{{setResults.successIDList.join(",")}}</div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import api from "@/utils/api";
    import { _debounce } from "@/utils/auth";
    export default {
        name: "VersionModify",
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请输入数值"));
                } else {
                    if (this.reqData[rule.field] !== "") {
                        let field = rule.field.replace("Min", "Max")
                        this.$refs.ruleForm.validateField(field);
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                let field = rule.field.replace("Max", "Min")
                if (value === "") {
                    callback(new Error("请输入数值"));
                } else if (value <= this.reqData[field]) {
                    callback(new Error("此项值应大于最小值"));
                } else {
                    callback();
                }
            };
            return {
                serverIDList: [1, 2, 3],
                isIndeterminate: true,
                checkAll: false,
                reqData: {
                    ServerIDList: [],
                    IOSMinVersion: "",
                    IOSMaxVersion: "",
                    AndroidMinVersion: "",
                    AndroidMaxVersion: "",
                },

                confirmDialog: false,
                confirmServer: [],
                dia_isIndeterminate: true,
                dia_checkAll: false,

                dialogVisible: false,
                setResults: {},
                rules: {
                    ServerIDList: [{ required: true, message: "请选择服务器", trigger: "change" }],
                    IOSMinVersion: [{ required: true, message: "请输入数值", trigger: "blur" },
                    { pattern: /^([1-9]\d*|[0]{1,1})$/, message: "请输入正整数", trigger: "blur" },
                    { validator: validatePass, trigger: "blur" },],
                    IOSMaxVersion: [{ required: true, message: "请输入数值", trigger: "blur" },
                    { pattern: /^([1-9]\d*|[0]{1,1})$/, message: "请输入正整数", trigger: "blur" },
                    { validator: validatePass2, trigger: "blur" },],
                    AndroidMinVersion: [{ required: true, message: "请输入数值", trigger: "blur" },
                    { pattern: /^([1-9]\d*|[0]{1,1})$/, message: "请输入正整数", trigger: "blur" },
                    { validator: validatePass, trigger: "blur" },],
                    AndroidMaxVersion: [{ required: true, message: "请输入数值", trigger: "blur" },
                    { pattern: /^([1-9]\d*|[0]{1,1})$/, message: "请输入正整数", trigger: "blur" },
                    { validator: validatePass2, trigger: "blur" },],
                },
            };
        },
        created() {
            this.getData()
        },
        methods: {
            // 获取初始数据
            async getData() {
                let res = await this.$http.get(api.vModify);
                if (res && res.Code === 1) {
                    this.serverIDList = res.Data.serverIDList || [];
                }
            },
            //点击全选
            handleCheckAllChange(val) {
                this.reqData.ServerIDList = val ? this.serverIDList : [];
                this.isIndeterminate = false;
            },
            // 弹窗全选
            dialogCheck(val) {
                this.confirmServer = val ? this.serverIDList : [];
                this.dia_isIndeterminate = false;
            },
            // 打开弹窗再次确认
            submitForm(formName) {
                this.$refs[formName].validate(async valid => {
                    if (!valid) return false;
                    this.confirmDialog = true;
                })
            },
            // 提交数据
            confirm_submit:_debounce(function(){
                if (this.reqData.ServerIDList.toString() !== this.confirmServer.toString()) {
                    this.$message.error("与所选服务器不匹配,请检查!")
                } else {
                    this.$http.post(api.vModifySubmit, this.reqData).then((res) => {
                        if (res && res.Code === 1) {
                            this.$message({
                                message: "添加成功",
                                type: "success"
                            });
                            this.setResults = res.Data;
                            this.confirmDialog = false;
                            this.dialogVisible = true;
                        }
                    })
                }
            },500),
            //弹窗关闭
            handleClose() {
                this.$router.push("/version");
            },
            // 重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    };
</script>
<style lang='less' scoped>
    .confirm_dialog {
        text-align: left;

        div:nth-child(1) {
            margin-bottom: 20px;
        }
    }
    .serverCheck {
        text-align: left;
        width: calc(~"100% - 40px");
        display: inline-block;
        height: 400px;
        border: 1px solid #dadada;
        border-radius: 6px;
        padding: 10px 20px;

        .el-scrollbar__wrap {
            overflow-x: hidden;
        }
    }
</style>
<style lang="less">
    .confirm_dialog {
        .el-dialog {
            width: 700px;
            .el-dialog__body {
                width: 600px;
                padding: 30px 0;
                margin: auto;
            }
            .serverCheck {
                margin-top: 20px;
            }
        }
        .el-dialog__header {
            text-align: center;
        }
    }
</style>