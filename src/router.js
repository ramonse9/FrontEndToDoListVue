import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Actividad from './components/Actividades.vue'
import Login from './components/Login.vue'
import store from './store'
import Inicio from './components/Inicio.vue'

Vue.use(Router)

var router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            name: 'home',
            component: Home,
            meta: {
                identificado: true
            }
        },
        {
            path: '/actividades',
            name: 'actividades',
            component: Actividad,
            meta: {
                logueado: true
            }
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: {
                libre: true
            }
        },
        {
            path: '/inicio',
            name: 'inicio',
            component: Inicio,
            meta: {
                logueado: true
            }
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.libre)) {
        next()
    } else if (store.state.usuario) {
        if (to.matched.some(record => record.meta.logueado)) {
            next()
        }
    } else {
        next({
            name: 'login'
        })
    }
})

export default router