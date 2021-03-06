
// 按需引入 Element
import Vue from 'vue'
import {
  Button, Select, FormItem, Form, Input, Message, Header, Container, Aside, Main, Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col,
  Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox, Tag, Tree, Option, Cascader, Alert, Tabs, TabPane, Steps, Step, CheckboxGroup, Checkbox, Upload
} from 'element-ui'
//导入弹开提示组件

import lang from 'element-ui/lib/locale/lang/zh-CN' // 'element-ui/lib/locale/lang/en'
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
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
//全局挂载
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm
