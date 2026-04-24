import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { notificationTypeOptions } from "@/constants/notificationTypes";
import { notificationSoundService } from "@/service/notificationSoundService";
import { useStore } from "@/stores/store";
import type { NotificationItem, NotificationType } from "@/typeModules/useModules";

export const useNotifications = () => {
    const appStore = useStore();

    const isNotificationsOpen = ref(false);
    const isNotificationsLoading = ref(false);
    const notificationsError = ref("");
    const isNotificationSoundEnabled = ref(notificationSoundService.isEnabled());
    const activeTab = ref<"UNREAD" | "ALL">("UNREAD");
    const notificationSearch = ref("");
    const notificationTypeFilter = ref<NotificationType | "">("");
    const selectedNotificationId = ref<string | null>(null);

    const notifications = computed(() => appStore.state.notifications);
    const notificationsPaging = computed(() => appStore.state.notificationsPaging);
    const unreadCount = computed(() => appStore.unreadNotificationsCount);

    const notificationFilters = computed(() => ({
        isRead: activeTab.value === "UNREAD" ? false : undefined,
        search: notificationSearch.value.trim() || undefined,
        type: notificationTypeFilter.value || undefined,
    }));

    const loadNotificationsPage = async (append: boolean) => {
        if (isNotificationsLoading.value) return;

        if (!append) {
            selectedNotificationId.value = null;
        }

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
        } else {
            selectedNotificationId.value = null;
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
        selectedNotificationId.value = null;
    };

    const toggleNotificationSound = () => {
        isNotificationSoundEnabled.value = notificationSoundService.toggle();
    };

    const handleNotificationClick = (item: NotificationItem | any) => {
        const id = String(item.id ?? "");
        selectedNotificationId.value = id;

        if (item.read) return;
        if (id.startsWith("local:")) {
            appStore.markNotificationReadLocal(item.id);
            return;
        }
        void appStore.markNotificationRead(item.id).catch((error) => {
            console.error("Notification mark as read failed:", error);
        });
    };

    watch(notificationTypeFilter, () => {
        if (!isNotificationsOpen.value) return;
        void loadNotificationsPage(false);
    });

    watch(notificationSearch, (_newValue, _oldValue, onCleanup) => {
        if (!isNotificationsOpen.value) return;

        const timer = window.setTimeout(() => {
            void loadNotificationsPage(false);
        }, 200);

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
        notifications,
        handleNotificationClick,
        isNotificationSoundEnabled,
        selectedNotificationId,
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
