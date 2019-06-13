import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/home'

const Login = () => import('@/views/login/index.vue');
const NotFound = () => import('@/views/errorPage/404.vue');

// ------------admin---------------------
const admin_url = "./views/admin/"
const admin = {
    admin: () => import("./views/admin/index"),
    add: () => import(`${admin_url}add`),
    edit: () => import(`${admin_url}edit`),
    passwd: () => import(`${admin_url}passwd`),
}

// ----------server---------------
const server_url = "./views/server/"
const server = {
    server: () => import(`${server_url}index`),
    add: () => import(`${server_url}add`),
    edit: () => import(`${server_url}edit`)
}

// ----------user---------------
const user_url = "./views/user/"
const user = {
    user: () => import(`${user_url}index`),
    detail: () => import(`${user_url}detail`),
}

// ----------sysnotice---------
const sysnotice_url = "./views/sysnotice/"
const sysnotice = {
    sysnotice: () => import(`${sysnotice_url}index`),
    create: () => import(`${sysnotice_url}add`),
}

// ----------config---------------
const config_url = "./views/config/"
const config = {
    config: () => import(`${config_url}index`),
    add: () => import(`${config_url}add`),
    edit: () => import(`${config_url}edit`),
}

// -----------activity---------
const activity_url = "./views/activity/"
const activity = {
    activity: () => import(`${activity_url}index`),
    add: () => import(`${activity_url}add`),
    edit:()=> import(`${activity_url}edit`),
}

const version_url = "./views/version/"
const version = {
    version: () => import(`${version_url}index`),
    modify: () => import(`${version_url}modify`),
}

// ----------warning-----------
const warning = () => import("./views/warning/index")

// --------common----------
const common = () => import('./views/common/index')

// ----------sampling-----------
const sampling = () => import("./views/sampling/index")

// ---------worldmap-------------
const worldmap = () => import("./views/worldmap/index")

// ----------monitor------------
const monitor = () => import("./views/monitor/index")

// ----------chat------------
const chat = () => import("./views/chat/index")

// ----------statistics------------
const statistics = () => import("./views/statistics/index")

// ----------income------------
const income = () => import("./views/income/index")

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'login',
            component: Login,
            meta: { title: 'login' }
        },
        {
            path: '/admin',
            component: Home,
            name: 'mainAdmin',
            redirect: "/",
            children: [
                { path: '/', component: admin.admin, name: 'admin', meta: { name: "admin" }, },
                { path: 'edit', component: admin.edit, name: 'adminEdit', meta: { name: "edit" } },
                { path: 'add', component: admin.add, name: 'adminAdd', hidden: true, meta: { name: "add" } },
                { path: 'passwd', component: admin.passwd, name: 'adminPasswd', meta: { name: "passwd" } },
            ]
        },
        {
            path: '/server',
            component: Home,
            name: 'mainServer',
            redirect: "/",
            children: [
                { path: '/', component: server.server, name: 'server', meta: { name: "server" }, },
                { path: 'edit', component: server.edit, name: 'serverEdit', meta: { name: "edit" } },
                { path: 'add', component: server.add, name: 'serverAdd', hidden: true, meta: { name: "add" } },
            ]
        },
        {
            path: '/user',
            component: Home,
            name: 'mainUser',
            redirect: "/",
            children: [
                { path: '/', component: user.user, name: 'user', meta: { name: "user" }, },
                { path: 'detail', component: user.detail, name: 'userdetail', meta: { name: "detail" }, }
            ]
        },
        {
            path: '/warning',
            component: Home,
            name: 'mainWarning',
            redirect: "/",
            children: [
                { path: '/', component: warning, name: 'warning', meta: { name: "warning" }, },
            ]
        },
        {
            path: '/common',
            component: Home,
            name: 'mainCommon',
            redirect: "/",
            children: [
                { path: '/', component: common, name: 'common', meta: { name: "common" }, },
            ]
        },
        {
            path: '/sysnotice',
            component: Home,
            name: 'mainSysnotice',
            redirect: "/",
            children: [
                { path: '/', component: sysnotice.sysnotice, name: 'sysnotice', meta: { name: "sysnotice" }, },
                { path: 'create', component: sysnotice.create, name: 'syscreate', meta: { name: "syscreate" }, },
            ]
        },
        {
            path: '/config',
            component: Home,
            name: 'mainConfig',
            redirect: "/",
            children: [
                { path: '/', component: config.config, name: 'config', meta: { name: "config" }, },
                { path: 'add', component: config.add, name: 'configAdd', meta: { name: "configAdd" }, },
                { path: 'edit', component: config.edit, name: 'configEdit', meta: { name: "configEdit" }, },
            ]
        },
        {
            path: '/activities',
            component: Home,
            name: 'mainActivity',
            redirect: "/",
            children: [
                { path: '/', component: activity.activity, name: 'activity', meta: { name: "activity" }, },
                { path: 'add', component: activity.add, name: 'activityAdd', meta: { name: "activityAdd" }, },
                { path: 'edit', component: activity.edit, name: 'activityEdit', meta: { name: "activityEdit" }, },
            ]
        },
        {
            path: '/version',
            component: Home,
            name: 'mainVersion',
            redirect: "/",
            children: [
                { path: '/', component: version.version, name: 'version', meta: { name: "version" }, },
                { path: 'modify', component: version.modify, name: 'versionModify', meta: { name: "versionModify" }, },
            ]
        },
        {
            path: '/sampling',
            component: Home,
            name: 'mainSampling',
            redirect: "/",
            children: [
                { path: '/', component: sampling, name: 'sampling', meta: { name: "sampling" }, },
            ]
        },
        {
            path: '/worldmap',
            component: Home,
            name: 'mainMap',
            redirect: "/",
            children: [
                { path: '/', component: worldmap, name: 'worldmap', meta: { name: "worldmap" }, },
            ]
        },
        {
            path: '/monitor',
            component: Home,
            name: 'mainMonitor',
            redirect: "/",
            children: [
                { path: '/', component: monitor, name: 'monitor', meta: { name: "monitor" }, },
            ]
        },
        {
            path: '/chat',
            component: Home,
            name: 'mainChat',
            redirect: "/",
            children: [
                { path: '/', component: chat, name: 'chat', meta: { name: "chat" }, },
            ]
        },
        {
            path: '/statistics',
            component: Home,
            name: 'mainStatistics',
            redirect: "/",
            children: [
                { path: '/', component: statistics, name: 'statistics', meta: { name: "statistics" }, },
            ]
        },
        {
            path: '/income',
            component: Home,
            name: 'mainIncome',
            redirect: "/",
            children: [
                { path: '/', component: income, name: 'income', meta: { name: "income" }, },
            ]
        },
        {
            path: '*',
            name: 'NotFound',
            component: NotFound
        }
    ]
})
export default router
