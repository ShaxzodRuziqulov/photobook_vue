<template>
  <div
      class="flex flex-col overflow-visible bg-pb-header w-full border-b border-pb-header-border"
  >
    <div
        class="w-full h-16 px-2 2xl:px-4 gap-2 text-white grid grid-cols-[1fr_auto_1fr] grid-flow-col-dense items-center shadow-sm transition-colors"
    >
      <div class="flex items-center h-full">
        <div class="flex text-md items-center">
          <img class="w-16" src="../assets/logo.png" alt="">
          <div class="flex gap-1 flex-col items-center">
            <h2>PHOTOBOOK</h2>
            <span
                v-if="searchName"
                class="text-xs bg-pb-role text-pb-role-text font-semibold rounded-lg py-0.5 px-2 uppercase tracking-wide"
            >{{ searchName }}</span>
          </div>
        </div>
      </div>

      <div
          v-if="isDesktop"
          class="flex items-center w-full gap-1 flex-row">
        <router-link
            v-for="(route, index) in mainRoutes"
            :key="index"
            :to="route?.path"
          active-class="bg-white/15 text-white font-medium"
          class="p-2 gap-1 text-md flex max-lg:p-1 items-center text-center rounded-md text-white/90 hover:bg-white/10 hover:text-white transition duration-200"
            :class="index === mainRoutes.length - 1 ? 'hidden' : 'of-hidden'"
        >
          <i class="w-4 text-sm h-3 flex" v-if="route.meta?.icon" :class="route.meta?.icon"></i>
          <span class="">{{ route.name }}</span>
        </router-link>

      </div>
      <div
          class="flex gap-2 items-center justify-end"
      >
        <div class="relative">
          <button
              type="button"
              class="notify-button"
              @click="toggleNotifications"
          >
            <i class="fa-regular fa-bell"></i>
            <span v-if="unreadCount > 0" class="notify-badge">
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </button>
          <div
              v-if="isNotificationsOpen"
              class="notify-overlay"
              @click="isNotificationsOpen = false"
          ></div>
          <NotificationPanel
              v-if="isNotificationsOpen"
              :notifications="filteredNotifications"
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
        <button
            v-if="isDesktop"
            type="button"
            class="user-chip"
            @click="openToProfile"
        >
          <div class="user-avatar">
            <img
                v-if="userAvatar"
                :src="userAvatar"
                alt="Profil rasmi"
                class="w-full h-full object-cover"
            >
            <i v-else class="fa-solid fa-user"></i>
          </div>
          <div class="user-copy">
            <span class="user-name">{{ userName }}</span>
            <span class="user-role">{{ searchName || "Foydalanuvchi" }}</span>
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
        <CDialog
            :show="isExit"
            custom-class="w-full max-w-sm"
            @close="isExit = false"
            body-class="!bg-pb-surface rounded-xl border border-pb-border p-4 text-center shadow-lg"
        >
          <div class="flex flex-col gap-3">
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
      <div class="flex justify-end">
        <div
            class="burger-menu"
            v-if="!isDesktop"
            @click="toggleBurgerMenu"
            :class="{ active: isMenuOpen }"
        >
          <span></span>
        </div>
      </div>
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

  if (isAdmin.value || isManager.value) {
    return routes;
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
const isDesktop = computed(() => window.innerWidth > 768);
const {
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
} = useNotifications();

</script>

<style scoped>
.notify-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 18px;
  transition: background-color 0.2s ease;
  overflow: visible;
}

.notify-button:hover {
  background: rgba(255, 255, 255, 0.14);
}

.notify-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--color-pb-danger);
  border: 2px solid var(--color-pb-header);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--color-pb-danger) 35%, transparent);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.notify-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 15;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  transition: background-color 0.2s ease;
}

.user-chip:hover {
  background: rgba(255, 255, 255, 0.14);
}

.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  flex-shrink: 0;
}

.user-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
  text-align: left;
}

.user-name {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

.user-role {
  font-size: 11px;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.72);
}

.burger-menu {
  position: relative;
  width: 30px;
  height: 30px;
  cursor: pointer;
  z-index: 100;

  span {
    position: relative;
    display: block;
    width: 100%;
    height: 3px;
    background-color: #ffffff;
    transition: background-color 0.3s ease-in-out;
    top: 15px;

    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 3px;
      background-color: #ffffff;
      transition: transform 0.3s ease-in-out;
      left: 0;
    }

    &::before {
      top: -10px;
    }

    &::after {
      top: 10px;
    }
  }

  &.active {
    span {
      background-color: transparent;

      &::before {
        transform: translateY(10px) rotate(45deg);
      }

      &::after {
        transform: translateY(-10px) rotate(-45deg);
      }
    }
  }
}
</style>
