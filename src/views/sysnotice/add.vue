<template>
    <div class="common_content sys_add">
        <div class="addHeader">Create Notice Profile</div>
        <hr>
        <div class="add_box">
            <el-form class="sys_add" ref="reqForm" label-width="80px" :inline="true" label-position="right" :rules="rules"
                :model="reqForm">
                <el-row v-for="(item, index) in reqForm.notices" :key="index">
                    <el-col :span="8" :xs="24">
                        <el-form-item label="Lan" :prop="'notices.' + index + '.lan'" :rules="[{ required: true, message: '请选择语言', trigger: 'blur' }]">
                            <el-select v-model="item.lan" filterable remote reserve-keyword placeholder="请输入关键词"
                                :remote-method="remoteMethod" :key="index">
                                <el-option v-for="items in langList" :key="items.value" :label="items.label" :value="items.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="Content" :prop="'notices.' + index + '.content'" :rules="[{ required: true, message: '请输入内容', trigger: 'blur' }]">
                            <div class="ql-container ql-snow editor_input">
                                <div class="ql-editor">
                                    <quill-editor ref="myTextEditor" v-model="item.content" :options="editorOption"></quill-editor>
                                </div>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4" class="edit_options">
                        <el-button type="success" icon="el-icon-plus" circle size="mini" @click="add(index)"></el-button>
                        <el-button type="danger" icon="el-icon-minus" circle size="mini" @click="remove(index)"></el-button>
                    </el-col>
                </el-row>
                <el-form-item label="ServerID" prop="sidlist">
                    <el-checkbox-group v-model="reqForm.sidlist">
                        <el-checkbox v-for="(item,index) in serverList" :key="index" :label="item"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <div class="send_btn">
                    <p class="error_message">{{error_msg}}</p>
                    <el-button type="success" plain @click="submitForm('reqForm')">提交</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import api from "@/utils/api";
    import { quillEditor } from "vue-quill-editor";
    import { allCountry ,_debounce} from "@/utils/auth";
    export default {
        name: "SysAdd",
        components: { quillEditor },
        data() {
            return {
                reqForm: {
                    notices: [{ lan: "", content: "" }],
                    sidlist: []
                },
                editorOption: {
                    modules: {
                        toolbar: [
                            ["bold", "italic"], // toggled
                            [{ color: [] }]
                        ]
                    }
                },
                // lan搜索下拉框
                langList: [],
                list: [],
                allLang: [],
                // 服务选择框
                serverList: [],
                // 错误信息提示
                error_msg: "",
                // 验证规则
                rules: {
                    sidlist: [
                        {
                            required: true,
                            message: "请选择服务器id",
                            trigger: "blur"
                        }
                    ]
                }
            };
        },
        mounted() {
            this.getData();
            //获取所有国家
            allCountry().then(value => {
                this.allLang = value;
                this.list = this.allLang.map(item => {
                    return { value: item, label: item };
                });
            });
        },
        methods: {
            // 初始化相关数据
            async getData() {
                let res = await this.$http.get(api.sysCreate);
                if (res && res.Code === 1 && res.Data) {
                    this.serverList = res.Data.serverlist || [];
                }
            },
            // 下拉框自动搜索
            remoteMethod(query) {
                if (query !== "") {
                    this.langList = this.list.filter(item => {
                        return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
                    });
                } else {
                    this.langList = [];
                }
            },
            // 提交表单
            submitForm:_debounce(function(formName) {
                this.$refs[formName].validate(async valid => {
                    if (!valid) {
                        return false;
                    }
                    // 判断语言是否重复
                    let langlist = [],
                        isRepeat = false;
                    this.reqForm.notices.map(item => {
                        if (langlist.includes(item.lan)) {
                            isRepeat = true;
                            this.error_msg = "语言重复！！！请检查数据后重试";
                            return;
                        } else {
                            langlist.push(item.lan);
                        }
                    });
                    langlist = [];
                    if (!isRepeat) {
                        this.$http.post(api.sysSubmit, this.reqForm).then(res => {
                            if (res && res.Code === 1) {
                                this.$message({
                                    message: "添加成功",
                                    type: "success"
                                });
                                this.$router.push("/sysnotice");
                            }
                        });
                    }
                });
            },500),
            // 添加一行数据
            add(index) {
                let noticeItem = {
                    lan: "",
                    content: ""
                };
                this.reqForm.notices.splice(index + 1, 0, noticeItem);
            },
            // 删除一行数据
            remove(index) {
                if (index !== 0) {
                    this.reqForm.notices.splice(index, 1);
                }
            }
        }
    };
</script>
<style lang="less" scoped>
    @import url("./add.less");
</style>
<style lang="less">
    @import url("quill/dist/quill.snow.css");

    .sys_add {
        .el-form-item {
            width: 100%;
            margin-bottom: 40px;

            .el-form-item__content {
                width: 60% !important;

                .el-select {
                    width: 100% !important;
                }
            }
        }

        .editor_input {
            border: 1px solid #ccc !important;
        }

        .ql-editor {
            padding: 0px 0px;

            .ql-snow {
                border: none !important;
                border-bottom: 1px solid #ccc !important;
            }

            .ql-toolbar.ql-snow+.ql-container.ql-snow {
                border: none !important;
                height: 200px;
                padding: 0 10px;
            }

            .ql-toolbar.ql-snow {
                position: relative;
                top: -10px;
            }

            .ql-toolbar.ql-snow .ql-formats {
                margin-right: 0px;
            }
        }
    }
</style>