'use strict'
// module.exports = {
//   NODE_ENV: '"production"'
// }



let buildtype = process.argv.slice(2)[0]
var obj = {
  NODE_ENV: '"production"'
}
switch (buildtype) {
  case 'trade'://生产
    process.env.srconfig = 'trade'
    obj.srconfig = '"trade"'
    break;
  case 'testdev'://测试
    process.env.srconfig = 'testdev'
    obj.srconfig = '"testdev"'
    break;
  case 'jianbo'://建波
    process.env.srconfig = 'jianbo'
    obj.srconfig = '"jianbo"'
    break;
  case 'wangxin'://王鑫
    process.env.srconfig = 'wangxin'
    obj.srconfig = '"wangxin"'
    break;
  case '122'://王鑫
    process.env.srconfig = '122'
    obj.srconfig = '"122"'
    break;
  default://默认开发
    process.env.srconfig = ''
    obj.srconfig = '""'
    break;
}

module.exports = obj;