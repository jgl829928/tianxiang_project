import '@/assets/js/encrypt';
import { URL } from './api.js'
import Axios from 'axios';
import * as math from "mathjs";


//获取sessionStorage存储数据
export const getSession = name => {
  if (!name) return
  return window.sessionStorage.getItem(name)
}

//设置sessionStorage存储数据
export const setSession = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.sessionStorage.setItem(name, content)
}

//删除sessionStorage存储数据
export const delSession = (name) => {
  if (!name) return
  window.sessionStorage.removeItem(name)
}



// 时间转换格式
export function formatSeconds(value) {
  var secondTime = parseInt(value);// 秒
  var minuteTime = 0;// 分
  var hourTime = 0;// 小时
  if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
    //获取分钟，除以60取整数，得到整数分钟
    minuteTime = parseInt(secondTime / 60);
    //获取秒数，秒数取佘，得到整数秒数
    secondTime = parseInt(secondTime % 60);
    //如果分钟大于60，将分钟转换成小时
    if (minuteTime > 60) {
      //获取小时，获取分钟除以60，得到整数小时
      hourTime = parseInt(minuteTime / 60);
      //获取小时后取佘的分，获取分钟除以60取佘的分
      minuteTime = parseInt(minuteTime % 60);
    }
  }
  var result = "" + parseInt(secondTime) + "秒";

  if (minuteTime > 0) {
    result = "" + parseInt(minuteTime) + "分" + result;
  }
  if (hourTime > 0) {
    result = "" + parseInt(hourTime) + "小时" + result;
  }
  return result;
}


function add0(m) { return m < 10 ? '0' + m : m }
//时间戳转化成时间格式
export function timeFormat(timestamp, value) {
  //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
  var time = new Date(timestamp);
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var date = time.getDate();
  var hours = time.getHours();
  var minutes = time.getMinutes();
  var seconds = time.getSeconds();
  var dateStr = year + "-" + add0(month) + "-" + add0(date) + " ";;
  var hourStr = add0(hours) + ':' + add0(minutes) + ':' + add0(seconds);
  if (value == "date") {
    hourStr = ""
  } else if (value == "hour") {
    dateStr = ""
  }
  return dateStr + hourStr;
}

// 加密函数
export function encrypt(data) {
  encrypt = new JSEncrypt();
  encrypt.setPublicKey(`-----BEGIN PUBLIC KEY-----
                        MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDdd+Z6eTl/mKi2IyI9OygQ4yAY
                        DcS7YeGXXrrOs7ckYRMv3Ic75tHvPQyIaFwGTYeEBAFa724r6d945hPWiliqNTpD
                        2Yg1oFt5SVazqVUY5GyPS5ksVq6INud9A5/gp7sMNp5MWb53KR/D8mokW48Kta1b
                        M/2Oqt89rwyUaXK9VwIDAQAB
                        -----END PUBLIC KEY-----`);
  return encrypt.encrypt(data)
}


// 处理折线图数据
export function dealData(data, name) {
  if (!data) return false;
  let items = [], recordTime = []
  data.map(item => {
    recordTime.push(timeFormat(new Date(item.RecordTime) * 1000, true));
    items.push(item[name]);
  })
  return {
    name,
    timeData: recordTime,
    numData: items,
    rotate: false,
  }
}


// 防止频繁点击，多次请求
export function _debounce(fn, delay) {

  var delay = delay || 500;
  var timer;
  return function () {
      var th = this;
      var args = arguments;
      if (timer) {
          clearTimeout(timer);
      }
      timer = setTimeout(function () {
          timer = null;
          fn.apply(th, args);
      }, delay);
  };
}


// 图片转换成64位格式
export async function base64() {
  let imgSrc = `${URL}/static/img/back.jpg`;
  //width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
  function getBase64Image(img, width, height) {
    var canvas = document.createElement("canvas");
    canvas.width = width ? width : img.width;
    canvas.height = height ? height : img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    var dataURL = canvas.toDataURL();
    return dataURL;
  }
  function getCanvasBase64(img) {
    var image = new Image();
    //至关重要
    image.crossOrigin = "";
    image.src = img;
    //至关重要
    var deferred = $.Deferred();
    if (img) {
      image.onload = function () {
        deferred.resolve(getBase64Image(image)); //将base64传给done上传处理
      };
      return deferred.promise(); //问题要让onload完成后再return sessionStorage['imgTest']
    }
  }
  let imgStr = await getCanvasBase64(imgSrc);
  return imgStr
}

// 计算剩余时间
export function remainTime(startTime, endtime) {
  var stime = Date.parse(new Date(startTime * 1000));
  var etime = Date.parse(new Date(endtime * 1000));
  var intime = Date.parse(new Date());
  var result = "";
  if (intime - etime > 0) {
    result = "已结束"
  }
  if (intime - stime >= 0 && intime - etime <= 0) {
    result = "进行中"
  }
  if (intime - stime < 0) {
    var usedTime = stime - intime;  //两个时间戳相差的毫秒数
    var days = Math.floor(usedTime / (24 * 3600 * 1000));
    //计算出小时数
    var leave1 = usedTime % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));
    result = days + "天" + hours + "时" + minutes + "分";
  }
  return result;
}




// 导出excel
export function outexcel(tHead,filter,list,name) {
  require.ensure([], () => {
    const { export_json_to_excel } = require("../excel/Export2Excel"); //这里必须使用绝对路径
    let tHeader = tHead;
    let filterVal = filter;
    const data = formatJson(filterVal, list);
    export_json_to_excel(tHeader, data, name); // 导出的表格名称，根据需要自己命名
  });
}
function formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]));
}



// 时间戳转化成UTC
export function formatUtc(time, isUTC) {
  if(time!= 0 && !time) return false
  //shijianchuo是整数，否则要parseInt转换
  var time = new Date(time);
  var y = time.getUTCFullYear();
  var m = time.getUTCMonth() + 1;
  var d = time.getUTCDate();
  var h = time.getUTCHours();
  var mm = time.getUTCMinutes();
  var s = time.getUTCSeconds();
  if (!isUTC)
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
  else
    return y + '-' + add0(m) + '-' + add0(d) + 'T' + add0(h) + ':' + add0(mm) + ':' + add0(s) + "Z";
}


// 获取所有国家的数据
export async function allCountry() {
  let resource = await Axios.get('../../static/country.json')
  return resource.data.country
}


// 精度计算
// 加
export function add(num1,num2){
  let result=math.format(math.add(math.bignumber(num1), math.bignumber(num2)))
  return Number(result)
}
// 减
export function subtract(num1,num2){
  let result=math.format(math.subtract(math.bignumber(num1), math.bignumber(num2)))
  return Number(result)
}
// 乘
export function multiply(num1,num2){
  let result=math.format(math.multiply(math.bignumber(num1), math.bignumber(num2)))
  return Number(result)
}
// 除
export function divide(num1,num2){
  if(!num1||!num2){
    return 0;
  }
  if(num1<=0||num2<=0){
    return 0;
  }
  let result=math.format(math.divide(math.bignumber(num1), math.bignumber(num2)))
  return Number(result)
}

