let URL

switch (process.env.srconfig) {
    case 'trade'://生产
        URL = `${location.protocol}//${location.host}`;
        break;
    case 'testdev'://测试
        URL = 'https://txnebula.tech:8080';
        break;
    case 'jianbo'://测试
        URL = 'http://10.0.21.57:8081';
        break;
    case 'wangxin'://测试
        URL = 'http://10.0.21.43:8081';
        break;
    case '122'://测试
        URL = 'http://10.0.21.122:8081';
        break;
    default:
        URL = 'http://10.0.21.122:8081';
        break;
}

export { URL };

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
    userSuper: "/subaction/user/super",
    userGmAccess: "/subaction/user/gmaccess",
    userGmcancel: "/subaction/user/gmcancle",

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
    createFile: "/subaction/sampling/take",
    openFile: "/subaction/sampling/open",
    openLink: `${URL}/pprof/ui`,
    heartCheck: "/pprof/heartbeat",
    closeFile: "/pprof/closepprof",

    // worldmap菜单
    worldmap: "/action/worldmap",
    mapBolck: "/subaction/worldmap/block",

    // chat菜单
    chat: "/subaction/chat/url",

    // monitor
    monitor: "/action/monitor",
    monitorInfo: "/subaction/monitor/info",

    // statistics
    statistics: "/action/statistics",
    statsInfo: "/subaction/statistics/info",

    // config
    config: "/action/config",
    configCheck: "/subaction/config/check",
    upload: "/subaction/config/upload",

    // income
    income: "/action/income",
    incomeInfo: "/subaction/income/info",
    incomeOnline: "/subaction/income/online",

    // active
    active: "/action/activities",
    activeInfo: "/subaction/activities/search",
    activeAdd: "/action/activities/add",
    actAddSubmit: "/subaction/activities/addsubmit",
    activeEdit: "/subaction/activities/edit",
    actEditSubmit: "/subaction/activities/editsubmit",
    activeDelete: "/subaction/activities/delete",

    //version
    version:"/action/version",
    vModify:"/action/version/modify",
    vModifySubmit:"/subaction/version/modifysubmit",

}

