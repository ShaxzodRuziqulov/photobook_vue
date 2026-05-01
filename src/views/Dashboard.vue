<template>
  <div class="dashboard-page flex min-h-[vh] w-full flex-col">
    <div
        class="dashboard-content animate-fade-in mx-auto w-full max-w-7xl flex-1 space-y-10 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
    >
      <header class="flex flex-col gap-1 border-b border-pb-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-wide text-pb-accent">Boshqaruv paneli</p>
          <h1 class="mt-1 text-2xl font-bold text-pb-text sm:text-3xl">Umumiy ko‘rinish</h1>
          <p class="mt-1 max-w-2xl text-sm text-pb-muted">
            Buyurtmalar, jarayonlar va kategoriyalar bo‘yicha tezkor statistika.
          </p>
        </div>
      </header>

      <section aria-label="Asosiy ko‘rsatkichlar">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div
              v-for="(item, index) in getAlbums"
              :key="item.id"
              role="button"
              tabindex="0"
              class=" flex min-h-[7.5rem] cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-pb-border p-5 shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:border-pb-accent/25 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-pb-accent"
              :class="[
                'border-l-3',
                borderColors[index % borderColors.length].base,
                borderColors[index % borderColors.length].full,
              ]"
              @click="item.onclick"
              @keydown.enter.prevent="item.onclick"
              @keydown.space.prevent="item.onclick"
          >
            <div
                class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                aria-hidden="true"
            >
              <div
                  class="absolute inset-0 bg-gradient-to-br from-pb-accent/[0.06] via-transparent to-violet-500/[0.05]"
              />
            </div>
            <div class="relative z-[1] flex items-start justify-between gap-3">
              <div
                  :class="[
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg text-white shadow-sm',
                    index % 8 === 0
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-600'
                      : index % 8 === 1
                        ? 'bg-gradient-to-br from-emerald-600 to-teal-600'
                        : index % 8 === 2
                          ? 'bg-gradient-to-br from-violet-500 to-fuchsia-600'
                          : index % 8 === 3
                            ? 'bg-gradient-to-br from-cyan-500 to-cyan-600'
                            : index % 8 === 4
                              ? 'bg-gradient-to-br from-blue-700 to-fuchsia-700'
                              : index % 8 === 5
                                ? 'bg-gradient-to-br from-indigo-500 to-blue-600'
                                : index % 8 === 6
                                  ? 'bg-gradient-to-br from-teal-500 to-cyan-600'
                                  : 'bg-gradient-to-br from-green-500 to-emerald-600',
                  ]"
              >
                <i :class="item.icon" aria-hidden="true"></i>
              </div>
              <span
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pb-elevated text-pb-muted transition group-hover:bg-pb-accent/10 group-hover:text-pb-accent"
              >
                <i
                    class="fa-solid fa-arrow-right text-sm transition group-hover:translate-x-0.5"
                    aria-hidden="true"
                ></i>
              </span>
            </div>
            <div class="relative z-[1] mt-4 flex items-end justify-between gap-3 border-t border-pb-border pt-4">
              <span class="text-sm font-semibold leading-snug text-pb-text">{{ item.name }}</span>
              <span class="text-2xl font-bold tabular-nums text-pb-text">{{ item.itemCount }}</span>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Buyurtma holati">
        <h2 class="mb-4 text-sm font-bold text-pb-text">Buyurtmalar holati</h2>
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <article
              v-for="(item, index) in allStatuses"
              :key="item.id"
              class="flex flex-col overflow-hidden rounded-xl border border-pb-border bg-pb-surface shadow-sm"
          >
            <div
                :class="[
                  'relative px-5 pb-5 pt-5 text-white',
                  index % 3 === 0
                    ? 'bg-gradient-to-br from-cyan-600 via-cyan-600 to-cyan-700'
                    : index % 3 === 1
                      ? 'bg-gradient-to-br from-teal-600 to-cyan-700'
                      : 'bg-gradient-to-br from-cyan-600 to-cyan-800',
                ]"
            >
              <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,rgba(255,255,255,0.12),transparent)]" />
              <div class="relative flex flex-wrap items-center justify-between gap-2 text-base font-semibold">
                <div class="flex items-center gap-2">
                  <i :class="item.icon" aria-hidden="true"></i>
                  {{ item.label }}
                </div>
                <span class="rounded-md bg-white/15 px-2.5 py-1 text-sm font-medium backdrop-blur-sm">
                  Jami: {{ item.total }}
                </span>
              </div>
              <div class="relative my-5 border-t border-white/20" />
              <div class="relative grid grid-cols-2 gap-3">
                <button
                    type="button"
                    class="rounded-xl cursor-pointer border border-white/25 bg-white/10 p-3 text-left backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    @click="item.onClick('IN_PROGRESS')"
                >
                  <div class="flex items-center justify-between text-white/90">
                    <span class="text-xs font-medium">Jarayonda</span>
                    <i class="fa-regular fa-clock text-sm opacity-90" aria-hidden="true"></i>
                  </div>
                  <div class="mt-2 flex items-center justify-between">
                    <span class="text-2xl font-bold tabular-nums">{{ item.pending }}</span>
                    <i class="fa-solid fa-arrow-right text-sm opacity-80" aria-hidden="true"></i>
                  </div>
                </button>
                <button
                    type="button"
                    class="rounded-xl cursor-pointer border border-white/25 bg-white/10 p-3 text-left backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    @click="item.onClick('COMPLETED')"
                >
                  <div class="flex items-center justify-between text-white/90">
                    <span class="text-xs font-medium">Bajarilgan</span>
                    <i class="fa-regular fa-circle-check text-sm opacity-90" aria-hidden="true"></i>
                  </div>
                  <div class="mt-2 flex items-center justify-between">
                    <span class="text-2xl font-bold tabular-nums">{{ item.completed }}</span>
                    <i class="fa-solid fa-arrow-right text-sm opacity-80" aria-hidden="true"></i>
                  </div>
                </button>
              </div>
            </div>

            <div class="border-t border-pb-border px-5 py-4">
              <div class="mb-2 flex items-center justify-between text-sm">
                <span class="font-semibold text-pb-text">Bajarilish foizi</span>
                <span class="flex items-center gap-1 font-bold text-pb-accent">
                  <i class="fa-solid fa-arrow-trend-up text-xs" aria-hidden="true"></i>
                  {{ getPercent(item.completed, item.total) }}%
                </span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-pb-border">
                <div
                    class="h-full rounded-full bg-gradient-to-r from-pb-accent to-teal-500 transition-all duration-500 ease-out"
                    :style="{ width: getPercent(item.completed, item.total) + '%' }"
                />
              </div>
          </div>
          <div class="p-4 flex flex-col text-gray-600">
            <div class="bg-gray-300 text-gray-800 text-sm font-semibold mb-4 rounded-lg p-3 flex items-center justify-between">
              <h2>Mahsulot turi bo'yicha hisobot</h2>
              <span>jami: {{ item.allItems.reduce((sum, i) => sum + i.count, 0) }}</span>
            </div>

            <div class="flex flex-1 flex-col border-t border-pb-border bg-pb-elevated/50 p-4">
              <div
                  class="mb-3 flex items-center justify-between rounded-lg border border-pb-border bg-pb-surface px-3 py-2.5 text-xs font-semibold text-pb-text"
              >
                <span>Mahsulot turi bo‘yicha</span>
                <span class="tabular-nums text-pb-muted">Jami: {{ item.allItems.length }}</span>
              </div>
              <div class="overflow-hidden rounded-lg border border-pb-border bg-pb-surface">
                <div
                    v-for="(row, rowIndex) in item.allItems"
                    :key="row.id"
                    :class="rowIndex % 2 === 0 ? 'bg-pb-elevated/60' : 'bg-pb-surface'"
                    class="flex items-center justify-between gap-2 px-3 py-2.5 text-sm transition hover:bg-pb-accent/[0.04]"
                >
                  <div class="flex min-w-0 items-center gap-2 text-pb-text">
                    <span class="shrink-0 text-pb-muted">{{ rowIndex + 1 }}.</span>
                    <span class="truncate">{{ row.name }}</span>
                  </div>
                  <span class="shrink-0 font-semibold tabular-nums text-pb-text">{{ row.count }}</span>
                </div>
                <div
                    v-if="!item.allItems.length"
                    class="px-3 py-6 text-center text-sm text-pb-muted"
                >
                  Ma'lumot topilmadi
                </div>
              </div>
            </div>
          </div>
          </article>
        </div>
      </section>

      <section aria-label="Kategoriyalar" class="rounded-xl border border-pb-border bg-pb-surface p-5 shadow-sm sm:p-6">
        <div class="flex flex-col gap-1 border-b border-pb-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-lg font-bold text-pb-text">Kategoriyalar bo‘yicha taqsimot</h2>
          <div class="flex items-baseline gap-2">
            <span class="text-sm text-pb-muted">Jami kategoriyalar</span>
            <span class="text-2xl font-bold tabular-nums text-pb-accent">{{ totalCategories }}</span>
          </div>
        </div>

        <div class="mt-8 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          <div
              v-for="item in categoryStats"
              :key="item.id"
              class="flex flex-col items-center"
          >
            <div class="relative mb-6 inline-block">
              <div
                  class="pointer-events-none absolute -inset-2 rounded-full bg-gradient-to-r from-pb-accent/15 to-violet-500/15 opacity-60 blur-xl"
                  aria-hidden="true"
              />
              <svg width="180" height="180" class="-rotate-90 transform" aria-hidden="true">
                <circle cx="90" cy="90" r="70" fill="none" stroke="rgb(226 232 240)" stroke-width="14" />
                <defs>
                  <linearGradient :id="`gradient-${item.id}`" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" :style="`stop-color:${item.gradientFrom}`" />
                    <stop offset="100%" :style="`stop-color:${item.gradientTo}`" />
                  </linearGradient>
                </defs>
                <circle
                    cx="90"
                    cy="90"
                    r="70"
                    fill="none"
                    :stroke="`url(#gradient-${item.id})`"
                    stroke-width="14"
                    stroke-linecap="round"
                    :stroke-dasharray="getCircleProgress(item.percentage).circumference"
                    :stroke-dashoffset="getCircleProgress(item.percentage).offset"
                    class="transition-all duration-1000 ease-out"
                />
              </svg>
              <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p class="text-3xl font-bold text-pb-text sm:text-4xl">{{ item.percentage }}%</p>
                <p class="mt-0.5 text-xs font-medium text-pb-muted sm:text-sm">{{ item.label }}</p>
              </div>
            </div>
            <div
                :class="item.bgColor"
                class="w-full rounded-xl border border-pb-border px-4 py-4 text-center shadow-sm transition"
            >
              <div class="mb-1 flex items-center justify-center gap-2">
                <i class="text-2xl" :class="[item.icon, item.color]" aria-hidden="true"></i>
                <p class="text-sm font-semibold text-pb-text">{{ item.label }}</p>
              </div>
              <p class="text-3xl font-bold tabular-nums text-pb-text">{{ item.count }}</p>
              <p class="mt-1 text-xs text-pb-muted">
                <i class="fa-solid fa-tags mr-1 text-pb-accent/80" aria-hidden="true"></i>
                Kategoriya
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <footer class="dashboard-footer mt-auto border-t border-white/10 bg-pb-header py-10 text-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-10 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          <div class="space-y-3">
            <h2 class="flex items-center gap-2 text-lg font-bold tracking-tight">
              <img class="h-9 w-9 rounded-lg object-contain" src="../assets/logo.png" alt="" />
              PHOTOBOOK
            </h2>
            <p class="max-w-xs text-sm leading-relaxed text-slate-400">
              Professional suratlar va albomlar tayyorlash tizimining boshqaruv paneli.
            </p>
          </div>

          <div v-for="(section, sKey) in footerLinks" :key="sKey" class="space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-pb-accent-muted">
              {{ section.title }}
            </h3>
            <ul class="space-y-2">
              <li v-for="link in section.links" :key="link.name">
                <router-link
                    :to="link.path"
                    class="group flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
                >
                  <i
                      class="fa-solid fa-chevron-right text-[10px] transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                  ></i>
                  {{ link.name }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-slate-500 md:flex-row">
          <p>© 2026 Photobook ERP. Barcha huquqlar himoyalangan.</p>
          <div class="flex gap-6">
            <router-link to="#" class="transition hover:text-slate-300">Foydalanish shartlari</router-link>
            <router-link to="#" class="transition hover:text-slate-300">Maxfiylik siyosati</router-link>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>


<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import { useStore } from "@/stores/store";
import { useRouter } from "vue-router";
import axiosInstance from "@/axios";

const dataStore = useStore();
const router = useRouter();

type DashboardOrderKind = "ALBUM" | "VIGNETTE" | "PICTURE";
type DashboardStatus = "PENDING" | "IN_PROGRESS" | "PAUSED" | "COMPLETED" | "CANCELLED";
type DashboardCountItem = {
  key?: string;
  categoryName?: string;
  count?: number | string;
};
type BreakdownItem = { id: number; name: string; count: number };
type StatusCounts = Record<DashboardStatus, number>;

const orderKinds: DashboardOrderKind[] = ["ALBUM", "VIGNETTE", "PICTURE"];

const getItemKey = (item: DashboardCountItem) =>
    String(item.key ?? "").trim().toUpperCase();

const getItemCount = (item: DashboardCountItem) =>
    Number(item.count ?? 0) || 0;

const getItemName = (item: DashboardCountItem) =>
    String(item.categoryName ?? item.key ?? "").trim();

const borderColors = [
  { base: "border-l-blue-500", full: "hover:border-blue-400" },
  { base: "border-l-emerald-500", full: "hover:border-emerald-400" },
  { base: "border-l-violet-500", full: "hover:border-violet-400" },
  { base: "border-l-cyan-500", full: "hover:border-amber-400" },
  { base: "border-l-blue-800", full: "hover:border-rose-400" },
  { base: "border-l-indigo-500", full: "hover:border-indigo-400" },
  { base: "border-l-teal-500", full: "hover:border-teal-400" },
  { base: "border-l-green-500", full: "hover:border-green-400" },
];

const clickOpenPage = (path: string, query?: any) => {
  router.push({
    path,
    query
  });
}
const footerLinks = {
  orders: {
    title: 'Buyurtmalar',
    links: [
      { name: 'Albomlar', path: '/album' },
      { name: 'Vinetkalar', path: '/vignette' },
      { name: 'Rasmli albomlar', path: '/photo' }
    ]
  },
  settings: {
    title: 'Boshqaruv',
    links: [
      { name: 'Xodimlar', path: '/users' },
      { name: 'Omborxona', path: '/material' },
      { name: 'Kategoriyalar', path: '/category' }
    ]
  },
  tasks: {
    title: 'Shaxsiy',
    links: [
      { name: 'Mening vazifalarim', path: '/tasks' }
    ]
  }
};
const allAlbumCount = ref<number>(0);
const allVignetteCount = ref<number>(0);
const photoCount = ref<number>(0);
const albumItems = ref<BreakdownItem[]>([]);
const vignetteItems = ref<BreakdownItem[]>([]);
const photoItems = ref<BreakdownItem[]>([]);

const getAlDashboardCounts = async () => {
  const counts: Record<DashboardOrderKind, number> = {
    ALBUM: 0,
    VIGNETTE: 0,
    PICTURE: 0,
  };

  try {
    const { data } = await axiosInstance.get<DashboardCountItem[]>("/api/v1/dashboard/orders-by-kind")
    data?.forEach((item) => {
      const key = getItemKey(item) as DashboardOrderKind;
      if (orderKinds.includes(key)) {
        counts[key] = getItemCount(item);
      }
    })
  }
  catch (error) {
    console.error(error);
  }

  return counts;
}

const getStatusCounts = async (type: "ALBUM" | "VIGNETTE" | "PICTURE") => {
  const result: StatusCounts = {
    PENDING: 0,
    IN_PROGRESS: 0,
    PAUSED: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  }

  try {
    const { data } = await axiosInstance.get<DashboardCountItem[]>("/api/v1/dashboard/orders-by-status", {
      params: {type}
    })

    data?.forEach((item) => {
      const key = getItemKey(item) as DashboardStatus;
      const count = getItemCount(item);
      if (key in result) {
        result[key] = count;
      }
    })
  } catch (error) {
    console.error(`orders-by-status failed for ${type}:`, error);
  }

  return result
}

const albumPending = ref<number>(0);
const albumCompleted = ref<number>(0)

const vignettePending = ref<number>(0)
const vignetteCompleted = ref<number>(0)

const photoPending = ref<number>(0)
const photoCompleted = ref<number>(0)

const loadAllStats = async () => {
  const [kindCounts, album, vignette, photo, albumBreakdown, vignetteBreakdown, photoBreakdown] = await Promise.all([
    getAlDashboardCounts(),
    getStatusCounts("ALBUM"),
    getStatusCounts("VIGNETTE"),
    getStatusCounts("PICTURE"),
    getOrderBreakdown("ALBUM"),
    getOrderBreakdown("VIGNETTE"),
    getOrderBreakdown("PICTURE"),
  ])

  albumItems.value = albumBreakdown;
  vignetteItems.value = vignetteBreakdown;
  photoItems.value = photoBreakdown;

  allAlbumCount.value = kindCounts.ALBUM;
  allVignetteCount.value = kindCounts.VIGNETTE;
  photoCount.value = kindCounts.PICTURE;

  albumPending.value = album.IN_PROGRESS
  albumCompleted.value = album.COMPLETED

  vignettePending.value = vignette.IN_PROGRESS
  vignetteCompleted.value = vignette.COMPLETED
  photoPending.value = photo.IN_PROGRESS
  photoCompleted.value = photo.COMPLETED
}

const getOrderBreakdown = async (type: "ALBUM" | "VIGNETTE" | "PICTURE") => {
  try {
    const res = await axiosInstance.get<DashboardCountItem[]>("/api/v1/dashboard/orders-by-category", {
      params: { type }
    });

    return (res.data || []).map((item, index) => ({
      id: index + 1,
      name: getItemName(item),
      count: getItemCount(item),
    }));
  } catch (error) {
    console.error(`orders-by-category failed for ${type}:`, error);
    return [];
  }
}

const allUsers = computed(() => dataStore.state.user?.items.length || 0)
const allMaterialCount = computed(() => dataStore.state.items?.length || 0)
const albumCategories = computed(() => dataStore.state.alCategory?.length || 0)
const vignetteCategories = computed(() => dataStore.state.vignetteCategory?.length || 0)
const photosCategories = computed(() => dataStore.state.photoCategory?.length || 0)

const getAlbums = computed( () => [
  { id: 1,
    name: 'Jami albom',
    itemCount: allAlbumCount.value,
    icon: "fa-solid fa-book",
    onclick: () => clickOpenPage('/album')
  },
  { id: 2,
    name: 'Vinetka',
    itemCount: allVignetteCount.value,
    icon: "fa-solid fa-book-open",
    onclick: () => clickOpenPage('/vignette')
  },
  { id: 3,
    name: 'Rasmli albom',
    itemCount: photoCount.value,
    icon: "fa-solid fa-images",
    onclick: () => clickOpenPage('/photo')
  },
  { id: 4,
    name: 'Xodimlar',
    itemCount: allUsers.value,
    icon: 'fa-solid fa-users',
    onclick: () => clickOpenPage('/users')
  },
  { id: 5,
    name: 'Jami xomashyo',
    itemCount: allMaterialCount.value,
    icon: "fa-solid fa-warehouse",
    onclick: () => clickOpenPage('/material')
  },
  { id: 6,
    name: "Albom kategoriyalari",
    itemCount: albumCategories.value,
    icon: "fa-solid fa-book",
    onclick: () => clickOpenPage('/category', { group: 1 })
  },
  { id: 7,
    name: "Vinetka kategoriyalari",
    itemCount: vignetteCategories.value,
    icon: "fa-solid fa-book-open",
    onclick: () => clickOpenPage('/category', { group: 2 })
  },
  { id: 8,
    name: "Rasmli albom kategoriyalari",
    itemCount: photosCategories.value,
    icon: "fa-solid fa-images",
    onclick: () => clickOpenPage('/category', { group: 3 })
  }
])

const allStatuses = computed(() =>[
  {
    id: 1,
    label: 'Albom',
    icon: "fa-solid fa-book",
    total: allAlbumCount.value,
    pending: albumPending.value,
    completed: albumCompleted.value,
    onClick: (status : "IN_PROGRESS" | "COMPLETED") => {
      const query = {
        status: status,
      };
      clickOpenPage('/album', query)
    },
    allItems: albumItems.value
  },
  {
    id: 2,
    label: 'Vinetka',
    icon: "fa-solid fa-book-open",
    total: allVignetteCount.value,
    pending: vignettePending.value,
    completed: vignetteCompleted.value,
    onClick: (status: "IN_PROGRESS" | "COMPLETED") => {
      const query = {
        status: status,
      }
      clickOpenPage('/vignette', query)
    },
    allItems: vignetteItems.value
  },
  {
    id: 3,
    label: 'Rasmli Albom',
    icon: "fa-solid fa-images",
    total: photoCount.value,
    pending: photoPending.value,
    completed: photoCompleted.value,
    onClick: (status: "IN_PROGRESS" | "COMPLETED") => {
      const query = {
        status: status,
      }
      clickOpenPage('/photo', query)
    },
    allItems: photoItems.value
  }
])

const getPercent = (completed: number, total: number) => {
  if (!total) return 0
  return Math.round((completed / total) * 100)
}

const totalCategories = computed(() =>
    albumCategories.value + vignetteCategories.value + photosCategories.value
)

const albumPercentage = computed(() =>
    totalCategories.value > 0
        ? Math.round((albumCategories.value / totalCategories.value) * 100)
        : 0
)

const vignettePercentage = computed(() =>
    totalCategories.value > 0
        ? Math.round((vignetteCategories.value / totalCategories.value) * 100)
        : 0
)

const photosPercentage = computed(() =>
    totalCategories.value > 0
        ? Math.round((photosCategories.value / totalCategories.value) * 100)
        : 0
)

const categoryStats = computed(() => [
  {
    id: 1,
    label: 'Albom',
    icon: 'fa-solid fa-book',
    count: albumCategories.value,
    percentage: albumPercentage.value,
    color: 'text-blue-600',
    bgColor: "border-t-4 border-t-blue-500 bg-pb-elevated",
    strokeColor: '#3b82f6',
    gradientFrom: '#3b82f6',
    gradientTo: '#1e40af'
  },
  {
    id: 2,
    label: 'Vinetka',
    icon: 'fa-solid fa-book-open',
    count: vignetteCategories.value,
    percentage: vignettePercentage.value,
    color: 'text-green-600',
    bgColor: "border-t-4 border-t-emerald-500 bg-pb-elevated",
    strokeColor: '#10b981',
    gradientFrom: '#10b981',
    gradientTo: '#059669'
  },
  {
    id: 3,
    label: 'Rasmli albom',
    icon: 'fa-solid fa-images',
    count: photosCategories.value,
    percentage: photosPercentage.value,
    color: 'text-purple-600',
    bgColor: "border-t-4 border-t-violet-500 bg-pb-elevated",
    strokeColor: '#8b5cf6',
    gradientFrom: '#8b5cf6',
    gradientTo: '#7c3aed'
  }
])

const getCircleProgress = (percentage: number) => {
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  return { circumference, offset }
}

// const formatDate = (dateString?: string | null): string => {
//   if (!dateString) return '';
//
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return '';
//
//   const day = date.getDate().toString().padStart(2, '0');
//   const year = date.getFullYear();
//   const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
//   const month = monthName[date.getMonth()];
//   return `${day} ${month} ${year}`;
// };

onMounted(async (): Promise<void> => {
  await Promise.all([
    loadAllStats(),
    dataStore.loadUsers(),
    dataStore.loadMaterials(),
    dataStore.loadCategory("ALBUM"),
    dataStore.loadCategory("VIGNETTE"),
    dataStore.loadCategory("PICTURE"),
  ]);
})
</script>
<style scoped>
.dashboard-page {
  background:
      linear-gradient(180deg, rgb(248 250 252 / 0.9) 0%, var(--color-pb-app) 38%, var(--color-pb-app) 100%),
      radial-gradient(ellipse 70% 45% at 50% -10%, rgb(37 99 235 / 0.08), transparent 55%);
}

.animate-fade-in {
  animation: fadeIn 0.45s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
