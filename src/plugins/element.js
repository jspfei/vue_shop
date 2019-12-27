
// 按需引入 Element
import Vue from 'vue'
import { Button, Select, FormItem, Form, Input } from 'element-ui'
//导入弹开提示组件
import { Message } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import 'element-ui/lib/theme-chalk/index.css'
// 设置语言
locale.use(lang)

// 引入组件
Vue.use(Button)
Vue.use(Select)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

Vue.prototype.$message = Message;