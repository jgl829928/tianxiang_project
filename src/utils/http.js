import axios from 'axios'
import routes from '@/router'
import store from '@/vuex/store'
import { Message } from 'element-ui'
import { URL } from './api.js'
export const http = axios.create({
  baseURL: URL,
  timeout: 1000 * 60,
});


var timeout;
function refreshTime() {
  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(() => {
    routes.replace({ path: '/' })
    store.commit('DEL_TOKEN')
    Message.error('登录超时,请重新登录');
  }, 30 * 60 * 1000)
}


// 请求拦截器,在请求发出之前进行一些操作
http.interceptors.request.use(function (config) {
  let token = store.state.token
  if (config.url.split("?")[0] !== "/") {
    refreshTime();
    config.headers["accesstoken"] = token;
    if (config.headers['accesstoken'] == null) {
      routes.replace({path: '/' }) // 到登录页重新获取token
    }
  }
  return config
}, function (error) {
  Message.error('请求失败,请重试');
  return Promise.reject(error)
});


// 对返回异常的code做出处理
function dealCode(code) {
  let error = {
    "0": "错误请求",
    "-1": "路径无效",
    "-2": "登录超时，请重新登录",
    "-3": "参数错误",
    "-4": "操作失败，请重新登录",
    "-5": "无效的提交方式",
    "-6": "系统内部错误",
    "-7": "文件名不匹配",
    "-8": "文件大小超出限制",
    "-101": "登录失败",
    "-102": "无效的用户名",
    "-103": "无效的密码",
    "-201": "抱歉！您没有此操作权限",
    "-202": "数据保存失败",

    "-401": "数据已被其他人修改",
    "-501": "没有这只采样文件系统",
    "-502": "执行采样失败",
    "-503": "删除采样文件失败",
    "-504": "配置文件转换失败",
    "-505": "配置文件不匹配",
    "-601": "修改导量人数失败",
    "-602": "开启导量状态失败",
    "-701": "ID不匹配",

    "400": "错误请求",
    "404": "当前资源不存在",
    "500": "服务器忙，请重试",
    "401": "未授权，请重新登录",
    "403": "拒绝访问",
    "408": "请求超时",
    "502": "网络错误",
    "503": "服务不可用"
  }
  let flag = false;
  for (let key in error) {
    if (key == code) {
      flag == true;
      Message.error(error[key]);
      return false;
    }
  }
  if (!flag) {
    Message.error("连接错误");
  }
}

//响应拦截器异常处理
http.interceptors.response.use(response => {
  if (response && response.data.Code !== 1) {
    let code = response.data.Code;
    if (code == -2 || code == -4) {
      routes.replace({
        path: '/' // 到登录页重新获取token
      })
    }
    dealCode(code)
  } else if (!response || !response.data) {
    Message.error(`连接错误`)
  }
  return response.data;
}, err => {
  if (err && err.response) {
    dealCode(err.response.status)
  } else {
    Message.error(`当前网络不可用 请稍后重试`)
  }
  return false
});

http.all = axios.all;

//定义插件的配置来扩展 Vue 本身
const httpPlugin = {};
httpPlugin.install = function (Vue, options) {
  Vue.prototype.$http = http
};

export default httpPlugin



