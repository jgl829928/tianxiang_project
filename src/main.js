import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import httpPlugin from './utils/http';
import '@/assets/style/theme/index.css'
import '@/assets/style/reset.css'; 
import '@/assets/style/common.less';
import '@/assets/style/el-element.less';
import Es6Promise from 'es6-promise'
Es6Promise.polyfill()
import 'babel-polyfill' 

//引入导入导出excel文件
import Blob from './excel/Blob.js'
import Export2Excel from './excel/Export2Excel.js'
// 添加水印
import watermark from '@/utils/waterMark'


import store from '@/vuex/store';

Vue.config.productionTip = false


Vue.use(ElementUI);
Vue.use(httpPlugin)
Vue.use(require('vue-moment'));


// 导航守卫
router.beforeEach((to, from, next) => {
  let token = store.state.token
  if(to.path != '/'){
    watermark.set(store.state.user.userName)
  }else{
    watermark.set("")
  }
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
