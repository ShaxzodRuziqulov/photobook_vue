<template>
  <div class="flex flex-col w-full h-screen">
    <div class="flex p-6 flex-col animate-fade-in container m-auto gap-6 w-full">
      <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 items-center"
      >
        <div
            class="flex flex-col cursor-pointer gap-2 bg-white shadow
            rounded-lg p-6 relative h-full
            border-2 border-gray-200 transition-all duration-300 ease-out
            hover:-translate-y-1 hover:shadow-lg
            hover:border-blue-400 group
            "
          :class="[
              'p-3 w-full h-12 rounded-xl text-xl',
              borderColors[index % borderColors.length]
            ]"
          v-for="(item, index) in getAlbums"
          :key="index"
          @click="item.onclick"
      >
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
                class="fa-solid fa-arrow-right bg-blue-500 p-2 rounded-md text-white text-xl group-hover:-translate-y-1 transition-all duration-300 ease-out"></i>
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
        <div class="flex text-xl items-center justify-between">
          <div class="flex items-center gap-2">
            <i :class="item.icon"></i>
            {{item.label}}
          </div>
          <span>Jami: {{item.total}}</span>
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
            <h2 class="bg-blue-100 text-sm font-semibold mb-2 rounded-lg p-3">Mahsulot turi buyicha hisobot</h2>
            <div
                v-for="status in item.allItems"
                :key="status.label"
                class="border-t border-gray-200 p-2"
            >
              <div
                  class="flex justify-between text-sm"
              >
                <span>{{ status.label }}</span>
                <span>{{ status.count }}</span>
              </div>
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
    <div class="w-full text-white bg-black">
      <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container m-auto gap-10 items-center justify-center w-full p-4">
        <div class="flex flex-col p-6 text-md gap-4">
          <h2 class="text-xl font-bold">Zakazlar</h2>
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

const borderColors = [
  'border-l-blue-500',
  'border-l-emerald-600',
  'border-l-purple-500',
  'border-l-orange-500',
  'border-l-rose-500',
  'border-l-indigo-500',
  'border-l-teal-500',
  'border-l-green-500'
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

const getAlDashboardCounts = async () => {
  try {
    const res = await axiosInstance.get("/api/v1/dashboard/orders-by-kind")
    res.data?.forEach((item: any) => {
      if (item.key === 'ALBUM') {
        allAlbumCount.value = item.count
      }
      if (item.key === 'VIGNETTE') {
        allVignetteCount.value = item.count
      }
      if (item.key === 'PICTURE') {
        photoCount.value = item.count
      }
    })
    console.log('All counts',res.data)
  }
  catch (error) {
    console.error(error);
  }
}

const getStatusCounts = async (type: "ALBUM" | "VIGNETTE" | "PICTURE") => {
  const res = await axiosInstance.get("/api/v1/dashboard/orders-by-status",
      {
        params: {type}
      }
  )

  const result = {
    total: 0,
    pending: 0,
    completed: 0,
  }

  res.data?.forEach((item: any) => {
    if (item.key === "IN_PROGRESS") {
      result.pending = item.count
    }

    if (item.key === "COMPLETED") {
      result.completed = item.count
    }

    result.total += item.count
  })

  return result
}

const albumPending = ref<number>(0);
const albumCompleted = ref<number>(0)

const vignettePending = ref<number>(0)
const vignetteCompleted = ref<number>(0)

const photoPending = ref<number>(0)
const photoCompleted = ref<number>(0)

const loadAllStats = async () => {
  const album = await getStatusCounts("ALBUM")
  const vignette = await getStatusCounts("VIGNETTE")
  const photo = await getStatusCounts("PICTURE")

  albumPending.value = album.pending
  console.log('Album pending',albumPending.value)
  albumCompleted.value = album.completed

  vignettePending.value = vignette.pending
  vignetteCompleted.value = vignette.completed
  console.log('Vignette pending', vignettePending.value)
  photoPending.value = photo.pending
  photoCompleted.value = photo.completed
}

const getExpenses = async () => {
  try {
    const res = await axiosInstance.get("/api/v1/dashboard/revenue-trend")
    console.log('Expenses',res.data)
  }
  catch (error) {
    console.error(error);
  }
}

getExpenses()
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
    onclick: () => clickOpenPage('/employee')
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
    allItems: [
      { id: 1, label: 'A3 albom', count: '300' },
      { id: 2, label: 'A3 knijniy', count: '400'},
      { id: 3, label: 'Kichik albom 6 betlik', count: '500'},
      { id: 4, label: 'Kichik albom 8 betlik', count: '500'},
      { id: 5, label: 'Kichik albom 10 betlik', count: '500'},
      { id: 6, label: 'Kichik albom 14 betlik', count: '500'},
      { id: 7, label: 'Kichik albom 120 betlik', count: '500'},
      { id: 8, label: 'Kichik knijniy', count: '300'},
      { id: 9, label: 'Ikki tomonlama', count: '200'}
    ]
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
    allItems: [
      { id: 1, label: 'Bitiruvchi qora', count: '500'},
      { id: 2, label: 'Bitiruvchi oq', count: '400'},
      { id: 3, label: 'Kuk papka', count: '300'},
      { id: 4, label: 'Yashil', count: '200'},
      { id: 5, label: 'Sariq', count: '600'},
      { id: 6, label: 'Qora papka', count: '600'},
    ]
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
    allItems: [
      { id: 1, label: 'A3 albom', count: '300'},
      { id: 2, label: 'A3 knijniy', count: '200'},
      { id: 3, label: 'Kichik albom', count: '400'},
      { id: 4, label: 'Kichik knijniy', count: '500'},
      { id: 5, label: 'Sredniy', count: '300'},
      { id: 6, label: 'Kvadrat', count: '200'},
      { id: 7, label: 'Ikki tomonlama', count: '300'},
    ]
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

const formatDate = (dateString?: string | null): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const month = monthName[date.getMonth()];
  return `${day} ${month} ${year}`;
};

onMounted(async (): Promise<void> => {
  await getAlDashboardCounts()
  await loadAllStats();
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
