import '@/assets/js/encrypt'; 

// 获取session
export function getItem(name) {
  return window.sessionStorage.getItem(name)
}

// 存入session
export function setItem(name, value) {
  return window.sessionStorage.setItem(name, value)
}

// 删除session
export function delItem(name) {
  return window.sessionStorage.setItem(name, null)
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
export function timeFormat(timestamp) {
  //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
  var time = new Date(timestamp);
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var date = time.getDate();
  var hours = time.getHours();
  var minutes = time.getMinutes();
  var seconds = time.getSeconds();
  return add0(hours) + ':' + add0(minutes) + ':' + add0(seconds);
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