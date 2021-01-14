import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router =  new Router({
  routes: [
    {
      path: "/login",
      component: ()=>import("@/pages/login")
    },{
      path: "/",
      component: ()=>import("@/pages/layout")
    }
  ]
});

router.beforeEach((to,from,next)=>{
  // 以是否存在token判断是否登录
})




export default router