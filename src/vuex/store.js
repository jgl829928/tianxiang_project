import Vue from 'vue'
import Vuex from 'vuex';
import router from '@/router';
import { getSession, setSession, delSession} from '@/utils/auth'

Vue.use(Vuex)

const state = {
    menuList: getSession('routers') ? JSON.parse(getSession('routers')) : [],
    token: getSession('nebula_token'),
    user: getSession('user') ? JSON.parse(getSession('user')) : {},
}

const mutations = {
    // 将路由存入vuex和session中
    SET_ROUTERS: (state, routers) => {
        setSession('routers', JSON.stringify(routers));
        state.menuList = routers;
    },
    // 将token存入vuex和session中
    SET_TOKEN(state, token) {
        if (token) {
            setSession('nebula_token', token);
            state.token = token
        } else if (token == null) {
            delSession('nebula_token');
            state.token = null
        }
    },
    // 将用户信息存入vuex和session中
    SET_USER(state, user) {
        setSession("user", JSON.stringify(user));
        state.user = user
    },
    DEL_TOKEN(state) {
        delSession('nebula_token');
        delSession('user');
        state.token = null
        state.user = null
    }
}

const store = new Vuex.Store({
    state: state,
    mutations: mutations,
})

export default store;
