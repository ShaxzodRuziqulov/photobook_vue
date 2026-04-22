<template>
<div class="flex h-full min-h-0 w-full flex-col overflow-hidden font-sans">
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
      class="scrollBtn bg-pb-accent hover:bg-pb-accent-hover shadow-lg shadow-pb-accent/25"
      @click="scrollToTop"
  />
  <div class="relative mt-16 flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-pb-app">
    <Sidebar
        :isMenuVisible="isMenuVisible"
        @toggleMenu="toggleMenu"
        :menuItems="menuItems"
    />
    <div
        ref="mainScrollEl"
        class="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-y-contain"
        @scroll="onMainScroll"
    >
      <RouterView class="min-w-0 w-full flex flex-col" />
    </div>
  </div>
</div>
</template>


<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import Header from "@/components/Header.vue";
import Sidebar from "@/components/Sidebar.vue";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import CButton from "@/components/CButton.vue";
import { authService } from "@/service/authService";
import { useStore } from "@/stores/store";
import { socketService } from "@/service/socketService";

const router = useRouter();
const route = useRoute();
const mainScrollEl = ref<HTMLElement | null>(null);
const authStore = authService();
const dataStore = useStore();

const isMenuVisible = ref(false);
const isOnActive = ref(false);
let unsubscribeNotification: (() => void) | null = null;

const mainRoute = router.getRoutes().find(route => route.name === 'Main');

const menuItems = computed(() => {
  return (
      mainRoute?.children.map((route) => ({
        name: route.name as string,
        path: route.path,
        meta: route.meta,
      })) || []
  );
});

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value;
}

const onMainScroll = () => {
  isOnActive.value = (mainScrollEl.value?.scrollTop ?? 0) > 400;
};

const scrollToTop = () => {
  mainScrollEl.value?.scrollTo({ top: 0, behavior: "smooth" });
};

watch(
    () => route.fullPath,
    () => {
      mainScrollEl.value?.scrollTo({ top: 0, behavior: "auto" });
    },
);

onMounted(async () => {
  if (authStore.state.token && !authStore.state.user) {
    await authStore.getCurrentUser();
  }

  unsubscribeNotification = socketService.subscribe(async (notification) => {
    await dataStore.refreshFromNotification(notification);
  });

})
onBeforeUnmount(() => {
  unsubscribeNotification?.();
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
