import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
// import {authService} from "@/service/authService";


const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Main",
        redirect: "/home",
        component: () => import('@/Layout/Layouts.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: "/home",
                name: "Dashboard",
                component: () =>import('../views/Dashboard.vue'),
                meta: {
                    requiresAuth: true,
                    icon: 'fa-solid fa-house'
                },
            },
            {
                path: "/album",
                name: "Albom",
                component: () =>import('../views/Album.vue'),
                meta: {
                    requiresAuth: true,
                    icon: 'fa-solid fa-book'
                },
            },
            {
                path: "/vignette",
                name: "Vinetka",
                component: () =>import('../views/Vinetka.vue'),
                meta: {
                    requiresAuth: true,
                    icon: 'fa-solid fa-book-open'
                }
            },
            {
                path: "/photo",
                name: "Rasmli albom",
                component: () =>import('../views/PhotoAlbum.vue'),
                meta: {
                    requiresAuth: true,
                    icon: 'fa-solid fa-images'
                }
            },
            {
                path: '/employee',
                name: 'Xodimlar',
                component: () =>import('../views/Employees.vue'),
                meta: {
                    requiresAuth: true,
                    icon: 'fa-solid fa-users'
                },
            },
            {
                path: '/material',
                name: 'Xomashyo',
                component: () => import('../views/Materials.vue'),
                meta: {
                    requiresAuth: true,
                    icon: 'fa-solid fa-boxes'
                }
            },
            {
                path: '/category',
                name: 'Kategoriyalar',
                component: () =>import('../views/Categories.vue'),
                meta: {
                    requiresAuth: true,
                    icon: 'fa-solid fa-tags'
                },
            },
            {
                path: '/profile',
                name: 'UserProfile',
                component: () =>import('../views/UserProfile.vue'),
                meta: {
                    requiresAuth: true,
                    icon: 'fas fa-user'
                },
            }
        ]
    },
    {
        path: '/register',
        name: 'Register',
        component: () =>import('../views/Register.vue'),
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>import('../views/Login.vue'),
    }

]
const router = createRouter({
    routes,
    history: createWebHistory(),
})

// router.beforeEach(async (to, _, next) => {
    // const authStore = authService();
    // const token = localStorage.getItem("accessToken");
    // const isAuthenticated = !!token;
    // // const isLoginPage = to.name === "LoginVue";
    // let roles: string[] = authStore.state.roles || [];
    //
    // if (to.meta.requiresAuth && !isAuthenticated) {
    //     return next({name: 'Login'});
    // }
    //
    // if (isAuthenticated && (!roles || roles.length === 0)) {
    //     try {
    //         await authStore.getCurrentUser()
    //         roles = authStore.state.roles || [];
    //     } catch (error) {
    //         console.error('Failed to fetch user data:', error);
    //         return next({name: 'Login'});
    //     }
    // }
    //
    // next();
// })
export default router