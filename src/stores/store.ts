import {defineStore} from "pinia";
import axiosInstance from "@/axios";
import {
    AllCategory,
    ExpensesForm,
    IFormData,
    IItems, IPaging,
    NotificationItem, NotificationPagingRequest, NotificationType,
    Order, OrderCreateDto, OrderKind, OrderStatus, PagingRequest, PagingResponse, SocketNotification,
    UserForm, UserTask,
    WorkStatus,
} from '@/typeModules/useModules';
import {computed, ref, UnwrapRef} from "vue";
import router from "@/router";

const NOTIFICATION_LIMIT = 100;
const REALTIME_NOTIFICATION_CLOCK_SKEW_MS = 5000;
const ORDER_FETCH_SIZE = 100;
const DEFAULT_ORDER_SORT = "updatedAt,desc";
const orderStateKeyByKind: Record<OrderKind, "albums" | "vignettes" | "pictures"> = {
    ALBUM: "albums",
    VIGNETTE: "vignettes",
    PICTURE: "pictures",
};

/** In-memory only; `markNotificationRead` API ga yuborilmaydi */
const LOCAL_NOTIFICATION_PREFIX = "local:";

const ORDER_STATUSES: OrderStatus[] = ["PENDING", "IN_PROGRESS", "PAUSED", "COMPLETED"];

const parseOrderStatus = (value?: string): OrderStatus =>
    (value && ORDER_STATUSES.includes(value as OrderStatus) ? value : "IN_PROGRESS") as OrderStatus;

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
            ALBUM: { pageNumber: 0, pageSize: 10, totalElements: 0, totalPages: 0 , last: true },
            VIGNETTE: { pageNumber: 0, pageSize: 10, totalElements: 0, totalPages: 0 , last: true },
            PICTURE: { pageNumber: 0, pageSize: 10, totalElements: 0, totalPages: 0 , last: true },
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
        notificationsPaging: {
            items: [] as NotificationItem[],
            pageNumber: 0,
            pageSize: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
        } as PagingResponse<NotificationItem>,
        notificationsUnreadCount: 0,
        notificationsLoadedAt: Date.now(),
        lastRealtimeNotification: null as { key: string; item: NotificationItem } | null,
    });

    const unreadNotificationsCount = computed(
        () => state.value.notificationsUnreadCount
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
        kind: item?.kind || item?.orderKind || item?.order_kind,
        orderKind: item?.orderKind || item?.order_kind || item?.kind,
        targetType: item?.targetType || item?.target_type || "",
        targetId: item?.targetId || item?.target_id || item?.orderId || item?.order_id || "",
        targetKind: item?.targetKind || item?.target_kind || item?.orderKind || item?.order_kind || item?.kind,
        route: item?.route || "",
        orderId: item?.orderId || item?.order_id || "",
        orderName: item?.orderName || item?.order_name || "",
        orderStatus: item?.orderStatus || item?.order_status || "IN_PROGRESS",
        employeeId: item?.employeeId || item?.employee_id || "",
        employeeName: item?.employeeName || item?.employee_name || "",
        stepOrder: Number(item?.stepOrder || item?.step_order || 0),
        workStatus: item?.workStatus || item?.work_status || "PENDING",
        actionRequired: Boolean(item?.actionRequired ?? item?.action_required),
        createdAt: item?.createdAt || item?.created_at || new Date().toISOString(),
        read: Boolean(item?.read ?? item?.isRead ?? item?.is_read),
        readAt: item?.readAt || item?.read_at || null,
    });

    const upsertNotification = (notification: SocketNotification | NotificationItem | any) => {
        const normalized = normalizeNotification(notification);
        const index = state.value.notifications.findIndex(item => item.id === normalized.id);

        if (index === -1) {
            state.value.notifications.unshift(normalized);
            state.value.notifications = state.value.notifications.slice(0, NOTIFICATION_LIMIT);
            if (!normalized.read) {
                state.value.notificationsUnreadCount += 1;
            }
            return normalized;
        }

        const wasRead = state.value.notifications[index].read;

        state.value.notifications[index] = {
            ...state.value.notifications[index],
            ...normalized,
            read: state.value.notifications[index].read || normalized.read,
        };

        if (!wasRead && state.value.notifications[index].read) {
            state.value.notificationsUnreadCount = Math.max(0, state.value.notificationsUnreadCount - 1);
        }

        const [existing] = state.value.notifications.splice(index, 1);
        state.value.notifications.unshift(existing);
        state.value.notifications = state.value.notifications.slice(0, NOTIFICATION_LIMIT);
        return existing;
    };

    const clearNotifications = () => {
        state.value.notifications = [];
        state.value.notificationsUnreadCount = 0;
        state.value.lastRealtimeNotification = null;
        state.value.notificationsLoadedAt = Date.now();
        state.value.notificationsPaging = {
            items: [],
            pageNumber: 0,
            pageSize: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
        };
    };

    const normalizePaging = <T>(data: any, fallbackPage: number, fallbackSize: number, items: T[]): PagingResponse<T> => {
        const totalElements = data.totalElements ?? data.total_elements ?? items.length;
        const pageSize = data.pageSize ?? data.size ?? data.page_size ?? fallbackSize;
        const totalPages = data.totalPages ?? data.total_pages ?? Math.ceil(totalElements / pageSize);

        return {
            items,
            pageNumber: data.pageNumber ?? data.number ?? data.page_number ?? fallbackPage,
            pageSize,
            totalElements,
            totalPages,
            last: data.last ?? fallbackPage + 1 >= totalPages,
        };
    };

    const refreshUnreadNotificationsCount = async () => {
        const { data } = await axiosInstance.get("/api/v1/notifications/me/unread-count");
        state.value.notificationsUnreadCount = Number(data?.count ?? 0);
    };

    const loadNotifications = async (filters: NotificationPagingRequest = {}, append = false) => {
        const page = filters.page ?? (append ? state.value.notificationsPaging.pageNumber + 1 : 0);
        const size = filters.size ?? state.value.notificationsPaging.pageSize ?? 10;
        const sort = filters.sort || "createdAt,desc";
        const { page: _page, size: _size, sort: _sort, ...body } = filters;
        const requestBody = Object.fromEntries(
            Object.entries(body).filter(([, value]) => value !== undefined && value !== "")
        );

        const { data } = await axiosInstance.post(
            "/api/v1/notifications/me/paging",
            requestBody,
            {
                params: {
                    page,
                    size,
                    sort,
                },
            }
        );

        const notifications: NotificationItem[] = (data.content || data.items || []).map(normalizeNotification);
        const paging = normalizePaging(data, page, size, notifications);
        const nextItems: NotificationItem[] = append
            ? [...state.value.notifications, ...notifications]
            : notifications;

        state.value.notifications = nextItems
            .filter((item: NotificationItem, index: number, list: NotificationItem[]) =>
                list.findIndex((current: NotificationItem) => current.id === item.id) === index
            )
            .sort((a: NotificationItem, b: NotificationItem) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .slice(0, NOTIFICATION_LIMIT);

        state.value.notificationsPaging = {
            ...paging,
            items: state.value.notifications,
        };

        if (requestBody.isRead === false) {
            state.value.notificationsUnreadCount = paging.totalElements;
        } else {
            await refreshUnreadNotificationsCount();
        }

        state.value.notificationsLoadedAt = Date.now();
    };

    const markNotificationRead = async (id: string) => {
        await axiosInstance.put(`/api/v1/notifications/${id}/read`);
        const target = state.value.notifications.find(item => item.id === id);
        if (target && !target.read) {
            target.read = true;
            target.readAt = new Date().toISOString();
            state.value.notificationsUnreadCount = Math.max(0, state.value.notificationsUnreadCount - 1);
        }
    };

    const markNotificationReadLocal = (id: string) => {
        if (!id.startsWith(LOCAL_NOTIFICATION_PREFIX)) return;
        const target = state.value.notifications.find(item => item.id === id);
        if (target && !target.read) {
            target.read = true;
            target.readAt = new Date().toISOString();
            state.value.notificationsUnreadCount = Math.max(0, state.value.notificationsUnreadCount - 1);
        }
    };

    const markAllNotificationsRead = async () => {
        await axiosInstance.put("/api/v1/notifications/read-all");
        state.value.notifications = state.value.notifications.map(item => ({
            ...item,
            read: true,
            readAt: item.readAt || new Date().toISOString(),
        }));
        state.value.notificationsUnreadCount = 0;
    };

    const removeEmptyFields = <T extends Record<string, unknown>>(item: T) =>
        Object.fromEntries(
            Object.entries(item).filter(([, value]) => value !== undefined && value !== null && value !== "")
        ) as Partial<T>;

    const buildOrderPagingBody = (params: Partial<PagingRequest>): Partial<PagingRequest> => {
        const acceptedDate = params.acceptedDate ?? params.from;
        const deadline = params.deadline ?? params.to ?? params.deadlineTo;

        return removeEmptyFields({
            search: params.search?.trim() || undefined,
            status: params.status || undefined,
            acceptedDate: acceptedDate || undefined,
            deadline: deadline || undefined,
        });
    };

    const createOrderPage = (
        items: Order[],
        page: number,
        size: number
    ): PagingResponse<Order> => {
        const totalElements = items.length;
        const totalPages = Math.ceil(totalElements / size);
        const pageNumber = totalPages === 0 ? 0 : Math.min(page, totalPages - 1);

        return {
            items: items.slice(pageNumber * size, pageNumber * size + size),
            pageNumber,
            pageSize: size,
            totalElements,
            totalPages,
            last: totalPages === 0 || pageNumber + 1 >= totalPages,
        };
    };

    const setOrderPaging = (kind: OrderKind, pageData: PagingResponse<Order>) => {
        state.value[orderStateKeyByKind[kind]] = pageData;

        state.value.paging[kind] = {
            ...state.value.paging[kind],
            pageNumber: pageData.pageNumber,
            pageSize: pageData.pageSize,
            totalElements: pageData.totalElements,
            totalPages: pageData.totalPages,
            last: pageData.last,
        };
    };

    const isLastOrderPage = (data: any, items: Order[], backendPage: number) => {
        const totalPages = data.totalPages ?? data.total_pages;

        return Boolean(data.last)
            || items.length === 0
            || (totalPages !== undefined && backendPage + 1 >= totalPages);
    };

    const fetchAllOrders = async (
        body: Partial<PagingRequest>,
        sort: string
    ): Promise<Order[]> => {
        const orders: Order[] = [];
        let backendPage = 0;

        while (true) {
            const { data } = await axiosInstance.post(
                "/api/v1/orders/paging",
                body,
                {
                    params: {
                        page: backendPage,
                        size: ORDER_FETCH_SIZE,
                        sort,
                    },
                }
            );

            const items: Order[] = data.content || data.items || [];
            orders.push(...items);

            if (isLastOrderPage(data, items, backendPage)) break;
            backendPage += 1;
        }

        return orders;
    };

    const loadOrders = async (
        kind: OrderKind,
        params: Partial<PagingRequest> = {}
    ) => {
        const paging = state.value.paging[kind];
        const page = params.page ?? params.pageNumber ?? paging.pageNumber;
        const size = params.size ?? params.pageSize ?? paging.pageSize;
        const body = buildOrderPagingBody(params);
        const sort = params.sort || DEFAULT_ORDER_SORT;
        const orders = await fetchAllOrders(body, sort);
        const kindOrders = orders.filter(item => item.kind === kind);

        setOrderPaging(kind, createOrderPage(kindOrders, page, size));
    };

    const pushLocalOrderActivitySignal = (input: {
        action: "created" | "updated" | "deleted";
        orderId: string;
        orderName: string;
        kind: OrderKind;
        status?: string;
    }) => {
        const title =
            input.action === "created"
                ? "Buyurtma qo'shildi"
                : input.action === "updated"
                    ? "Buyurtma saqlandi"
                    : "Buyurtma o'chirildi";
        const message =
            input.action === "deleted"
                ? `«${input.orderName}» o'chirildi`
                : `«${input.orderName}»`;

        const id = `${LOCAL_NOTIFICATION_PREFIX}order:${input.action}:${input.orderId}:${Date.now()}`;
        const payload: SocketNotification = {
            id,
            type: "ORDER_UPDATED" as NotificationType,
            title,
            message,
            orderId: input.orderId,
            orderName: input.orderName,
            orderKind: input.kind,
            kind: input.kind,
            targetKind: input.kind,
            orderStatus: parseOrderStatus(input.status),
            employeeId: "",
            employeeName: "",
            stepOrder: 0,
            workStatus: "PENDING" as WorkStatus,
            actionRequired: false,
            createdAt: new Date().toISOString(),
            read: false,
        };

        const normalized = upsertNotification(payload);
        state.value.lastRealtimeNotification = {
            key: `${normalized.id}:${Date.now()}`,
            item: normalized,
        };
    };

    // Order CRUD
    const addOrder = async (item: OrderCreateDto) => {
        const { data } = await axiosInstance.post("/api/v1/orders", item);
        await loadOrders(item.kind);
        const createdId =
            data && typeof data === "object"
                ? String((data as { id?: string }).id ?? (data as { orderId?: string }).orderId ?? "").trim()
                : "";
        pushLocalOrderActivitySignal({
            action: "created",
            orderId: createdId || "new",
            orderName: item.orderName,
            kind: item.kind,
            status: item.status,
        });
    };

    const updateOrder = async (id: string, item: OrderCreateDto) => {
        await axiosInstance.put(`/api/v1/orders/${id}`, item);
        await loadOrders(item.kind);
        pushLocalOrderActivitySignal({
            action: "updated",
            orderId: id,
            orderName: item.orderName,
            kind: item.kind,
            status: item.status,
        });
    };

    const deleteOrder = async (id: string, kind: OrderKind) => {
        const bucket = state.value[orderStateKeyByKind[kind]];
        const existing = bucket.items.find((order: Order) => order.id === id);
        const orderName = existing?.orderName || "Buyurtma";
        await axiosInstance.delete(`/api/v1/orders/${id}`);
        await loadOrders(kind);
        pushLocalOrderActivitySignal({
            action: "deleted",
            orderId: id,
            orderName,
            kind,
            status: existing?.status,
        });
    };

    const changePage = async (
        kind: OrderKind,
        page: number,
        params: Partial<PagingRequest> = {}
    ) => {
        state.value.paging[kind].pageNumber = page;
        await loadOrders(kind, {...params, page});
    };
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
        const normalized = upsertNotification(notification);
        const createdAtTime = new Date(normalized.createdAt).getTime();
        const isNewRealtimeNotification =
            !Number.isNaN(createdAtTime) &&
            createdAtTime >= state.value.notificationsLoadedAt - REALTIME_NOTIFICATION_CLOCK_SKEW_MS;

        if (isNewRealtimeNotification) {
            state.value.lastRealtimeNotification = {
                key: `${normalized.id}:${Date.now()}`,
                item: normalized,
            };
        }

        const currentPath = router.currentRoute.value.path;

        if (currentPath === "/tasks") {
            await loadGetUserTasks();
            return;
        }

        const kindByPath: Record<string, OrderKind> = {
            "/album": "ALBUM",
            "/vignette": "VIGNETTE",
            "/photo": "PICTURE",
            "/picture": "PICTURE",
        };

        const currentOrderKind = kindByPath[currentPath];
        const shouldRefreshOrders =
            Boolean(currentOrderKind) &&
            ["ORDER_UPDATED", "ORDER_STATUS_CHANGED", "ORDER_ASSIGNED"].includes(notification.type);

        if (!shouldRefreshOrders) return;

        await loadOrders(currentOrderKind);
    }

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
        loadUploadImage,
        clearNotifications,
        loadNotifications,
        markNotificationRead,
        markNotificationReadLocal,
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
