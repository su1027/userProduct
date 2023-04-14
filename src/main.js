import Vue from 'vue'
import App from './App.vue'
import echarts from './echarts'


// 引入方法或变量；可以挂载到原型VUE.prototype上
// import {data,methed} from './data.js
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
new Vue({
  render: h => h(App),
}).$mount('#app')
