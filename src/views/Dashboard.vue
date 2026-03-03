<template>
  <div class="flex p-6 flex-col container m-auto gap-6 h-screen w-full">
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
                  'text-white bg-blue-600 p-3 w-12 h-12 rounded-xl text-xl',
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
                  'text-white bg-blue-600 p-2 w-8 h-8 rounded-xl text-xl',
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
      <div class="flex flex-col bg-white p-4 border-2 border-gray-200 rounded-xl"
           v-for="(item, index) in allStatuses"
           :key="index"
           :class="[
              'text-white bg-blue-600',
              index % 3 === 0 ? 'bg-gradient-to-br from-indigo-400 to-teal-500' :
              index % 3 === 1 ? 'bg-gradient-to-br from-teal-400 to-teal-500' :
              'bg-gradient-to-br from-purple-400 to-teal-500'
            ]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i :class="item.icon"></i>
            {{item.label}}
          </div>
          {{item.total}}
        </div>
        <div class="flex border-t border-gray-200 my-4"></div>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <p class="text-sm mb-1">Kutilmoqda</p>
            <p class="text-2xl font-bold">{{ item.pending }}</p>
          </div>
          <div class="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <p class="text-sm mb-1">Bajarilgan</p>
            <p class="text-2xl font-bold">{{ item.completed }}</p>
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center justify-between text-sm mb-2">
            <span class="">Bajarilish foizi</span>
            <span class="font-bold">
            {{ item.total > 0 ? Math.round((Number(item.completed) / item.total) * 100) : 0 }}%
          </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
                class="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                :style="{ width: (item.total > 0 ? (Number(item.completed) / item.total) * 100 : 0) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white rounded-xl shadow-lg p-4">
      <h2 class="text-2xl font-bold text-gray-800 mb-8">Kategoriyalar Bo'yicha Taqsimot</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
            v-for="item in categoryStats"
            :key="item.id"
            class="flex flex-col items-center"
        >
          <!-- Circular Progress -->
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
              <p class="text-5xl font-bold">{{ item.percentage }}%</p>
              <p class="text-sm text-gray-500 mt-1">{{ item.label }}</p>
            </div>
          </div>
          <div class="text-center">
            <div class="flex items-center justify-center gap-2 mb-2">
              <i class="text-3xl text-blue-500" :class="item.icon"></i>
              <p class="text-lg font-semibold text-gray-700">{{ item.label }}</p>
            </div>
            <p class="text-4xl font-bold text-gray-900">{{ item.count }}</p>
            <p class="text-sm text-gray-500 mt-1">Kategoriya</p>
          </div>
        </div>
      </div>
      <div class="mt-10 py-6 border-t border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="text-center p-4 bg-gray-200 rounded-xl">
            <p class="text-sm text-gray-600 mb-1"><i class="fa-solid fa-tags text-blue-600"></i> Jami Kategoriyalar</p>
            <p class="text-3xl font-bold text-gray-800">{{ totalCategories }}</p>
          </div>
          <div :class="['text-center p-4 rounded-xl', categoryStats[0].bgColor]">
            <p class="text-sm text-gray-600 mb-1"> <i class="fa-solid fa-book text-blue-600"></i> Albomlar</p>
            <p :class="['text-3xl font-bold', categoryStats[0].color]">{{ albumCategories }}</p>
          </div>
          <div :class="['text-center p-4 rounded-xl', categoryStats[1].bgColor]">
            <p class="text-sm text-gray-600 mb-1"><i class="fa-solid fa-book-open text-blue-600"></i> Vinetka</p>
            <p :class="['text-3xl font-bold', categoryStats[1].color]">{{ vignetteCategories }}</p>
          </div>
          <div :class="['text-center p-4 rounded-xl', categoryStats[2].bgColor]">
            <p class="text-sm text-gray-600 mb-1"><i class="fa-solid fa-images text-blue-600"></i> Rasmli Albom</p>
            <p :class="['text-3xl font-bold', categoryStats[2].color]">{{ photosCategories }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>


<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import { useStore } from "@/stores/store";
import { useRouter } from "vue-router";

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

const allAlbumCount = computed(() => dataStore.state.albums?.length || 0
)

const albumPending = computed(() => {
  return dataStore.state.albums?.filter(item => item.status === 'Jarayonda').length || 0;
})

const albumCompleted = computed(() => {
  return dataStore.state.albums?.filter(
      item => item.status === 'Bajarilgan'
  ).length || 0
})
const allVignetteCount = computed(() => {
  return dataStore.state.vignette?.length || 0
})

const vignettePending = computed(() => {
  return dataStore.state.vignette?.filter(item => item.status === 'Jarayonda').length || 0
})
const vignetteCompleted = computed(() => {
  return dataStore.state.vignette?.filter(item => item.status === 'Bajarilgan').length || 0
})

const photoCount = computed(() => {
  return dataStore.state.pictures?.length || 0
})

const photoPending = computed(() => {
  return dataStore.state.pictures?.filter(item => item.status === 'Jarayonda').length || 0
})

const photoCompleted = computed(() => {
  return dataStore.state.pictures?.filter(item => item.status === 'Bajarilgan').length || 0
})

const allUsers = computed(() => dataStore.state.users?.length || 0)
const allMaterialCount = computed(() => dataStore.state.items?.length || 0)
const albumCategories = computed(() => dataStore.state.alCategory?.length || 0)
const vignetteCategories = computed(() => dataStore.state.vignetteCategory?.length || 0)
const photosCategories = computed(() => dataStore.state.photoCategory?.length || 0)

const getAlbums = ref([
  { id: 1,
    name: 'Jami albom',
    itemCount: allAlbumCount.value,
    icon: "fa-solid fa-boxes",
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
    icon: "fa-solid fa-tags",
    onclick: () => clickOpenPage('/category', { group: 1 })
  },
  { id: 7,
    name: "Vinetka kategoriya",
    itemCount: vignetteCategories.value,
    icon: "fa-solid fa-tags",
    onclick: () => clickOpenPage('/category', { group: 2 })
  },
  { id: 8,
    name: "Rasmli Albom kategoriya",
    itemCount: photosCategories.value,
    icon: "fa-solid fa-tags", onclick: () => clickOpenPage('/category', { group: 3})
  }
])

const allStatuses = ref([
  {
    id: 1,
    label: 'Albom',
    icon: "fa-solid fa-book",
    total: allAlbumCount.value,
    pending: albumPending.value,
    completed: albumCompleted.value,
  },
  {
    id: 2,
    label: 'Vinetka',
    icon: "fa-solid fa-book-open",
    total: allVignetteCount.value,
    pending: vignettePending.value,
    completed: vignetteCompleted.value,
  },
  {
    id: 3,
    label: 'Rasmli Albom',
    icon: "fa-solid fa-images",
    total: photoCount.value,
    pending: photoPending.value,
    completed: photoCompleted.value,
  }
])


// Umumiy kategoriyalar
const totalCategories = computed(() =>
    albumCategories.value + vignetteCategories.value + photosCategories.value
)

// Foizlar
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

// Kategoriya statistikasi
const categoryStats = computed(() => [
  {
    id: 1,
    label: 'Albomlar',
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
  // await getCategory();
})
</script>
<style>
</style>