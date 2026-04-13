import {defineStore} from "pinia";
import axiosInstance from "@/axios";
import {
    AllCategory,
    ExpensesForm,
    IFormData,
    IItems, IPaging,
    NotificationItem,
    Order, OrderCreateDto, OrderKind, OrderStatus, PagingRequest, PagingResponse, SocketNotification,
    UserForm, UserPagingRequest, UserTask,
} from '@/typeModules/useModules';
import {computed, ref, UnwrapRef} from "vue";
import router from "@/router";
export const useStore = defineStore('item', () => {
    const state = ref({

        albums: {
            items: [] as Order[],
        } as PagingResponse<Order>,

        vignettes: {
            items: [] as Order[],
        } as PagingResponse<Order>,

        pictures: {
            items: [] as Order[],
        } as PagingResponse<Order>,

        paging: {
            ALBUM: { pageNumber: 0, pageSize: 100, totalElements: 0, totalPages: 0 , last: true },
            VIGNETTE: { pageNumber: 0, pageSize: 100, totalElements: 0, totalPages: 0 , last: true },
            PICTURE: { pageNumber: 0, pageSize: 100, totalElements: 0, totalPages: 0 , last: true },
        },

        user: {
            items: [] as UserForm[],
        },
        users: {
            items: [] as UserForm[],
            pageNumber: 0,
            pageSize: 15,
            totalElements: 0,
            totalPages: 0,
            last: true,
        } as PagingResponse<UserForm>,
        tasks: {
            content: [] as UserTask[],
            pageNumber: 0,
            pageSize: 100,
            totalElements: 0,
            totalPages: 0,
            last: true,
        },
        items: [] as IItems[],
        alCategory: [] as AllCategory[],
        vignetteCategory: [] as AllCategory[],
        photoCategory: [] as AllCategory[],
        expenses: [] as ExpensesForm[],
        customers: [] as IFormData[],
        notifications: [] as NotificationItem[],
    });

    const unreadNotificationsCount = computed(
        () => state.value.notifications.filter(item => !item.read).length
    );

    const buildNotificationKey = (item: Partial<SocketNotification>) =>
        item.id ||
        [
            item.type,
            item.orderId,
            item.employeeId,
            item.createdAt,
        ].filter(Boolean).join(":");

    const normalizeNotification = (item: any): NotificationItem => ({
        id: item?.id || buildNotificationKey(item) || crypto.randomUUID(),
        type: item?.type || "ORDER_UPDATED",
        title: item?.title || "Bildirishnoma",
        message: item?.message || "",
        orderId: item?.orderId || item?.order_id || "",
        orderName: item?.orderName || item?.order_name || "",
        orderStatus: item?.orderStatus || item?.order_status || "IN_PROGRESS",
        employeeId: item?.employeeId || item?.employee_id || "",
        employeeName: item?.employeeName || item?.employee_name || "",
        stepOrder: Number(item?.stepOrder || item?.step_order || 0),
        workStatus: item?.workStatus || item?.work_status || "PENDING",
        actionRequired: Boolean(item?.actionRequired ?? item?.action_required),
        createdAt: item?.createdAt || item?.created_at || new Date().toISOString(),
        read: Boolean(item?.read ?? item?.isRead),
        readAt: item?.readAt || item?.read_at || null,
    });

    const upsertNotification = (notification: SocketNotification | NotificationItem | any) => {
        const normalized = normalizeNotification(notification);
        const index = state.value.notifications.findIndex(item => item.id === normalized.id);

        if (index === -1) {
            state.value.notifications.unshift(normalized);
            return normalized;
        }

        state.value.notifications[index] = {
            ...state.value.notifications[index],
            ...normalized,
        };

        const [existing] = state.value.notifications.splice(index, 1);
        state.value.notifications.unshift(existing);
        return existing;
    };

    const clearNotifications = () => {
        state.value.notifications = [];
    };

    const loadNotifications = async () => {
        const { data } = await axiosInstance.get("/api/v1/notifications/me");
        const notifications = Array.isArray(data) ? data.map(normalizeNotification) : [];

        state.value.notifications = notifications.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    };

    const markNotificationRead = async (id: string) => {
        await axiosInstance.put(`/api/v1/notifications/${id}/read`);
        const target = state.value.notifications.find(item => item.id === id);
        if (target) {
            target.read = true;
            target.readAt = new Date().toISOString();
        }
    };

    const markAllNotificationsRead = async () => {
        await axiosInstance.put("/api/v1/notifications/read-all");
        state.value.notifications = state.value.notifications.map(item => ({
            ...item,
            read: true,
            readAt: item.readAt || new Date().toISOString(),
        }));
    };

    const loadOrders = async (
        kind: OrderKind,
        params: Partial<PagingRequest> = {}
    ) => {

        const paging = state.value.paging[kind]

        const body: PagingRequest = {
            page: paging.pageNumber,
            size: paging.pageSize,
            kind,
            sort: "acceptedDate",
            ...params
        }

        const { data } = await axiosInstance.post(
            "/api/v1/orders/paging",
            body
        )

        const mapped: PagingResponse<Order> = {
            items: data.content,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
            last: data.last,
        }

        if (kind === "ALBUM") state.value.albums = mapped
        if (kind === "VIGNETTE") state.value.vignettes = mapped
        if (kind === "PICTURE") state.value.pictures = mapped

        state.value.paging[kind].pageNumber = mapped.pageNumber
        state.value.paging[kind].totalElements = mapped.totalElements
        state.value.paging[kind].totalPages = mapped.totalPages
    }

// ─── CRUD — barchasi faqat kind bilan chaqiradi ───────────────────────────────
    const addOrder = async (item: OrderCreateDto) => {

        await axiosInstance.post("/api/v1/orders", item)

        await loadOrders(item.kind)
    }

    const updateOrder = async (id: string, item: OrderCreateDto) => {
        await axiosInstance.put(`/api/v1/orders/${id}`, item)
        await loadOrders(item.kind)
    }

    const deleteOrder = async (id: string, kind: OrderKind) => {
        await axiosInstance.delete(`/api/v1/orders/${id}`)
        await loadOrders(kind)
    }

// ─── Pagination — filter parametrlarini ham oladi ────────────────────────────
    const changePage = async (
        kind: OrderKind,
        page: number,
        params: Partial<PagingRequest> = {}  // ✅ optional
    ) => {
        const key = kind as OrderKind;
        state.value.paging[key].pageNumber = page;
        await loadOrders(kind, params);
    };

    // const getOrderById = async (id: string): Promise<Order | null> => {
    //     try {
    //         const { data } = await axiosInstance.get<Order>(`/api/v1/orders/${id}`);
    //         return data;
    //     } catch (error) {
    //         console.error("getOrderById error:", error);
    //         return null;
    //     }
    // };

    // const updateOrderStatus = async (
    //     id: string,
    //     kind: OrderKind,
    //     status: OrderStatus
    // ): Promise<void> => {
    //     await axiosInstance.put(`/api/v1/orders/${id}/status`, { status });
    //     await loadOrders(kind);
    // };
    //
    // const getStatusHistory = async (id: string) => {
    //     try {
    //         const { data } = await axiosInstance.get(`/api/v1/orders/${id}/status-history`);
    //         return data;
    //     } catch (error) {
    //         console.error("getStatusHistory error:", error);
    //         return [];
    //     }
    // };


    // const loadGetUsers = async (filters: Partial<UserPagingRequest> = {} ) => {
    //     const body: UserPagingRequest = {
    //         page: state.value.users.pageNumber || 0,
    //         size: state.value.users.pageSize || 100,
    //         sort: ['acceptedDate', 'DESC'],
    //         ...filters,
    //     }
    //     const response = await axiosInstance.post<PagingResponse<UserForm>>("/api/v1/users", body);
    //         state.value.users = response.data;
    //     };

    const loadUsers = async () => {

        const { data } = await axiosInstance.get<UserForm[]>("/api/v1/users")
        state.value.user.items = data

    }

    const addUser = async (user: UserForm) => {

        const { id, ...userData } = user;

        const body = {
            ...userData,
        }

        await axiosInstance.post("/api/v1/users", body)
    }

    const updateUser = async (id: string, user: UserForm) => {

        const { ...userData } = user;

        const body = {
            ...userData,
        }
        await axiosInstance.put(`/api/v1/users/${id}`, body)
    }

    const deleteUser = async (id: string) => {
        await axiosInstance.delete(`/api/v1/users/${id}`)
        await loadUsers()
    }

    const loadGetUserTasks = async (filters: Partial<IPaging> = {} ) => {
        const res = await axiosInstance.post("/api/v1/user-tasks/me/paging",
            {
                search: filters.search || '',
                statuses: filters.statuses || [],
                from: filters.from,
                to: filters.to,
                deadlineFrom: filters.deadlineFrom,
                deadlineTo: filters.deadlineTo,
            },
            {
                params: {
                    page: filters.page ?? 0,
                    size: filters.size ?? 100,
                    sort: filters.sort || [],
                },
            }
            );
        state.value.tasks = {
            content: res.data.content || [],
            pageNumber: res.data.pageNumber,
            pageSize: res.data.pageSize,
            totalElements: res.data.totalElements,
            totalPages: res.data.totalPages,
            last: res.data.last,
        }
    }

    const refreshFromNotification = async (notification: SocketNotification) => {
        upsertNotification(notification);

        const currentPath = router.currentRoute.value.path;

        if (currentPath === "/tasks") {
            await loadGetUserTasks();
            return;
        }

        const shouldRefreshOrders =
            ["/album", "/vignette", "/photo"].includes(currentPath) &&
            ["ORDER_UPDATED", "ORDER_STATUS_CHANGED"].includes(notification.type);

        if (!shouldRefreshOrders) return;

        await Promise.all([
            loadOrders("ALBUM"),
            loadOrders("VIGNETTE"),
            loadOrders("PICTURE"),
        ]);
    }

    // const loadRole = async () => {
    //     const res = await axiosInstance.get('/api/v1/roles');
    //     state.value.roles = res.data
    // }

    const loadUploadImage = async (file: File) => {
        const fd = new FormData()
        fd.append("file", file)
        const { data } = await axiosInstance.post('/api/v1/uploads', fd, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return data
    }

    const loadMaterials = async () => {
        const res = await axiosInstance.get('/api/v1/materials');
        state.value.items = res.data
    }

    const addMaterial = async (item: Omit<UnwrapRef<IItems>, "id">) => {
        await axiosInstance.post("/api/v1/materials", item)
        await loadMaterials()
    }

    const updateMaterial = async (id: string | null, item: IItems) => {
        await axiosInstance.put(`/api/v1/materials/${id}`, item)
        await loadMaterials()
    }

    const deleteMaterial = async (id: string | null) => {
        await axiosInstance.delete(`/api/v1/materials/${id}`)
        await loadMaterials()
    }

    const loadCategory = async (kind: OrderKind) => {
        const response = await axiosInstance.get('/api/v1/product-categories', {
            params: { kind }
        });
        const filtered = response.data.filter(
            (item: AllCategory) => item.kind === kind
        );

        if (kind === "ALBUM") {
            state.value.alCategory = filtered;
        }

        if (kind === "VIGNETTE") {
            state.value.vignetteCategory = filtered;
        }

        if (kind === "PICTURE") {
            state.value.photoCategory = filtered;
        }
    };

    const addCategory = async (item: AllCategory) => {
        await axiosInstance.post('/api/v1/product-categories', item )
        await loadCategory(item.kind)
    }

    const updateCategory = async (id: string, item: AllCategory) => {
        const { id: _, ...itemData } = item;
        await axiosInstance.put(`/api/v1/product-categories/${id}`, {
            ...itemData
        })
        await loadCategory(item.kind)
    }

    const deleteCategory = async (id: string | null, kind: OrderKind) => {
        await axiosInstance.delete(`/api/v1/product-categories/${id}`)
        await loadCategory(kind)
    }

    return {
        state,
        unreadNotificationsCount,
        loadCategory,
        changePage,
        // loadRole,
        loadUploadImage,
        clearNotifications,
        loadNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        upsertNotification,
        refreshFromNotification,
        loadGetUserTasks,
        addUser, updateUser, deleteUser, loadUsers,
        loadMaterials, addMaterial, updateMaterial, deleteMaterial,
        loadOrders, addOrder, updateOrder, deleteOrder,
        addCategory, updateCategory, deleteCategory,
    }
})
