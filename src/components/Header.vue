<template>
  <div
      class="flex flex-col overflow-x-auto bg-gray-800 w-full"
  >
    <div
        class="w-full h-20 py-2.5 px-2 2xl:px-4  text-white grid grid-cols-[1fr_auto_1fr] grid-flow-col-dense items-center shadow-md transition-colors"
    >
      <div class="flex items-center h-full">
        <div class="flex text-sm items-center">
          <img class="w-17" src="../assets/logo.png" alt="">
          <div class="flex flex-col items-center">
            <h2>PHOTOBOOK</h2>
            <span class="text-xs bg-yellow-600 font-semibold rounded-xl px-2">{{searchName}}</span>
          </div>
        </div>
      </div>

      <div
          v-if="isDesktop"
          class="flex items-center w-full gap-2 flex-row">
        <router-link
            v-for="(route, index) in mainRoutes"
            :key="index"
            :to="route?.path"
            active-class="bg-gray-600"
            class="py-2 px-3 gap-2 text-sm flex items-center max-lg:p-1 text-center rounded-sm hover:bg-gray-700 transition duration-200"
            :class="index === mainRoutes.length - 1 ? 'hidden' : 'of-hidden'"
        >
          <i class="w-4 h-4" v-if="route.meta.icon" :class="route.meta.icon"></i>
          {{ route.name }}
        </router-link>

      </div>
      <div
          class="flex gap-2 items-center justify-end"
      >
        <CButton
            v-if="isDesktop && userName"
            type="button"
            :text="userName"
            is-has-fa-icon
            faClass="fa-solid fa-arrow-right"
            variant="ghost-accent"
            @click="openToProfile"
        />
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
            @close="isExit = false"
            body-class="justify-center bg-blue-800 text-center px-4 pb-8"
        >
          <div
              class="flex flex-col gap-4 w-full items-center justify-center bg-white rounded-2xl"
          >
            <h2 class="text-lg font-semibold">Rostdan ham chiqmoqchimisiz ?</h2>
            <div class="flex items-center justify-center gap-2 w-full">
              <CButton
                  type="button"
                  text="Ha, Chiqish"
                  class="px-6 py-5"
                  variant="danger"
                  @click="confirmBack"
              />
              <CButton
                  type="button"
                  text="Bekor qilish"
                  class="px-6 py-5"
                  variant="ghost-accent"
                  @click="isExit = false"
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
import CButton from "@/components/CButton.vue";
import {computed, ComputedRef, ref} from "vue";
import CDialog from "@/components/CDialog.vue";
import { authService } from "@/service/authService";
import { useStore } from "@/stores/store";

const authStore = authService();
const router = useRouter();
const dataStore = useStore();

const profileName = ref<string>('')

const emits = defineEmits(["toggleMenu"]);
const props = defineProps({
  routes: {
    type: Array,
    required: true,
  },
  isMenuOpen: {
    type: Boolean,
    default: false,
  }
})

const isExit = ref(false);

const isAdmin: ComputedRef = computed(() => {
  return authStore.state.roles.includes("ROLE_ADMIN");
})

const isUser = computed(() => {
  return authStore.state.roles.includes("ROLE_OPERATOR");
})

const isManager = computed(() => {
  return authStore.state.roles.includes("ROLE_MANAGER");
})

const searchName = computed(() => {
  const roles = authStore.state.roles || [];
  if (roles.includes("ROLE_ADMIN")) {
    profileName.value = "ADMIN";
  } else if (roles.includes("ROLE_OPERATOR")) {
    profileName.value = "USER";
  } else if (roles.includes("ROLE_MANAGER")) {
    profileName.value = "MENEGER";
  }
  return profileName.value;
})

const mainRoutes: ComputedRef = computed(() => {

  const routes = props.routes

  if (isAdmin.value) {
    return routes?.filter((r: any) =>
    ["/home"].includes(r.path) || []
    )
  }

  if (isManager.value) {
    return routes
  }
  if (isUser.value) {
    return routes?.filter( (r: any) =>
    ["/tasks", "/profile"].includes(r.path)
    )
  }

  return routes;
})

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
  try {
    const users = dataStore.state.user.items;
    const user = users.find(u => (u.lastName && u.firstName))
    return user ? `${user.lastName} ${user.firstName}` : 'Foydalanuvchi';
  }
  catch (error) {
    console.log(error);
  }
})

const openToProfile = () => {
  router.push("/profile");
}
const isDesktop = computed(() => window.innerWidth > 768);

</script>

<style scoped>

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