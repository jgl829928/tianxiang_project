import {outexcel} from '@/utils/auth.js'
// 处理activies数据并导出excel
export function dealAndOutExcel(data) {
    let activityData = JSON.parse(JSON.stringify(data));
    activityData.ActiveList.forEach((item, index) => {
      item.Comment = activityData.Comment;
      item.GroupID = activityData.GroupID;
      item.ServerIDList = activityData.ServerIDList ? activityData.ServerIDList.join(",") : "";
      item.index = index + 1;
      if (item.ActionParams) {
        for (let typeItem of item.ActionParams) {
          item[`ACTION_${typeItem.Key}`] = typeItem.Value;
        }
      }
      if (item.ClientParams) {
        for (let typeItem of item.ClientParams) {
          item[`CLIENT_${typeItem.Key}`] = typeItem.Value;
        }
  
      }
      delete item.ActionParams;
      delete item.ClientParams;
    });
    let tHead = ["ActivityType", "ReferenceType", "TimeArg1", "TimeArg2", "Ahead", "Delay", "Comment", "GroupID", "ServerIDList", "index", "ACTION_task_rewardgroup", "ACTION_task_taskgroup", "ACTION_task_sendmail", "ACTION_task_mailtile", "ACTION_rank_listId", "ACTION_rank_questype", "ACTION_rank_listname", "ACTION_rank_mailtitle", "ACTION_rank_typeparam", "ACTION_shop_shopid", "ACTION_collect_rewardgroup", "ACTION_", "ACTION_point_itemtype", "ACTION_point_rewardgroup", "ACTION_tasklimit_type", "ACTION_tasklimit_param1", "ACTION_tasklimit_range1", "ACTION_tasklimit_endvalue", "ACTION_tasklimit_recordtype", "CLIENT_INT_ACTIVITIES_TYPE", "CLIENT_STR_TITLE", "CLIENT_STR_CONTENT_TITLE", "CLIENT_STR_CONTENT_TEXT", "CLIENT_STR_ADD_BANNER", "CLIENT_STR_PIC_PATH", "CLIENT_INT_ACTIVITIES_TYPE_CATEGORY", "CLIENT_STR_RULE", "CLIENT_INT_IS_ACHIEVE_SHOW", "CLIENT_INT_SORTINDEX"]
    outexcel(tHead,tHead, activityData.ActiveList,"活动配置excel");
  }