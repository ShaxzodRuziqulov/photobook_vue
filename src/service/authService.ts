import { defineStore } from "pinia";
import { ref } from "vue";
import { IUser } from "@/typeModules/IUser";
import {Role, UserLogin} from "@/typeModules/useModules";
import axiosInstance from "@/axios";
import router from "@/router";

interface UserState {
    user: IUser | null;
    token: string | null;
    roles: string[];
}

export const authService = defineStore("authService", () => {

    const state = ref<UserState>({
        user: null,
        token: localStorage.getItem("access_token"),
        roles: [],
    });

    const setUser = (user: IUser) => {
        state.value.user = user;
        if (user.roles) {
            state.value.roles = Array.isArray(user.roles)
                ? user.roles.map(role => typeof role === "string" ? role : role.name)
                : [user.roles];
        } else {
            state.value.roles = [];
        }
    };

    const setToken = (token: string) => {
        state.value.token = token;
        localStorage.setItem("access_token", token);
    };

    const clearUser = () => {
        state.value.user = null;
        state.value.token = null;
        state.value.roles = [];
        localStorage.removeItem("access_token");
    };

    const loadRole = async () => {
        const res = await axiosInstance.get('/api/v1/roles');
        state.value.roles = res.data
        return res;
    }

    const loadChangeRole = async (id: string, roleIds: Role[]) => {
        return await axiosInstance.put(`/api/v1/users/${id}/roles`, { roleIds: roleIds });
    }

    const login = async (user: UserLogin) => {
        const { data } = await axiosInstance.post("/api/v1/auth/login", user);
        // if (!data?.access_token) {
        //     throw new Error("Token kelmadi");
        // }

        setToken(data.access_token);
        setUser(data.user);

        const roles = state.value.roles;
        if (roles.includes("ROLE_ADMIN")) {
            await router.push("/home");
        } else if (roles.includes("ROLE_MANAGER")) {
            await router.push("/home");
        } else if (roles.includes("ROLE_OPERATOR")) {
            await router.push("/tasks");
        } else {
            await router.push("/home");
        }
    };

    const getCurrentUser = async (): Promise<IUser | null> => {
        const token = state.value.token || localStorage.getItem("access_token");
        if (!token) return null;

        if (!state.value.token) setToken(token);

        try {
            const { data } = await axiosInstance.get("/api/v1/users/me");
            setUser(data);
            return data;
        } catch (error) {
            console.error("getCurrentUser error:", error);
            clearUser();
            return null;
        }
    };

    const logout = async () => {
        clearUser();
        await router.push("/login");
    };

    return {
        state,
        setUser,
        setToken,
        clearUser,
        login,
        loadRole,
        loadChangeRole,
        getCurrentUser,
        logout,
    };
});