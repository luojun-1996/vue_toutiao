import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载vant组件库
import Vant from 'vant'

// 加载vant组件库样式
import 'vant/lib/index.css'

// 自动设置rem基准值(html标签字体大小)
import 'amfe-flexible'

// 加载全局样式(放到最后，覆盖第三方样式)
import './styles/index.less'

import './utils/dayjs.js'

// 全局注册vant中的组件
Vue.use(Vant);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
