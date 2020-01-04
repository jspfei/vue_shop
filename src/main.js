// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/global.css'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
import axios from 'axios'
// //配置请求的根路径 使用mock数据的时候，baseURL 就不要设置 否则会报错 404
// axios.defaults.baseURL = 'http://localhost:8081/'

//axios请求拦截
axios.interceptors.request.use(config => {

  config.headers.Authorization = window.sessionStorage.getItem('token')
  console.log(config)
  return config;
})
// 返回状态判断 

axios.interceptors.response.use((res) => {
  if (!res.data.success) {
    return Promise.reject(res)
  }
  return res
}, (error) => {
  // 404等问题可以在这里处理
  return Promise.reject(error)
})
Vue.prototype.$http = axios;

//引入Mock
require('./mock')
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)

Vue.filter("dateFormat", function (orginVal) {

  const dt = new Date(orginVal)

  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')

  const mm = (dt.getMinutes() + '').padStart(2, '0')

  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
