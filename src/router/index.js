import Vue from 'vue'
import Router from 'vue-router'
import LoginIn from '@/components/LoginIn'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from "@/components/user/Users"
import Rights from "@/components/power/Rights"

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'LoginIn',
      component: LoginIn
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        }

      ]
    }
  ]
});

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 将要访问的路径
  //from 代表从哪个路经跳转而来
  // next 是一个函数， 表示放行
  // next 放行 next('/login') 强制跳转
  if (to.path == '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login');
  next();
})
export default router;
