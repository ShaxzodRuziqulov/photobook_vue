<template>
  <div class="app-page flex w-full min-w-0 flex-col gap-5 px-4 py-6 text-pb-text sm:px-6 lg:mx-auto lg:max-w-7xl">
    <div
        class="flex w-full flex-col gap-3 rounded-xl border border-pb-border bg-pb-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex flex-wrap items-center gap-3 sm:gap-5">
        <CButton
            type="button"
            text="Orqaga"
            is-has-fa-icon
            variant="ghost-accent"
            fa-class="fa-solid fa-arrow-left"
            @click="router.back()"
        />
        <div>
          <p class="text-xs font-bold uppercase tracking-wide text-pb-accent">Ma'lumotlar</p>
          <h1 class="text-xl font-bold text-pb-text">Kategoriyalar</h1>
        </div>
      </div>
    </div>

    <nav
        aria-label="Kategoriya turlari"
        class="flex w-full flex-wrap items-stretch gap-1 overflow-x-auto rounded-xl border border-pb-border bg-pb-surface p-2 shadow-sm sm:flex-nowrap"
    >
      <button
          v-for="(tab, index) in tabs"
          :key="index"
          type="button"
          class="flex min-w-0 shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors active:scale-95 active:opacity-80"
          :class="
            activeTabs === tab.id
              ? 'bg-pb-accent/10 text-pb-accent ring-1 ring-pb-accent/25'
              : 'text-pb-muted hover:bg-pb-app hover:text-pb-text active:bg-pb-app'
          "
          @click="changeCard(tab.id)"
      >
        <i class="shrink-0 text-base" :class="tab.icon" aria-hidden="true" />
        <span>{{ tab.label }}</span>
      </button>
    </nav>

    <div class="animate-fade-in min-h-0 min-w-0 flex-1" :key="activeTabs">
      <Albums v-if="activeTabs === 1" />
      <Vignette v-else-if="activeTabs === 2" />
      <PhotoAlbums v-else-if="activeTabs === 3" />
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

const TAB_IDS = [1, 2, 3] as const;

function queryScalar(val: unknown): string {
  if (Array.isArray(val)) return val[0] != null ? String(val[0]) : "";
  if (val === undefined || val === null) return "";
  return String(val);
}

function normalizeTabGroup(val: unknown): number {
  const s = queryScalar(val);
  if (!s) return 1;
  const n = Number(s);
  if (!Number.isFinite(n) || !TAB_IDS.includes(n as (typeof TAB_IDS)[number])) {
    return 1;
  }
  return n;
}

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
    label: 'Rasmli albom',
    icon: 'fa-solid fa-images',
  }
]);

const changeCard = (id: number) => {
  activeTabs.value = id;
  router.push({
    path: "/category",
    query: { ...route.query, group: String(id) },
  });
};

watch(
    () => route.query.group,
    (val) => {
      const next = normalizeTabGroup(val);
      activeTabs.value = next;
      const rawStr = queryScalar(route.query.group);
      if (rawStr !== String(next)) {
        router.replace({
          path: "/category",
          query: {
            ...route.query,
            group: String(next),
          },
        });
      }
    },
    { immediate: true },
);
</script>

<style scoped>
.app-page {
  background:
      linear-gradient(180deg, rgb(248 250 252 / 0.9) 0%, var(--color-pb-app) 36%, var(--color-pb-app) 100%),
      radial-gradient(ellipse 65% 40% at 50% -8%, rgb(37 99 235 / 0.07), transparent 52%);
}

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