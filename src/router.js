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


// ----------warning-----------
const warning_url = "./views/warning/"
const warning = {
    warning: () => import(`${warning_url}index`),
}

// --------common----------
const common_url = "./views/common/"
const common = {
    common: () => import(`${common_url}index`),
}

// ----------sysnotice---------
const sysnotice_url = "./views/sysnotice/"
const sysnotice = {
    sysnotice: () => import(`${sysnotice_url}index`),
    create: () => import(`${sysnotice_url}add`),
}

const sampling_url = "./views/sampling/"
const sampling = {
    sampling: () => import(`${sampling_url}index`),
}

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
            redirect:"/",
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
            redirect:"/",
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
            redirect:"/",
            children: [
                { path: '/', component: user.user, name: 'user', meta: { name: "user" }, },
                { path: 'detail', component: user.detail, name: 'userdetail', meta: { name: "detail" }, }
            ]
        },
        {
            path: '/warning',
            component: Home,
            name: 'mainWarning',
            redirect:"/",
            children: [
                { path: '/', component: warning.warning, name: 'warning', meta: { name: "warning" }, },
            ]
        },
        {
            path: '/common',
            component: Home,
            name: 'mainCommon',
            redirect:"/",
            children: [
                { path: '/', component: common.common, name: 'common', meta: { name: "common" }, },
            ]
        },
        {
            path: '/sysnotice',
            component: Home,
            name: 'mainSysnotice',
            redirect:"/",
            children: [
                { path: '/', component: sysnotice.sysnotice, name: 'sysnotice', meta: { name: "sysnotice" }, },
                { path: 'create', component: sysnotice.create, name: 'syscreate', meta: { name: "syscreate" }, },
            ]
        },
        {
            path: '/sampling',
            component: Home,
            name: 'mainSampling',
            redirect:"/",
            children: [
                { path: '/', component: sampling.sampling, name: 'sampling', meta: { name: "sampling" }, },
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
