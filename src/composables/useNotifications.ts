import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { notificationTypeOptions } from "@/constants/notificationTypes";
import { notificationSoundService } from "@/service/notificationSoundService";
import { authService } from "@/service/authService";
import { useStore } from "@/stores/store";
import type { NotificationItem, NotificationType, OrderKind } from "@/typeModules/useModules";

const notificationRouteByKind: Record<OrderKind, string> = {
    ALBUM: "/album",
    VIGNETTE: "/vignette",
    PICTURE: "/picture",
};

const normalizeKind = (value?: string | null): OrderKind | null => {
    if (!value) return null;
    if (value === "PHOTO") return "PICTURE";
    return value in notificationRouteByKind ? value as OrderKind : null;
};

export const useNotifications = () => {
    const appStore = useStore();
    const authStore = authService();
    const router = useRouter();

    const isNotificationsOpen = ref(false);
    const isNotificationsLoading = ref(false);
    const notificationsError = ref("");
    const isNotificationSoundEnabled = ref(notificationSoundService.isEnabled());
    const activeTab = ref<"UNREAD" | "ALL">("UNREAD");
    const notificationSearch = ref("");
    const notificationTypeFilter = ref<NotificationType | "">("");

    const notifications = computed(() => appStore.state.notifications);
    const notificationsPaging = computed(() => appStore.state.notificationsPaging);
    const unreadCount = computed(() => appStore.unreadNotificationsCount);

    const filteredNotifications = computed(() => {
        if (activeTab.value === "UNREAD") {
            return notifications.value.filter(notification => !notification.read);
        }

        return notifications.value;
    });

    const notificationFilters = computed(() => ({
        isRead: activeTab.value === "UNREAD" ? false : undefined,
        search: notificationSearch.value.trim() || undefined,
        type: notificationTypeFilter.value || undefined,
    }));

    const loadNotificationsPage = async (append: boolean) => {
        if (isNotificationsLoading.value) return;

        notificationsError.value = "";
        isNotificationsLoading.value = true;

        try {
            await appStore.loadNotifications({
                ...notificationFilters.value,
                page: append ? notificationsPaging.value.pageNumber + 1 : 0,
                size: notificationsPaging.value.pageSize || 10,
                sort: "createdAt,desc",
            }, append);
        } catch (error) {
            console.error("Notification load failed:", error);
            notificationsError.value = "Bildirishnomalarni yuklab bo'lmadi.";
        } finally {
            isNotificationsLoading.value = false;
        }
    };

    const toggleNotifications = () => {
        isNotificationsOpen.value = !isNotificationsOpen.value;

        if (isNotificationsOpen.value) {
            void loadNotificationsPage(false);
        }
    };

    const loadMoreNotifications = async () => {
        if (notificationsPaging.value.last) return;
        await loadNotificationsPage(true);
    };

    const retryNotifications = async () => {
        await loadNotificationsPage(false);
    };

    const selectNotificationTab = async (tab: "UNREAD" | "ALL") => {
        if (activeTab.value === tab) return;
        activeTab.value = tab;
        await loadNotificationsPage(false);
    };

    const markAllAsRead = async () => {
        if (!unreadCount.value) return;
        await appStore.markAllNotificationsRead();
    };

    const toggleNotificationSound = () => {
        isNotificationSoundEnabled.value = notificationSoundService.toggle();
    };

    const resolveNotificationRoute = (item: NotificationItem | any) => {
        if (authStore.state.roles.includes("ROLE_OPERATOR")) {
            return "/tasks";
        }

        if (item.route) {
            return item.route;
        }

        const kind = normalizeKind(
            item.targetKind || item.target_kind || item.kind || item.orderKind || item.order_kind
        );

        return kind ? notificationRouteByKind[kind] : "/tasks";
    };

    const handleNotificationClick = async (item: NotificationItem | any) => {
        if (!item.read) {
            if (String(item.id || "").startsWith("local:")) {
                appStore.markNotificationReadLocal(item.id);
            } else {
                try {
                    await appStore.markNotificationRead(item.id);
                } catch (error) {
                    console.error("Notification mark as read failed:", error);
                }
            }
        }

        isNotificationsOpen.value = false;
        await router.push(resolveNotificationRoute(item));
    };

    watch([notificationSearch, notificationTypeFilter], (_newValue, _oldValue, onCleanup) => {
        if (!isNotificationsOpen.value) return;

        const timer = window.setTimeout(() => {
            void loadNotificationsPage(false);
        }, 300);

        onCleanup(() => window.clearTimeout(timer));
    });

    watch(() => appStore.state.lastRealtimeNotification, (event) => {
        if (event?.key) {
            void notificationSoundService.playForNotification(event.item);
        }
    });

    onMounted(() => {
        notificationSoundService.init();
    });

    onBeforeUnmount(() => {
        notificationSoundService.destroy();
    });

    return {
        activeTab,
        filteredNotifications,
        handleNotificationClick,
        isNotificationSoundEnabled,
        isNotificationsLoading,
        isNotificationsOpen,
        loadMoreNotifications,
        markAllAsRead,
        notificationSearch,
        notificationTypeFilter,
        notificationTypeOptions,
        notificationsError,
        notificationsPaging,
        retryNotifications,
        selectNotificationTab,
        toggleNotificationSound,
        toggleNotifications,
        unreadCount,
    };
};
