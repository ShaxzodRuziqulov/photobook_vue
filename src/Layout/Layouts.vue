<template>
<div class="flex flex-col font-sans w-full overflow-hidden min-h-screen">
  <Header
      :routes="menuItems"
      :isMenuOpen="isMenuVisible"
      @toggleMenu="toggleMenu"
      class="fixed z-50"
  />
  <CButton
      id="scrollTop"
      :class="{'activeScroll': isOnActive}"
      :faClass="'fa-solid fa-arrow-up'"
      :is-has-fa-icon="true"
      :text="''"
      class="scrollBtn bg-red-800 hover:bg-red-700"
      @click="scrollToTop"
  />
  <div class="flex flex-col mt-20 w-full flex-1 relative bg-gray-50">
    <Sidebar
        :isMenuVisible="isMenuVisible"
        @toggleMenu="toggleMenu"
        :menuItems="menuItems"
    />
    <RouterView class="flex-1 overflow-y-auto"/>
  </div>
</div>
</template>


<script setup lang="ts">
import { useRouter } from "vue-router";
import Header from "@/components/Header.vue";
import Sidebar from "@/components/Sidebar.vue";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import CButton from "@/components/CButton.vue";
import { authService } from "@/service/authService";
import { useStore } from "@/stores/store";
import { socketService } from "@/service/socketService";

const router = useRouter();
const authStore = authService();
const dataStore = useStore();

const isMenuVisible = ref(false);
const isOnActive = ref(false);
let unsubscribeNotification: (() => void) | null = null;

const mainRoute = router.getRoutes().find(route => route.name === 'Main');

const menuItems = computed(() => {

  return mainRoute?.children.map(route => ({
    name: route.name as string,
    path: route.path,
    meta: route.meta,
  })) || [];
})

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value;
}

const handleScroll = () => {
  isOnActive.value = window.scrollY > 400
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}

onMounted(async () => {
  if (authStore.state.token && !authStore.state.user) {
    await authStore.getCurrentUser();
  }

  unsubscribeNotification = socketService.subscribe(async (notification) => {
    await dataStore.refreshFromNotification(notification);
  });

  window.addEventListener("scroll", handleScroll);
})
onBeforeUnmount(() => {
  unsubscribeNotification?.();
  window.removeEventListener("scroll", handleScroll);
})
</script>


<style scoped>

.scrollBtn {
  z-index: 999;
  position: fixed;
  color: white;
  width: 45px;
  height: 45px;
  right: 5px;
  bottom: 30px;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  line-height: 45px;
  border-radius: 3px;
  cursor: pointer;
  opacity: 0;
  transition: all .3s ease;
}
.scrollBtn.activeScroll {
  opacity: 1;
  right: 20px;
}
</style>
