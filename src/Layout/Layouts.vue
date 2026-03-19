<template>
<div class="flex flex-col font-sans w-full overflow-hidden min-h-screen">
  <Header
      :routes="menuItems"
      :isMenuOpen="isMenuVisible"
      @toggleMenu="toggleMenu"
      class="fixed z-50"
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
import {computed, ref} from "vue";

const router = useRouter();

const isMenuVisible = ref(false);

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


</script>


<style scoped>

</style>