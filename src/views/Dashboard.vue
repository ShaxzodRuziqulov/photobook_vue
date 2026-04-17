<template>
  <div class="flex flex-col w-full h-screen">
    <div class="flex p-6 flex-col animate-fade-in container m-auto gap-6 w-full">
      <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 items-center"
      >
        <div
            class="flex flex-col cursor-pointer gap-2 bg-white shadow-md
            rounded-lg p-6 relative h-full
            border-2 border-gray-200 transition-all duration-300 ease-out
            hover:-translate-y-1 hover:shadow-lg group
            "
          :class="[
              'p-3 w-full h-12 rounded-xl text-xl',
              borderColors[index % borderColors.length].base,
              borderColors[index % borderColors.length].full
            ]"
          v-for="(item, index) in getAlbums"
          :key="index"
          @click="item.onclick"
        >
          <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition rounded-xl
                bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10"
          >
          </div>
        <div class="flex items-start justify-between">
          <div
              :class="[
                  'text-white bg-blue-600 flex items-center justify-center w-10 h-10 rounded-xl text-xl',
                  index % 8 === 0 ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                  index % 8 === 1 ? 'bg-gradient-to-br from-emerald-600 to-teal-600' :
                  index % 8 === 2 ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                  index % 8 === 3 ? 'bg-gradient-to-br from-orange-500 to-amber-600' :
                  index % 8 === 4 ? 'bg-gradient-to-br from-rose-500 to-fuchsia-600' :
                  index % 8 === 5 ? 'bg-gradient-to-br from-indigo-500 to-blue-600' :
                  index % 8 === 6 ? 'bg-gradient-to-br from-teal-500 to-cyan-600' :
                  'bg-gradient-to-br from-green-500 to-emerald-600'
                  ,
              ]"
          >
            <i :class="item.icon"
               class="">
            </i>
          </div>
          <i
              :class="[
                  'text-white bg-blue-600 w-8 h-8 rounded-xl text-xl',
                  index % 8 === 0 ? 'bg-gradient-to-br from-blue-500 to-cyan-600' :
                  index % 8 === 1 ? 'bg-gradient-to-br from-emerald-600 to-teal-600' :
                  index % 8 === 2 ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                  index % 8 === 3 ? 'bg-gradient-to-br from-orange-500 to-amber-600' :
                  index % 8 === 4 ? 'bg-gradient-to-br from-rose-500 to-fuchsia-600' :
                  index % 8 === 5 ? 'bg-gradient-to-br from-indigo-500 to-blue-600' :
                  index % 8 === 6 ? 'bg-gradient-to-br from-teal-500 to-cyan-600' :
                  'bg-gradient-to-br from-green-500 to-emerald-600'
                  ,
              ]"
              class="fa-solid fa-arrow-right p-2 rounded-lg text-white text-lg
                  transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          >
          </i>
          </div>
          <div class="flex gap-4 items-center justify-between">
            <span class="text-gray-600 text-lg font-semibold break-all">{{item.name}}</span>
            <span class="text-2xl text-gray-800 font-semibold break-all">{{item.itemCount}}</span>
          </div>
        </div>
      </div>
      <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 items-center"
      >
        <div class="flex flex-col h-full border-2 border-gray-200 rounded-xl"
             v-for="(item, index) in allStatuses"
             :key="index"
        >
          <div
              :class="[
              'text-white p-4 bg-blue-600 rounded-tr-xl rounded-tl-xl ',
              index % 3 === 0 ? 'bg-gradient-to-br from-indigo-400 to-teal-500' :
              index % 3 === 1 ? 'bg-gradient-to-br from-teal-400 to-teal-500' :
              'bg-gradient-to-br from-purple-400 to-teal-500'
            ]"
          >
            <div class="flex text-lg items-center justify-between">
              <div class="flex items-center gap-2">
                <i :class="item.icon"></i>
                {{item.label}}
              </div>
              <span class="items-center">Jami: {{item.total}}</span>
            </div>
            <div class="flex border-t border-gray-200 my-4"></div>
            <div class="grid grid-cols-2 gap-4">
            <div
                @click="item.onClick('IN_PROGRESS')"

                  class="bg-white/10 cursor-pointer rounded-lg p-3 backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
                  :class="[
                  index % 3 === 0 ? 'border-2 border-blue-400 hover:border-blue-600' :
                  index % 3 === 1 ? 'border-2 border-teal-500 hover:border-teal-600' :
                  'border-2 border-purple-400 hover:border-purple-600'
              ]"
              >
                <div class="flex items-center justify-between">
                  <p class="text-sm mb-1">Jarayonda</p>
                  <i class="fa-regular fa-clock"></i>
                </div>
                <div class="flex items-center justify-between">
                  <p class="text-2xl font-bold">{{ item.pending }}</p>
                  <i class="fa-solid fa-arrow-right"></i>
                </div>
              </div>
              <div
                  @click="item.onClick('COMPLETED')"
                  class="bg-white/10 cursor-pointer rounded-lg p-3 backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
                  :class="[
                  index % 3 === 0 ? 'border-2 border-blue-400 hover:border-blue-600' :
                  index % 3 === 1 ? 'border-2 border-teal-500 hover:border-teal-600' :
                  'border-2 border-purple-400 hover:border-purple-600'
              ]"
              >
                <div class="flex items-center justify-between">
                  <p class="text-sm mb-1">Bajarilgan</p>
                  <i class="fa-regular fa-circle-check"></i>
                </div>
                <div class="flex items-center justify-between">
                  <p class="text-2xl font-bold">{{ item.completed }}</p>
                  <i class="fa-solid fa-arrow-right"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-4 px-4 py-2">
            <div class="flex items-center text-gray-600 justify-between text-sm mb-2">
              <span class="font-bold text-md">Bajarilish foizi</span>
              <span class="font-bold">
              <i class="fa-solid fa-arrow-trend-up"></i>
            {{ getPercent(item.completed, item.total) }}%
          </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div
                  class="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                  :style="{ width: getPercent(item.completed, item.total) + '%' }"
              ></div>
            </div>
          </div>
          <div class="p-4 flex flex-col text-gray-600">
            <div class="bg-gray-300 text-gray-800 text-sm font-semibold mb-4 rounded-lg p-3 flex items-center justify-between">
              <h2>Mahsulot turi bo'yicha hisobot</h2>
              <span>jami: {{ item.allItems.length }}</span>
            </div>
            <div
                v-for="(status, index) in item.allItems"
                :key="status.id"
                :class="index % 2 === 0 ? 'bg-gray-200' : ''"
                class=""
            >
              <div
                  class="flex justify-between p-3 text-sm hover:bg-gray-300"
              >
                <div class="flex items-center gap-2">
                  <span>{{index + 1}}.</span>
                  <span>{{ status.name }}</span>
                </div>
                <span>{{ status.count }}</span>
              </div>
            </div>
            <div
                v-if="!item.allItems.length"
                class="rounded-lg bg-gray-100 p-3 text-sm text-gray-500"
            >
              Ma'lumot topilmadi
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-lg p-4">
        <div class="flex items-center p-2 gap-2">
          <h2 class="text-lg font-semibold text-gray-800">Kategoriyalar bo'yicha taqsimot jami:</h2>
          <span class="text-lg">{{totalCategories}}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 mt-6 gap-8">
          <div
              v-for="item in categoryStats"
              :key="item.id"
              class="flex flex-col items-center"
          >
            <div class="relative inline-block mb-6">
              <div class="absolute -inset-1 blur-xl opacity-20
                    bg-gradient-to-r from-blue-500 to-purple-500"
              >
              </div>
              <svg width="180" height="180" class="transform -rotate-90">
                <circle
                    cx="90"
                    cy="90"
                    r="70"
                    fill="none"
                    stroke="#e5e7eb"
                    stroke-width="16"
                />
                <defs>
                  <linearGradient :id="`gradient-${item.id}`" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" :style="`stop-color:${item.gradientFrom}`"/>
                    <stop offset="100%" :style="`stop-color:${item.gradientTo}`"/>
                  </linearGradient>
                </defs>
                <circle
                    cx="90"
                    cy="90"
                    r="70"
                    fill="none"
                    :stroke="`url(#gradient-${item.id})`"
                    stroke-width="16"
                    stroke-linecap="round"
                    :stroke-dasharray="getCircleProgress(item.percentage).circumference"
                    :stroke-dashoffset="getCircleProgress(item.percentage).offset"
                    class="transition-all duration-1000 ease-out"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <p class="text-4xl font-bold">{{ item.percentage }}%</p>
                <p class="text-sm text-gray-500 mt-1">{{ item.label }}</p>
              </div>
            </div>
            <div
                :class="item.bgColor"
                class="text-center p-4 w-full rounded-2xl transition-all duration-500"
            >
              <div class="flex items-center justify-center gap-2 mb-2">
                <i class="text-3xl text-blue-500" :class="item.icon"></i>
                <p class="text-md font-semibold text-gray-700">{{ item.label }}</p>
              </div>
              <p class="text-4xl font-bold text-gray-900">{{ item.count }}</p>
              <p class="text-sm text-gray-500 mt-1">
                <i class="fa-solid fa-tags text-blue-400"></i>
                Kategoriya
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full text-white bg-gray-900 p-4">
      <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container m-auto gap-10 items-center justify-center w-full p-4">
        <div class="flex flex-col p-6 text-md gap-4">
          <h2 class="text-xl font-bold">Buyurtmalar</h2>
          <div class="flex flex-col items-start gap-2 text-gray-400 font-semibold">
            <a href="/album" class="hover:text-purple-600">Albomlar nazorati</a>
            <a href="/vignette" class="hover:text-purple-600">Vinetkalar nazorati</a>
            <a href="/photo" class="hover:text-purple-600">Rasmli albomlar nazorati</a>
          </div>
        </div>
        <div class="flex flex-col p-6 text-md gap-4">
          <h2 class="text-xl font-bold">Sozlamalar</h2>
          <div class="flex flex-col text-start gap-2 text-gray-400 font-semibold">
            <a href="/users" class="hover:text-purple-600">Xodimlar nazorati</a>
            <a href="/material" class="hover:text-purple-600">Omborxona nazorati</a>
            <a href="/category" class="hover:text-purple-600">Kategoriyalar nazorati</a>
          </div>
        </div>
        <div class="flex flex-col p-6 text-md gap-4">
          <h2 class="text-xl font-bold">Vazifalar</h2>
          <div class="flex flex-col text-start gap-2 text-gray-400 font-semibold">
            <a href="/tasks" class="hover:text-purple-600">Mening vazifalarim</a>
          </div>
        </div>
        <div class="flex flex-col text-gray-400 font-semibold text-center p-4 text-md gap-2">
        <span class="font-bold">
          Barcha sahifalar bo'yicha statistik tahlillar
        </span>
          <p>
            © 2026 <span class="text-sm ">PHOTOBOOK. Barcha huquqlar himoyalangan.</span>
          </p>
        </div>
      </div>

    </div>
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
  {base: 'border-l-blue-500', full: 'hover:border-blue-500'},
  {base: 'border-l-emerald-600', full: 'hover:border-emerald-600'},
  {base: 'border-l-purple-500', full: 'hover:border-purple-500'},
  {base: 'border-l-orange-500', full: 'hover:border-orange-500'},
  {base: 'border-l-rose-500', full: 'hover:border-rose-500'},
  {base: 'border-l-indigo-500', full: 'hover:border-indigo-500'},
  {base: 'border-l-teal-500', full: 'hover:border-teal-500'},
  {base: 'border-l-green-500', full: 'hover:border-green-500'},
]

const clickOpenPage = (path: string, query?: any) => {
  router.push({
    path,
    query
  });
}

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
    name: 'Jami Xomashyo',
    itemCount: allMaterialCount.value,
    icon: "fa-solid fa-warehouse",
    onclick: () => clickOpenPage('/material')
  },
  { id: 6,
    name: "Albom Kategoriy",
    itemCount: albumCategories.value,
    icon: "fa-solid fa-book",
    onclick: () => clickOpenPage('/category', { group: 1 })
  },
  { id: 7,
    name: "Vinetka kategoriya",
    itemCount: vignetteCategories.value,
    icon: "fa-solid fa-book-open",
    onclick: () => clickOpenPage('/category', { group: 2 })
  },
  { id: 8,
    name: "Rasmli Albom kategoriya",
    itemCount: photosCategories.value,
    icon: "fa-solid fa-images",
    onclick: () => clickOpenPage('/category', { group: 3})
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
    bgColor: 'bg-blue-100',
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
    bgColor: 'bg-green-100',
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
    bgColor: 'bg-purple-200',
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
