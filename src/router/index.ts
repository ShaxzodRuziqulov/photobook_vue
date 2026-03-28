import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import {authService} from "@/service/authService";
import { useStore } from "@/stores/store"
import {Role} from "@/typeModules/useModules";


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
                name: "Bosh sahifa",
                component: () =>import('../views/Dashboard.vue'),
                meta: {
                    requiresAuth: true,
                    icon: 'fa-solid fa-house'
                },
            },
            {
                path: '/tasks',
                name: 'Mening vazifalarim',
                component: () => import('../views/MyTasks.vue'),
                meta: {
                    requiresAuth: true,
                    icon: 'fa-solid fa-list-check'
                }
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
                path: '/users',
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

router.beforeEach(async (to, _, next) => {
    const authStore = authService();
    const token = localStorage.getItem("access_token");
    const isAuthenticated = !!token;
    const isLoginPage = to.name === "Login";

    if (!to.meta.requiresAuth) {
        if (isAuthenticated && isLoginPage) {
            if (!authStore.state.user) {
                await authStore.getCurrentUser();
            }
            const roles = authStore.state.roles;
            if (roles.includes("ROLE_ADMIN")) return next("/home");
            if (roles.includes("ROLE_MANAGER")) return next("/home");
            if (roles.includes("ROLE_OPERATOR"))  return next("/tasks");
            return next("/home");
        }
        return next();
    }

    // if (!isAuthenticated) {
    //     return next({ name: "Login" });
    // }
    //
    // if (!authStore.state.user) {
    //     const user = await authStore.getCurrentUser();
    //     if (!user) {
    //         return next({ name: "Login" });
    //     }
    // }

    next();
});

export default router