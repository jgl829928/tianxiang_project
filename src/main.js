import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import httpPlugin from './utils/http';
import '@/assets/style/theme/index.css'
import '@/assets/style/reset.css'; 
import '@/assets/style/common.less';
import '@/assets/style/el-element.less';
import 'babel-polyfill' 

import axios from 'axios'
import store from '@/vuex/store';

Vue.config.productionTip = false


Vue.use(ElementUI);
Vue.use(httpPlugin)
Vue.use(require('vue-moment'));


// 导航守卫
router.beforeEach((to, from, next) => {
  let token = store.state.token || sessionStorage.getItem("nebula_token")
  if (!token && to.path != '/') next({ path: '/' })
  else next()
})

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
