// 引入模块
import Vue from "vue"
import VueRouter from "vue-router"

// 使用插件
Vue.use(VueRouter)



// 导入组件
import Home from "./Home"
import Home from "./App"


// 配置路由与组件映射关系

let routes = [
    {
        path:'/home',
        name:"home",
        Component: Home
    },
    {
        path:'/app',
        name:"app",
        Component: App
    },
]
const router = new VueRouter({
    routes
})
export default router