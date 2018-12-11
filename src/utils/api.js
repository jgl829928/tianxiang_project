
let url

switch (process.env.srconfig) {
    case 'trade'://生产
        url = `${location.protocol}//${location.host}`;
        break;
    case 'testdev'://测试
        url = 'https://txnebula.tech:8080';
        break;
    default://默认开发 'http://10.0.21.16:9001',
        url = `${location.protocol}//${location.host}`;
        break;
}
export const URL = url
export default {
  login: '/login',//登录
  logout: '/subaction/login/logout',//退出

  //admin菜单
  admin: '/action/admin',
  adminAdd: "/action/admin/add",
  adminAddSub: '/subaction/admin/addsubmit',
  adminpasswd: '/subaction/admin/passwdsubmit',
  getAccess: '/subaction/admin/edit',
  editAccess: "/subaction/admin/editsubmit",

  //server菜单
  server: '/action/server',
  serverSelect: '/action/server/add',
  serverAdd: '/subaction/server/addsubmit',
  serverInfo: '/subaction/server/edit',
  serverEdit: '/subaction/server/editsubmit',
  serverStatus: "/subaction/server/status",
  close: '/subaction/server/close',
  start: '/subaction/server/start',

  // user菜单
  userSearch: "/subaction/user/search",
  userInfo: "/subaction/user/info",
  userSend: "/subaction/user/senditemmail",
  userBan: "/subaction/user/ban",
  userMute: "/subaction/user/mute",

  // warning菜单
  warning: '/action/warning',
  warningClose: "/subaction/warning/dispose",

  // common菜单
  common: "/action/common",
  commonEdit: "/subaction/common/editmaxcache",
  commonOpen: "/subaction/common/openserver",

  // sysnotice菜单
  sysnotice: "/action/sysnotice",
  sysCreate: "/action/sysnotice/create",
  sysSubmit: "/subaction/sysnotice/createsubmit",
  sysDelete: "/subaction/sysnotice/delete",

  // sampling菜单
  sampling: "/action/sampling",
  samInfo: "/subaction/sampling/info",
  samFile: "/subaction/sampling/file",
  delFile: "/subaction/sampling/delete",
  createFile: "subaction/sampling/take"

}