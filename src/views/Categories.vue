<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-8">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-2xl shadow-lg p-2">
        <div class="flex gap-2 p-2 w-full items-center flex-col sm:flex-col md:flex-row lg:flex-row">
          <CButton
              type="button"
              text="Ortga"
              is-has-fa-icon
              variant="ghost-accent"
              faClass="fa-solid fa-arrow-left"
              class="absolute right-0"
              @click="router.back()"
          />
          <div
              v-for="(tab, index) in tabs"
              :key="index"
              @click="changeCard(tab.id)"
              :class="[
              'flex cursor-pointer',
              ]"
          >
            <div
                class="flex items-center gap-2 py-1 px-4 transition-all border-b-2"
                :class="activeTabs === tab.id
                ? 'text-blue-600 border-blue-500'
                : 'text-gray-600 border-transparent hover:bg-gray-100'"
            >
              <i class="text-md" :class="tab.icon"></i>
              <div class="font-bold text-md text-left">
                {{ tab.label }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="animate-fade-in mt-4" :key="activeTabs">
        <Albums v-if="activeTabs === 1 " />

        <Vignette v-else-if="activeTabs === 2 " />

        <PhotoAlbums v-else-if="activeTabs === 3 " />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import Albums from '../components/AlbumCategory.vue';
import Vignette from '../components/VinCategory.vue';
import PhotoAlbums from '../components/PhotoCategory.vue';
import { useRouter, useRoute } from 'vue-router';
import CButton from "@/components/CButton.vue";

const router = useRouter();
const route = useRoute();

const activeTabs = ref<number>(1);

const tabs = computed(() => [
  {
    id: 1,
    label: 'Albomlar',
    icon: 'fa-solid fa-book',
  },
  {
    id: 2,
    label: 'Vinetkalar',
    icon: 'fa-solid fa-book-open',
  },
  {
    id: 3,
    label: 'Rasmli Albom',
    icon: 'fa-solid fa-images',
  }
]);

const changeCard = (id: number) => {
  activeTabs.value = id;

  const queryGroup = { group: id};

  router.push({ query: queryGroup });
}

watch( () =>
    route.query.group,
    (val) => {
  activeTabs.value = val ? Number(val) : 1;
  if (!val) {
    router.replace({
      query: {
        ...route.query,
        group: 1
      }
    });
  }
}, {immediate: true})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>