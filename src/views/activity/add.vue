<template>
    <div class="common_page activity_add">
        <div class="title addHeader">Create A New Profile</div>
        <hr>
        <div class="exls_opt">
            <el-upload ref="upload" action="/wm/upload/" :show-file-list="false" :on-change="readExcel" :auto-upload="false">
                <el-button slot="trigger" icon="el-icon-upload" size="small" type="primary">上传文件</el-button>
            </el-upload>
        </div>
        <div class="form_content">
            <el-form :model="reqData" status-icon ref="reqform" label-width="130px" class="demo-ruleForm" 
                hide-required-asterisk>
                <!-- 公共部分 -->
                <el-row>
                    <el-col :span="8" :xs="24">
                        <el-form-item label="Group" prop="GroupID" :rules="[{ required: true, message: '请输入数据', trigger: 'change' },{pattern:/^[0-9]*[1-9][0-9]*$/,message:'请输入正整数',trigger:'blur'}]">
                            <el-input v-model.number="reqData.GroupID" clearable placeholder="活动组ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" :xs="24">
                        <el-form-item label="Comment" prop="Comment">
                            <el-input type="textarea" v-model="reqData.Comment" clearable placeholder="活动名称注释"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" :xs="24">
                        <el-form-item label="ServerId" prop="ServerIDList" :rules="[{ required: true, message: '请输入数据', trigger: 'change' }]">
                            <div class="checkbox">
                                <el-scrollbar style="height: 100%">
                                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                                    <el-checkbox-group v-model="reqData.ServerIDList">
                                        <el-checkbox v-for="(item,index) in allselect.serverList" :label="item" :key="index">{{item}}</el-checkbox>
                                    </el-checkbox-group>
                                </el-scrollbar>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-card class="box-card" v-for="(item,index) in reqData.ActiveList" :key="index">
                        <div slot="header" class="clearfix">
                            <span>ACITIVE {{index+1}}</span>
                            <div class="edit_options" style="float: right">
                                <el-button type="success" icon="el-icon-plus" circle size="mini" @click="add(index)"></el-button>
                                <el-button type="danger" icon="el-icon-minus" circle size="mini" @click="remove(index)"></el-button>
                            </div>
                        </div>
                        <el-collapse v-model="activeNames">
                            <!-- 基础参数 -->
                            <el-collapse-item title="BASE PARAMS （基础参数）" name="1">
                                <el-row>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="Activity Type" :prop="'ActiveList.' + index + '.ActivityType'"
                                            :rules="[{ required: true, message: '请输入数据', trigger: 'change' }]">
                                            <el-select v-model="item.ActivityType" clearable placeholder="活动类型"
                                                filterable @change="item.ActionParams={task_rewardgroup:''}">
                                                <el-option v-for="(item,index) in allselect.activityTypeSelect" :label="item.Des"
                                                    :value="item.Type" :key="index"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="Reference Type" :prop="'ActiveList.' + index + '.ReferenceType'"
                                            :rules="[{ required: true, message: '请输入数据', trigger: 'change' }]">
                                            <el-select v-model="item.ReferenceType" clearable placeholder="活动开启时间类型"
                                                @change="typeChange(index)">
                                                <el-option v-for="(item,index) in allselect.referenceTypeSelect" :label="item.Des"
                                                    :value="item.Type" :key="index"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12" :xs="24">
                                        <div v-if="item.ReferenceType==1">
                                            <el-form-item label="Time" :prop="'ActiveList.' + index + '.time'" :rules="[{ required: true, message: '请输入数据', trigger: 'change' }]">
                                                <el-date-picker v-model="item.time" type="datetimerange" value-format="yyyy-MM-ddTHH:mm:ssZ"
                                                    format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="活动开始时间"
                                                    end-placeholder="活动结束时间"></el-date-picker>
                                            </el-form-item>
                                        </div>
                                        <el-form-item v-else label="Time">
                                            <el-col :span="11">
                                                <el-form-item :prop="'ActiveList.' + index + '.TimeArg1'" :rules="[{ required: true, message: '请输入数据', trigger: 'blur' }]">
                                                    <el-col :span="22">
                                                        <el-input-number v-model="item.TimeArg1" controls-position="right" placeholder="活动开始时间"
                                                            :min="0"></el-input-number>
                                                    </el-col>
                                                    <el-col class="time_units" :span="2">s</el-col>
                                                </el-form-item>
                                            </el-col>
                                            <el-col class="line" :span="2">-</el-col>
                                            <el-col :span="11">
                                                <el-form-item :prop="'ActiveList.' + index + '.TimeArg2'" :rules="[{ required: true, message: '请输入数据', trigger: 'blur' }]">
                                                    <el-col :span="22">
                                                        <el-input-number v-model="item.TimeArg2" controls-position="right" placeholder="活动结束时间"
                                                            :min="0"></el-input-number>
                                                    </el-col>
                                                    <el-col class="time_units" :span="2">s</el-col>
                                                </el-form-item>
                                            </el-col>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="Ahead" :prop="'ActiveList.' + index + '.Ahead'">
                                            <el-col :span="22">
                                                <el-input-number v-model="item.Ahead" controls-position="right" placeholder="提前展示时间"></el-input-number>
                                            </el-col>
                                            <el-col class="time_units" :span="2">s</el-col>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="Delay" :prop="'ActiveList.' + index + '.Delay'">
                                            <el-col :span="22">
                                                <el-input-number v-model="item.Delay" controls-position="right" placeholder="延后展示时间"></el-input-number>
                                            </el-col>
                                            <el-col class="time_units" :span="2">s</el-col>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                            <!-- 客户端参数 -->
                            <el-collapse-item title="CLIENT PARAMS （客户端参数）" name="3" v-if="item.ActivityType!=5&&item.ActivityType!=6">
                                <el-row>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="ACTIVITIES_TYPE" :prop="'ActiveList.' + index + '.ClientParams.INT_ACTIVITIES_TYPE'"
                                            :rules="[{ required: true, message: '请输入数据', trigger: 'change' }]">
                                            <el-select v-model="item.ClientParams.INT_ACTIVITIES_TYPE" clearable
                                                filterable placeholder="活动UI类型">
                                                <el-option v-for="(item,index) in allselect.INT_ACTIVITIES_TYPESelect"
                                                    :label="item.Des" :value="item.Type" :key="index"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="TITLE" :prop="'ActiveList.' + index + '.ClientParams.STR_TITLE'"
                                            :rules="[{ required: true, message: '请输入数据', trigger: 'blur' }]">
                                            <el-input v-model="item.ClientParams.STR_TITLE" clearable placeholder="活动标题名"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="CONTENT_TITLE" :prop="'ActiveList.' + index + '.ClientParams.STR_CONTENT_TITLE'">
                                            <el-input v-model="item.ClientParams.STR_CONTENT_TITLE" clearable
                                                placeholder="banner内文字标题"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="CONTENT_TEXT" :prop="'ActiveList.' + index + '.ClientParams.STR_CONTENT_TEXT'">
                                            <el-input v-model="item.ClientParams.STR_CONTENT_TEXT" clearable
                                                placeholder="banner内文字内容"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="ADD_BANNER" :prop="'ActiveList.' + index + '.ClientParams.STR_ADD_BANNER'">
                                            <el-input v-model="item.ClientParams.STR_ADD_BANNER" clearable placeholder="banner图片名"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="PIC_PATH" :prop="'ActiveList.' + index + '.ClientParams.STR_PIC_PATH'"
                                            :rules="[{ required: true, message: '请输入数据', trigger: 'blur' }]">
                                            <el-input v-model="item.ClientParams.STR_PIC_PATH" clearable placeholder="活动icon"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="RULE" :prop="'ActiveList.' + index + '.ClientParams.STR_RULE'">
                                            <el-input v-model="item.ClientParams.STR_RULE" clearable placeholder="HELPSHIFT本地化"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="IS_ACHIEVE_SHOW" :prop="'ActiveList.' + index + '.ClientParams.INT_IS_ACHIEVE_SHOW'"
                                            :rules="[{ required: true, message: '请输入数据', trigger: 'change' }]">
                                            <el-select v-model="item.ClientParams.INT_IS_ACHIEVE_SHOW" clearable
                                                placeholder="全部领取后是否继续显示">
                                                <el-option label="true" value="true"></el-option>
                                                <el-option label="false" value="false"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="SORTINDEX" :prop="'ActiveList.' + index + '.ClientParams.INT_SORTINDEX'"
                                            :rules="[{ required: true, message: '请输入数据', trigger: 'blur' }]">
                                            <el-input v-model="item.ClientParams.INT_SORTINDEX" clearable placeholder="活动显示排序"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                            <!-- 类型参数 -->
                            <el-collapse-item title="ACTION PARAMS （活动内参数）" name="4">
                                <!-- 任务参数 -->
                                <el-row v-if="item.ActivityType==1">
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="TaskListId" :prop="'ActiveList.' + index + '.ActionParams.task_taskgroup'">
                                            <el-select v-model="item.ActionParams.task_taskgroup" clearable placeholder="任务组ID"
                                                @change="item.ActionParams.task_rewardgroup=''">
                                                <el-option v-for="(value, key) in allselect.activityTaskSelect" :label="key"
                                                    :value="key" :key="key"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="TaskGroup" :prop="'ActiveList.' + index + '.ActionParams.task_rewardgroup'">
                                            <el-select v-model="item.ActionParams.task_rewardgroup" clearable
                                                placeholder="任务组奖励ID">
                                                <el-option v-for="(item,index) in allselect.activityTaskSelect[item.ActionParams.task_taskgroup]"
                                                    :label="item" :value="item" :key="index"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="IsSendMail" :prop="'ActiveList.' + index + '.ActionParams.task_sendmail'">
                                            <el-select v-model="item.ActionParams.task_sendmail" clearable placeholder="未领取是否发补发邮件">
                                                <el-option label="true" value="true"></el-option>
                                                <el-option label="false" value="false"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="TaskMailTitle" :prop="'ActiveList.' + index + '.ActionParams.task_mailtile'">
                                            <el-select v-model="item.ActionParams.task_mailtile" clearable filterable
                                                placeholder="邮件内容">
                                                <el-option v-for="(item,index) in allselect.activityMailTitleSelect"
                                                    :label="item.Des" :value="item.Type" :key="index"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!-- 排行参数 -->
                                <el-row v-if="item.ActivityType==2||item.ActivityType==8||item.ActivityType==9">
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="RankListId" :prop="'ActiveList.' + index + '.ActionParams.rank_listId'">
                                            <el-select v-model="item.ActionParams.rank_listId" clearable filterable
                                                placeholder="排行任务组ID">
                                                <el-option v-for="(item,index) in allselect.activityRankRewardSelect"
                                                    :label="item.Des" :value="item.Type" :key="index"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="RankType" :prop="'ActiveList.' + index + '.ActionParams.rank_questype'">
                                            <el-select v-model="item.ActionParams.rank_questype" clearable filterable
                                                placeholder="排行目标">
                                                <el-option v-for="(item,index) in allselect.activityRankTypeSelect"
                                                    :label="item.Des" :value="item.Type" :key="index"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="RankName" :prop="'ActiveList.' + index + '.ActionParams.rank_listname'">
                                            <el-select v-model="item.ActionParams.rank_listname" clearable placeholder="排行名称">
                                                <el-option v-for="(item,index) in allselect.activityRankNameSelect"
                                                    :label="item.Des" :value="item.Type" :key="index"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="RankMailTitle" :prop="'ActiveList.' + index + '.ActionParams.rank_mailtitle'">
                                            <el-select v-model="item.ActionParams.rank_mailtitle" clearable filterable
                                                placeholder="排行发送奖励邮件内容">
                                                <el-option v-for="(item,index) in allselect.activityMailTitleSelect"
                                                    :label="item.Des" :value="item.Type" :key="index"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="RankTypeParam" :prop="'ActiveList.' + index + '.ActionParams.rank_typeparam'">
                                            <el-input v-model="item.ActionParams.rank_typeparam" clearable placeholder="目标物品"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!-- 兑换类型 -->
                                <el-row v-if="item.ActivityType==4">
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="ShopId" :prop="'ActiveList.' + index + '.ActionParams.shop_shopid'">
                                            <el-select v-model="item.ActionParams.shop_shopid" clearable placeholder="兑换任务组ID">
                                                <el-option v-for="(item,index) in allselect.activityShopSelect" :label="item.Des"
                                                    :value="item.Type" :key="index"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!-- 行为类型 -->
                                <el-row v-if="item.ActivityType==5">
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="RewardGroup" :prop="'ActiveList.' + index + '.ActionParams.collect_rewardgroup'">
                                            <el-select v-model="item.ActionParams.collect_rewardgroup" clearable
                                                placeholder="行为任务组ID">
                                                <el-option v-for="(item,index) in allselect.activityCollectSelect"
                                                    :label="item.Des" :value="item.Type" :key="index"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!-- 点数类 -->
                                <el-row v-if="item.ActivityType==6">
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="PointItemtype" :prop="'ActiveList.' + index + '.ActionParams.point_itemtype'">
                                            <el-select v-model="item.ActionParams.point_itemtype" clearable placeholder="兑换所需物品">
                                                <el-option v-for="(item,index) in allselect.activityPointItemSelect"
                                                    :label="item.Des" :value="item.Type" :key="index"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="RewardGroup" :prop="'ActiveList.' + index + '.ActionParams.point_rewardgroup'">
                                            <el-select v-model="item.ActionParams.point_rewardgroup" clearable
                                                placeholder="积分奖励任务组ID">
                                                <el-option v-for="(item,index) in allselect.activityPointRewardGroupSelect"
                                                    :label="item.Des" :value="item.Type" :key="index"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!-- 限制领取类活动 -->
                                <el-row v-if="item.ActivityType==7">
                                     <el-col :span="6" :xs="24">
                                        <el-form-item label="TaskListId" :prop="'ActiveList.' + index + '.ActionParams.task_taskgroup'">
                                            <el-select v-model="item.ActionParams.task_taskgroup" clearable placeholder="任务组id"
                                                @change="item.ActionParams.task_rewardgroup=''">
                                                <el-option v-for="(value, key) in allselect.activityTaskLimitTaskSelect" :label="key"
                                                    :value="key" :key="key"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="TaskGroup" :prop="'ActiveList.' + index + '.ActionParams.task_rewardgroup'">
                                            <el-select v-model="item.ActionParams.task_rewardgroup" clearable
                                                placeholder="奖励组id">
                                                <el-option v-for="(item,index) in allselect.activityTaskLimitTaskSelect[item.ActionParams.task_taskgroup]"
                                                    :label="item" :value="item" :key="index"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="Tasklimit_type" :prop="'ActiveList.' + index + '.ActionParams.tasklimit_type'">
                                            <el-select v-model="item.ActionParams.tasklimit_type" clearable placeholder="限制类型">
                                                <el-option v-for="(item,index) in allselect.activityTaskLimiteSelect"
                                                    :label="item.Des" :value="item.Type" :key="index"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="Tasklimit_param1" :prop="'ActiveList.' + index + '.ActionParams.tasklimit_param1'">
                                            <el-input v-model="item.ActionParams.tasklimit_param1" clearable
                                                placeholder="目标id"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="Tasklimit_range1" :prop="'ActiveList.' + index + '.ActionParams.tasklimit_range1'">
                                            <el-select v-model="item.ActionParams.tasklimit_range1" clearable
                                                placeholder="比较类型">
                                                <el-option v-for="(item,index) in allselect.activityRangeTypeSelect"
                                                    :label="item.Des" :value="item.Type" :key="index"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="Tasklimit_endvalue" :prop="'ActiveList.' + index + '.ActionParams.tasklimit_endvalue'">
                                            <el-input v-model="item.ActionParams.tasklimit_endvalue" clearable
                                                placeholder="比较的最终数值"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6" :xs="24">
                                        <el-form-item label="Tasklimit_recordtype" :prop="'ActiveList.' + index + '.ActionParams.tasklimit_recordtype'">
                                            <el-select v-model="item.ActionParams.tasklimit_recordtype" clearable
                                                placeholder="值的类型">
                                                <el-option v-for="(item,index) in allselect.activityRecordTypeSelect"
                                                    :label="item.Des" :value="item.Type" :key="index"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-collapse-item>
                        </el-collapse>
                    </el-card>
                </el-row>
            </el-form>
            <div class="operate_btn">
                <el-button type="primary" @click="submitForm('reqform')">提交</el-button>
                <el-button type="plain" @click="resetForm('reqform')">重置</el-button>
                <el-button type="plain" @click="outExcel('reqform')">导出</el-button>
            </div>
            <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" @closed="handleClose">
                <div v-if="setResults.addSuccessServerIDList">添加成功的服务器：{{setResults.addSuccessServerIDList.join(",")}}</div>
                <div v-if="setResults.addFailedServerIDList">添加失败的服务器：{{setResults.addFailedServerIDList.join(",")}}</div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import api from "@/utils/api";
    import { formatUtc,_debounce} from "@/utils/auth";
    import { dealAndOutExcel} from "@/excel/dealOutData";
    export default {
        data() {
            return {
                allselect: {},
                activeNames: ["1"],
                checkAll: false, //是否全选
                isIndeterminate: true,
                importData: [], //导入excel数据
                isPatch: true, //是否匹配
                dialogVisible: false,
                setResults: {},
                reqData: {
                    GroupID: "", //活动分组
                    ServerIDList: [], //服务器id
                    Comment: "",
                    ActiveList: [
                        {
                            //基础参数
                            ActivityType: "", //活动类型
                            ReferenceType: "", //类型
                            time: [], //活动时间

                            TimeArg1: "", //活动开始时间
                            TimeArg2: "", //活动结束时间

                            Ahead: "", //在活动前显示
                            Delay: "", //在活动结束显示


                            ActionParams: {
                                //任务类
                                task_taskgroup: "", //任务列表id
                                task_rewardgroup: "", //任务奖励分组
                                task_sendmail: "", //邮件
                                task_mailtile: "", //邮件标题
                                //排行类
                                rank_listId: "", //排行key
                                rank_questype: "", //排行奖励分组
                                rank_listname: "", //排行名字
                                rank_mailtitle: "", //排行邮件标题
                                rank_typeparam: "", //排行类型
                                // 兑换类
                                shop_shopid: "",
                                // 行为类
                                collect_rewardgroup: "",
                                // 点数类
                                point_itemtype: "",
                                point_rewardgroup: "",
                                // 限制领取类
                                tasklimit_type: "",
                                tasklimit_param1: "",
                                tasklimit_range1: "",
                                tasklimit_endvalue: "",
                                tasklimit_recordtype: ""
                            },
                            // 客户端参数
                            ClientParams: {
                                INT_ACTIVITIES_TYPE: "",
                                STR_TITLE: "",
                                STR_CONTENT_TITLE: "",
                                STR_CONTENT_TEXT: "",
                                STR_ADD_BANNER: "",
                                STR_PIC_PATH: "",
                                INT_ACTIVITIES_TYPE_CATEGORY: "",
                                STR_RULE: "",
                                INT_IS_ACHIEVE_SHOW: "",
                                INT_SORTINDEX: ""
                            }
                        }
                    ]
                },
                initialData:{},
            };
        },
        mounted() {
            this.getData();
            // 保存每一项活动的初始数据
            this.initialData=JSON.parse(JSON.stringify(this.reqData));
        },
        methods: {
            // 获取初始数据
            async getData() {
                let res = await this.$http.get(api.activeAdd);
                if (res && res.Code === 1) {
                    this.allselect = res.Data;
                }
            },

            // 添加
            add(index) {
                let data = JSON.parse(JSON.stringify(this.initialData.ActiveList[0]));
                this.reqData.ActiveList.splice(index + 1, 0, data);
            },

            // 全选
            handleCheckAllChange(val) {
                this.reqData.ServerIDList = val ? this.allselect.serverList : [];
                this.isIndeterminate = false;
            },

            // 移除
            remove(index) {
                if (index == 0) return false;
                this.reqData.ActiveList.splice(index, 1);
            },

            // referenceType选项改变
            typeChange(index) {
                this.reqData.ActiveList[index].time = [];
                this.reqData.ActiveList[index].TimeArg1 = "";
                this.reqData.ActiveList[index].TimeArg2 = "";
            },

            // 提交
            submitForm:_debounce(function(formName){
                this.$refs[formName].validate(async valid => {
                    if (!valid) {
                        this.activeNames = ["1", "2", "3", "4"];
                        return false;
                    }
                    let submitData = this.dealSubmitData();
                    this.$http.post(api.actAddSubmit, submitData).then(res => {
                        if (res && res.Code === 1) {
                            this.$message({
                                message: "添加成功",
                                type: "success"
                            });
                            this.setResults = res.Data;
                            this.dialogVisible = true;
                        }
                    });
                });
            },500),

            // 处理提交数据
            dealSubmitData() {
                let data = JSON.parse(JSON.stringify(this.reqData));
                data.ActiveList.forEach((item, index) => {
                    item.index = index + 1;
                    // 处理时间

                    item.TimeArg1 = item.time && item.time.length > 0 ? Date.parse(item.time[0])/1000 : item.TimeArg1;
                    item.TimeArg2 = item.time && item.time.length > 0 ? Date.parse(item.time[1])/1000 : item.TimeArg2;

                    delete item.time;
                    item.ClientParams = this.jsonToArray(item.ClientParams);
                    item.ActionParams = this.jsonToArray(item.ActionParams);
                });
                return data;
            },

            //过滤数据以及转换id;
            jsonToArray(obj) {
                let tempArr = [],
                    tempObj = {};
                for (let key in obj) {
                    if (!obj[key] && obj[key] !== 0) continue;
                    tempObj = {
                        Key: key,
                        Value:
                            key == "minLevel" || key == "maxLevel" || key == "vipLevel"
                                ? obj[key].toString()
                                : obj[key]
                    };
                    tempArr.push(tempObj);
                }
                return tempArr;
            },

            handleClose() {
                this.$router.push("/activities");
            },

            // 重置
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.reqData=JSON.parse(JSON.stringify(this.initialData))
            },

            // 导出excel
            outExcel:_debounce(function(formName){
                this.$refs[formName].validate(async valid => {
                    if (!valid) {
                        this.activeNames = ["1", "2", "3", "4"];
                        return false;
                    }
                    dealAndOutExcel(this.dealSubmitData());
                });
            },500),

            // 导入数据
            readExcel(file) {
                const fileReader = new FileReader();
                fileReader.onload = ev => {
                    try {
                        const data = ev.target.result;
                        const workbook = XLSX.read(data, {
                            type: "binary"
                        });
                        for (let sheet in workbook.Sheets) {
                            const sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
                            this.dealImportData(sheetArray);
                        }
                    } catch (e) {
                        this.$message.warning("文件导入失败，请检查！");
                        return false;
                    }
                };
                fileReader.readAsBinaryString(file.raw);
            },

            //处理引入数据
            dealImportData(data) {
                let allData = {};
                let activitList = [];
                for (let item of data) {
                    let tempObj = {
                        ActionParams: {},
                        ClientParams: {},
                        time: []
                    };
                    for (let key in item) {
                        if (key.indexOf("ACTION") > -1) {
                            let subKey = key.split("ACTION_")[1];
                            tempObj.ActionParams[subKey] = item[key];
                            continue;
                        }
                        if (key.indexOf("CLIENT") > -1) {
                            let subKey = key.split("CLIENT_")[1];
                            tempObj.ClientParams[subKey] = item[key];
                            continue;
                        }
                        if (key == "Comment" || key == "GroupID") {
                            allData[key] = item[key];
                            continue;
                        }
                        if (key == "ReferenceType" && item.ReferenceType == 1) {
                            tempObj.time.push(formatUtc(item.TimeArg1 * 1000,true));
                            tempObj.time.push(formatUtc(item.TimeArg2 * 1000,true));
                        }
                        if (key == "ServerIDList") {
                            let serverList = item[key].split(",");
                            allData[key] = serverList.map(item => {
                                return Number(item);
                            });
                            continue;
                        }
                        tempObj[key] = item[key];
                    }
                    activitList.push(tempObj);
                }
                allData.ActiveList = activitList;
                let activityItem = this.reqData.ActiveList[0];
                for (let item of allData.ActiveList) {
                    this.judge(item, activityItem);
                }
                if (this.isPatch) {
                    this.reqData = allData;
                }
            },

            // 判断字段是否匹配
            judge(item, compareItem) {
                for (let filekey in item) {
                    if (filekey == "index") continue;
                    if (
                        compareItem[filekey] &&
                        typeof compareItem[filekey] === "object" &&
                        filekey != "time"
                    ) {
                        if (item[filekey] != {}) {
                            this.judge(item[filekey], compareItem[filekey]);
                        } else {
                            continue;
                        }
                    } else {
                        if (!compareItem.hasOwnProperty(filekey)) {
                            this.isPatch = false;
                            this.$message.warning("文件字段不正确！请检查文件后重新导入");
                            return false;
                        } else {
                            continue;
                        }
                    }
                }
            }
        }
    };
</script>
<style lang="less" scoped>
    @import url("./add.less");
</style>
<style lang="less">
    @import url("./ele_add.less");
</style>