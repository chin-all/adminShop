import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: "/login",
      component: () => import("@/pages/Login")
    }, {
      path: "/",
      component: () => import("@/pages/Layout"),
      children:[{
        path:"index",
        component:() =>import("@/pages/Index")
      },{
        path:"menu",
        component:() =>import("@/pages/Menu")
      },{
        path:"role",
        component:() =>import("@/pages/Role")
      },{
        path:"user",
        component:() =>import("@/pages/User")
      },{
        path:"*",
        redirect: "/index"
      }]
    }
  ]
});

router.beforeEach((to, from, next) => {
  // 以是否存在token判断是否登录
  let token = localStorage.getItem("info") ? JSON.parse(localStorage.getItem("info")).token : false;
  if (token) {
    if (to.path == "/login") {
      next(false);
    } else {
      next()
    }
  } else {
    // 未登录
    if (to.path == "/login") {
      next()
    } else {
      next("/login")
    }
  }
})


export default router