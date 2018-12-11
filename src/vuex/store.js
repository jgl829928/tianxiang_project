import Vue from 'vue'
import Vuex from 'vuex';
import router from '@/router';
import { getItem, delIem, setItem } from '@/utils/auth'

Vue.use(Vuex)

const state = {
    menuList: getItem('routers')?JSON.parse(getItem('routers')):[],
    token: getItem('nebula_token'),
    isLogin: getItem('isLogin'),
    user:getItem('user')?JSON.parse(getItem('user')):{},
}

const mutations = {
    // 将路由存入vuex和session中
    SET_ROUTERS: (state, routers) => {
        setItem('routers', JSON.stringify(routers));
        state.menuList = routers;
    },
    // 将token存入vuex和session中
    SET_TOKEN(state, token) {
        if (token) {
            setItem('nebula_token', token);
            setItem('isLogin', true);
            state.token = token
            state.isLogin = true
        } else if (token == null) {
            delItem('nebula_token');
            delItem('isLogin');
            state.isLogin = false
            state.token = null
        }
    },
    // 将用户信息存入vuex和session中
    SET_USER(state,user){
        setItem("user",JSON.stringify(user));
        state.user = user
    }
}

const store = new Vuex.Store({
    state: state,
    mutations: mutations,
})

export default store;
