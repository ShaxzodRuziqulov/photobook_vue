<template>
  <div
      class="w-full invisible h-full mt-16 pt-40 min-h-screen bg-black/30 transition-all ease-in-out duration-300 fixed inset-0 z-999 left-0"
      @click="toggleMenu"
      :class="isMenuVisible ? 'visible' : 'invisible'"
  >
    <div
        @click.stop
        :class="isMenuVisible ? 'translate-x-0' : '-translate-x-full'"
        v-if="mainMenuItems.length"
        class="py-6 w-full md:w-3/4 sm:1/2 lg:w-1/4 gap-3 pl-4 pr-20 h-dvh flex flex-col md:pt-16 bg-pb-sidebar absolute top-0 left-0 text-white z-20 transition-all ease-in-out duration-300 overflow-hidden border-r border-white/5 shadow-xl"

    >
      <router-link
          v-for="(item, index) in mainMenuItems"
          :key="index"
          :to="item.path"
          @click="toggleMenu"
          active-class="bg-pb-sidebar-active text-white font-semibold"
          class="rounded-md p-2 cursor-pointer hover:bg-pb-sidebar-hover transition-colors duration-300 flex items-center gap-1 text-white/90"
          :class="!isDesktop && index === mainMenuItems.length -1 ? 'hidden' : 'of-hidden'"
      >
        <i v-if="item.meta?.icon" :class="item.meta.icon"></i>
        {{ item.name }}
      </router-link>
      <div class="gap-2">
        <button
            v-if="!isDesktop"
            type="button"
            class="mobile-user-chip cursor-pointer"
            @click="openToProfile"
        >
          <div class="flex gap-2">
            <div class="mobile-user-avatar">
              <img
                  v-if="userAvatar"
                  :src="userAvatar"
                  alt="Profil rasmi"
                  loading="lazy"
                  class="w-full h-full object-cover"
              >
              <i v-else class="fa-solid fa-user"></i>
            </div>
            <div class="mobile-user-copy">
              <span class="mobile-user-name">{{ userName }}</span>
              <span class="mobile-user-role">{{ currentRole }}</span>
            </div>
          </div>
          <i class="fa-solid fa-arrow-right-to-bracket pr-4"></i>
        </button>
        <div
            v-if="!isDesktop"
            @click="backToLogin"
            class="flex my-2 items-center w-full rounded-md hover:bg-pb-sidebar-hover cursor-pointer p-2 gap-2"
        >
          <i class="fa-solid fa-arrow-right-from-bracket"/>
          <span class="flex items-start">Chiqish</span>
        </div>
        <CButton
            v-if="false"
            type="button"
            :text="userName"
            is-has-fa-icon
            faClass="fa-solid fa-user"
            variant="ghost-accent"
            @click="openToProfile"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, ref, watch } from "vue";
import { authService } from "@/service/authService";
import { useRouter } from "vue-router";
import CButton from "@/components/CButton.vue";
import CDialog from "@/components/CDialog.vue";
import { useIsDesktop } from "@/composables/useBreakpoint";

const router = useRouter();
const authStore = authService();

const isExit = ref(false);

const emits = defineEmits(['toggleMenu']);

interface IProps {
  menuItems: Array<{
    name: string;
    path: string;
  }>;
  isMenuVisible: boolean;
}

const props = defineProps<IProps>()

const toggleMenu = () => {
  emits("toggleMenu" );
}

const isAdmin: ComputedRef = computed(() => {
  return authStore.state.roles.includes("ROLE_ADMIN");
})

const isOperator: ComputedRef = computed(() => {
  return authStore.state.roles.includes("ROLE_OPERATOR");
})

const isManager: ComputedRef = computed(() => {
  return authStore.state.roles.includes("ROLE_MANAGER");
})

const mainMenuItems: ComputedRef = computed(() => {

  const routes = props.menuItems

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
})

const isDesktop = useIsDesktop();

const backToLogin = () => {
  isExit.value = true;
  emits("toggleMenu");
}

const confirmBack = () => {
  authStore.logout();
  isExit.value = false;
}

const openToProfile = () => {
  router.push("/profile");
  emits("toggleMenu");
}

const userName = computed(() => {
  const user = authStore.state.user;
  if (!user) return "Foydalanuvchi";
  const full = `${user.lastName} ${user.firstName}`.trim();
  return full || user.username || "Foydalanuvchi";
});

const currentRole = computed(() => {
  const roles = authStore.state.roles || [];

  if (roles.includes("ROLE_ADMIN")) return "Administrator";
  if (roles.includes("ROLE_MANAGER")) return "Menejer";
  if (roles.includes("ROLE_OPERATOR")) return "Operator";

  return "Foydalanuvchi";
});

const userAvatar = computed(() => {
  const avatarUrl = authStore.state.user?.avatarUrl;

  if (!avatarUrl) return "";
  if (avatarUrl.startsWith("http")) return avatarUrl;

  return `${import.meta.env.VITE_BASE_API}${avatarUrl}`;
});

watch(
    () => props.isMenuVisible,
    (val) => {
      if (val) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
);
</script>

<style scoped>
.mobile-user-chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding: 6px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
}

.mobile-user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  flex-shrink: 0;
}

.mobile-user-copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
  text-align: left;
}

.mobile-user-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

.mobile-user-role {
  font-size: 11px;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.7);
}
</style>
