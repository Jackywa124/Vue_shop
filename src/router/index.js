import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  {path:'/home',component:Home},
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next)=>{
  if(to.path==='/login'){
    return next()
  }else{
    const tokenStr=window.sessionStorage.getItem('token')
    if(!tokenStr){
      return next('/login')
    }else next()
  }
})

export default router