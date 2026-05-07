<template>
  <div class="flex flex-col overflow-visible bg-pb-header w-full border-b border-pb-header-border">
    <div class="w-full h-16 px-2 2xl:px-4 grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto] items-center gap-2 text-white shadow-sm transition-all">
      <div class="flex items-center h-full">
        <div class="flex items-center">
          <img class="w-16" src="../assets/logo.png" alt="Logo">
          <div class="flex flex-col items-center gap-1">
            <h2 class="m-0 text-xs font-semibold">PHOTOBOOK</h2>
            <span
                v-if="searchName"
                class="text-[10px] bg-pb-role text-pb-role-text font-semibold rounded-lg py-0.5 px-2 uppercase tracking-wide"
            >
              {{ searchName }}
            </span>
          </div>
        </div>
      </div>
      <nav v-if="isDesktop" class="flex items-center justify-center w-full gap-1">
        <router-link
            v-for="(route, index) in mainRoutes"
            :key="index"
            :to="route?.path"
            active-class="bg-white/15 text-white font-medium"
            class="px-2 py-2 gap-1 text-[15px] flex items-center text-center rounded-md text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200 no-underline max-lg:px-1"
            :class="index === mainRoutes.length - 1 ? 'hidden' : ''"
        >
          <i v-if="route.meta?.icon" class="w-4 h-3 flex text-sm" :class="route.meta?.icon"></i>
          <span>{{ route.name }}</span>
        </router-link>
      </nav>
      <div class="flex items-center justify-end gap-2">
        <div class="relative">
          <button
              type="button"
              class="relative inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white/8 text-white text-lg border-0 cursor-pointer transition-colors duration-200 overflow-visible hover:bg-white/14"
              @click="toggleNotifications"
          >
            <i class="fa-regular fa-bell"></i>
            <span
                v-if="unreadCount > 0"
                class="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-pb-danger border-2 border-pb-header text-white text-[11px] font-bold inline-flex items-center justify-center z-[3] shadow-[0_8px_20px_color-mix(in_srgb,var(--color-pb-danger)_35%,transparent)]"
            >
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </button>
          <div
              v-if="isNotificationsOpen"
              class="fixed inset-0 bg-black/40 z-[15]"
              @click="isNotificationsOpen = false"
          ></div>
          <NotificationPanel
              v-if="isNotificationsOpen"
              @close="closeNotifications"
              :notifications="notifications"
              :paging="notificationsPaging"
              :unread-count="unreadCount"
              :error="notificationsError"
              :loading="isNotificationsLoading"
              :sound-enabled="isNotificationSoundEnabled"
              :is-desktop="isDesktop"
              :active-tab="activeTab"
              :search="notificationSearch"
              :type="notificationTypeFilter"
              :type-options="notificationTypeOptions"
              :selected-notification-id="selectedNotificationId"
              @update:active-tab="selectNotificationTab"
              @update:search="notificationSearch = $event"
              @update:type="notificationTypeFilter = $event"
              @mark-all-read="markAllAsRead"
              @retry="retryNotifications"
              @toggle-sound="toggleNotificationSound"
              @notification-click="handleNotificationClick"
              @load-more="loadMoreNotifications"
          />
        </div>
        <template v-if="isDesktop">
          <button
              type="button"
              class="flex items-center gap-2.5 min-w-0 px-3 py-2 rounded-[10px] bg-white/8 border-0 cursor-pointer transition-colors duration-200 hover:bg-white/14"
              @click="openToProfile"
          >
            <div class="w-[38px] h-[38px] rounded-full overflow-hidden flex items-center justify-center bg-white/14 text-white flex-shrink-0">
              <img
                  v-if="userAvatar"
                  :src="userAvatar"
                  alt="Profil rasmi"
                  class="w-full h-full object-cover"
              >
              <i v-else class="fa-solid fa-user"></i>
            </div>
            <div class="flex flex-col min-w-0 text-left">
              <span class="max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold text-white">
                {{ userName }}
              </span>
              <span class="text-xs tracking-wider text-white/72">
                {{ searchName || "Foydalanuvchi" }}
              </span>
            </div>
          </button>
          <CButton
              v-if="isDesktop"
              type="button"
              text="Chiqish"
              variant="danger"
              is-has-fa-icon
              faClass="fa-solid fa-arrow-right-from-bracket"
              @click="backToLogin"
          />
        </template>
        <div
            v-if="!isDesktop"
            class="burger-menu"
            @click="toggleBurgerMenu"
            :class="{ active: isMenuOpen }"
        >
          <span></span>
        </div>
      </div>
      <CDialog
          :show="isExit"
          custom-class="w-full max-w-sm"
          @close="isExit = false"
          body-class="!bg-pb-surface rounded-xl p-4 text-center shadow-lg"
      >
        <div class="flex flex-col gap-3 mb-4">
          <h2 class="text-base font-semibold text-pb-text">Chiqishni tasdiqlaysizmi?</h2>
          <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
            <CButton
                type="button"
                text="Bekor qilish"
                variant="ghost-accent"
                size="sm"
                @click="isExit = false"
            />
            <CButton
                type="button"
                text="Ha, chiqish"
                variant="danger"
                size="sm"
                @click="confirmBack"
            />
          </div>
        </div>
      </CDialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import type { RouteMeta } from "vue-router";
import CButton from "@/components/CButton.vue";
import { computed, ref } from "vue";
import CDialog from "@/components/CDialog.vue";
import { authService } from "@/service/authService";
import NotificationPanel from "@/components/notifications/NotificationPanel.vue";
import { useNotifications } from "@/composables/useNotifications";
import { useIsDesktop } from "@/composables/useBreakpoint";

type HeaderMenuRoute = {
  path: string;
  name?: string | symbol | null;
  meta?: RouteMeta;
};

const authStore = authService();
const router = useRouter();

const emits = defineEmits(["toggleMenu"]);
const props = withDefaults(
  defineProps<{
    routes: HeaderMenuRoute[];
    isMenuOpen?: boolean;
  }>(),
  {
    isMenuOpen: false,
  },
);

const closeNotifications = () => {
  isNotificationsOpen.value = false;
}

const isExit = ref(false);

const isAdmin = computed(() => {
  return authStore.state.roles.includes("ROLE_ADMIN");
});

const isOperator = computed(() => {
  return authStore.state.roles.includes("ROLE_OPERATOR");
})

const isManager = computed(() => {
  return authStore.state.roles.includes("ROLE_MANAGER");
})

const searchName = computed(() => {
  const roles = authStore.state.roles || [];
  if (roles.includes("ROLE_ADMIN")) {
    return "Administrator";
  }
  if (roles.includes("ROLE_OPERATOR")) {
    return "Operator";
  }
  if (roles.includes("ROLE_MANAGER")) {
    return "Menejer";
  }
  return "";
})

const mainRoutes = computed((): HeaderMenuRoute[] => {
  const routes = props.routes;

  if (isAdmin.value) {
    return routes;
  }

  const HIDDEN_FOR_MANAGER = ["/users"];

  if (isManager.value) {
    return routes.filter(r => !HIDDEN_FOR_MANAGER.includes(r.path));
  }

  if (isOperator.value) {
    return routes.filter((r) => ["/tasks", "/profile"].includes(r.path));
  }

  return routes;
});

const toggleBurgerMenu = () => {
  emits("toggleMenu");
}
const backToLogin = () => {
  isExit.value = true;
}

const confirmBack = () => {
  authStore.logout();
  isExit.value = false;
}

const userName = computed(() => {
  const user = authStore.state.user;

  if (!user) return "Foydalanuvchi";

  const full = `${user.lastName} ${user.firstName}`.trim();
  return full || user.username || "Foydalanuvchi";
});

const userAvatar = computed(() => {
  const avatarUrl = authStore.state.user?.avatarUrl;

  if (!avatarUrl) return "";
  if (avatarUrl.startsWith("http")) return avatarUrl;

  return `${import.meta.env.VITE_BASE_API}${avatarUrl}`;
});

const openToProfile = () => {
  router.push("/profile");
}
const isDesktop = useIsDesktop();
const {
  activeTab,
  notifications,
  handleNotificationClick,
  isNotificationSoundEnabled,
  isNotificationsLoading,
  isNotificationsOpen,
  loadMoreNotifications,
  markAllAsRead,
  notificationSearch,
  notificationTypeFilter,
  notificationTypeOptions,
  selectedNotificationId,
  notificationsError,
  notificationsPaging,
  retryNotifications,
  selectNotificationTab,
  toggleNotificationSound,
  toggleNotifications,
  unreadCount,
} = useNotifications();

</script>

<style scoped>
.burger-menu {
  position: relative;
  width: 44px;
  height: 44px;
  cursor: pointer;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.burger-menu:active {
  background-color: rgba(255, 255, 255, 0.1);
}

.burger-menu span {
  position: relative;
  display: block;
  width: 26px;
  height: 3px;
  background-color: #ffffff;
  transition: background-color 0.3s ease-in-out;
}

.burger-menu span::before,
.burger-menu span::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 3px;
  background-color: #ffffff;
  transition: transform 0.3s ease-in-out;
  left: 0;
}

.burger-menu span::before {
  top: -9px;
}

.burger-menu span::after {
  top: 9px;
}

.burger-menu.active span {
  background-color: transparent;
}

.burger-menu.active span::before {
  transform: translateY(9px) rotate(45deg);
}

.burger-menu.active span::after {
  transform: translateY(-9px) rotate(-45deg);
}
</style>
