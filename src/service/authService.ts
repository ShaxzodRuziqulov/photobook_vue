import { defineStore } from "pinia";
import { ref } from "vue";
import { IUser } from "@/typeModules/IUser";
import {Role, UserLogin} from "@/typeModules/useModules";
import axiosInstance from "@/axios";
import router from "@/router";
import { socketService } from "@/service/socketService";
import { useStore } from "@/stores/store";

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

    const normalizeUser = (user: any): IUser => {
        const fullName = String(user?.name || "").trim();
        const [derivedFirstName = "", ...derivedLastNameParts] = fullName.split(" ");

        return {
            id: user?.id || "",
            firstName: user?.firstName || user?.first_name || derivedFirstName || "",
            lastName: user?.lastName || user?.last_name || derivedLastNameParts.join(" ") || "",
            profession: user?.profession || "",
            username: user?.username || "",
            password: user?.password || "",
            avatarUrl: user?.avatarUrl || user?.avatar_url || "",
            phone: user?.phone || null,
            bio: user?.bio || "",
            isActive: typeof user?.isActive === "boolean" ? user.isActive : true,
            uploadId: user?.uploadId || user?.upload_id || "",
            roles: Array.isArray(user?.roles) ? user.roles : [],
        };
    };

    const setUser = (user: IUser | any) => {
        const normalizedUser = normalizeUser(user);

        state.value.user = normalizedUser;
        if (normalizedUser.roles) {
            state.value.roles = Array.isArray(normalizedUser.roles)
                ? normalizedUser.roles.map(role => typeof role === "string" ? role : role.name)
                : [normalizedUser.roles];
        } else {
            state.value.roles = [];
        }
    };

    const setToken = (token: string) => {
        state.value.token = token;
        localStorage.setItem("access_token", token);
        socketService.connect(token);
    };

    const clearUser = () => {
        const appStore = useStore();
        state.value.user = null;
        state.value.token = null;
        state.value.roles = [];
        localStorage.removeItem("access_token");
        appStore.clearNotifications();
        socketService.disconnect();
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
        const appStore = useStore();
        const { data } = await axiosInstance.post("/api/v1/auth/login", user);

        setToken(data.access_token);
        setUser(data.user);
        await appStore.loadNotifications();

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
        const appStore = useStore();
        const token = state.value.token || localStorage.getItem("access_token");
        if (!token) return null;

        state.value.token = token;


        try {
            const { data } = await axiosInstance.get("/api/v1/users/me");
            setUser(data);
            await appStore.loadNotifications();
            socketService.connect(token);
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
