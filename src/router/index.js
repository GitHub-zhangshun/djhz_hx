import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/views/Layout.vue'

Vue.use(Router)

export default new Router({
    mode:'history',
    routes: [       
        {
            path: '/',
            name: 'layout',
            component: layout,
            redirect:'search',
            meta:{
                requireAuth: true,
            },
            children:[
                //订单核销
                {
                    path: 'search',
                    name: 'search',
                    component: (resolve) => require(['@/views/search.vue'], resolve),
                    meta: {
                        title: '订单核销',
                        requireAuth: true,
                    }
                },
                //订单列表
                {
                    path: 'order_list',
                    component: (resolve) => require(['@/views/order_list.vue'], resolve),
                    meta: {
                        requireAuth: true,
                        title:'商城订单'
                    }
                },
                //门店详情
                {
                    path: 'stores_detail',
                    component: (resolve) => require(['@/views/stores_detail.vue'], resolve),
                    meta: {
                        title: '门店详情',
                        requireAuth: true
                    }
                },
            ]
        },
        //登录
        {
            path: '/login',
            name: 'login',
            component: (resolve) => require(['@/views/login.vue'], resolve),
            meta: {
                title: '登录'
            }
        },
        //订单详情
        {
            path: '/ticketdetail',
            component: (resolve) => require(['@/views/TicketDetail.vue'], resolve),
            meta: {
                title: '订单详情',
                requireAuth: true
            }
        },
        //门店列表
        {
            path: '/store',
            component: (resolve) => require(['@/views/stores_list.vue'], resolve),
            meta: {
                title: '门店列表',
                requireAuth: true
            }
        },
        //403
        {
            path: '/403',
            component: (resolve) => require(['@/views/403Page.vue'], resolve),
            meta: {
                title: '网络异常，请检查网络设置或稍后重试'
            }
        },
        //404
        {
            path: '/404',
            component: (resolve) => require(['@/views/404NotFound.vue'], resolve),
            meta: {
                title: '找不到页面'
            }
        },
        {
            path: '*', 
            redirect: "/404"
        },
        
    ]
})
