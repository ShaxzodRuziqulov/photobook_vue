<template>
  <div class="flex flex-col container m-auto w-full p-6">
    <div class="w-full flex bg-white flex-col px-4 py-2 gap-3 min-h-0 rounded-xl shadow">
      <CDialog
          :show="activeTaskForm"
          @close="activeTaskForm = false"
          has-close-icon
          no-header
          bodyClass="rounded-lg mt-20 !bg-bg-primary"
      >
        <div class="p-5 flex flex-col gap-4 w-full px-6">

          <h2 class="text-xl font-semibold">Vazifa Bajarish</h2>

          <div class="bg-gray-100 p-3 rounded-lg flex flex-col w-full gap-1">
            <span class="font-semibold text-lg flex">
              {{ selectedTask?.orderName }}
            </span>
            <span>{{selectedTask?.itemType}}</span>

            <div class="flex justify-between text-sm text-gray-600">
              <span>Jami: {{ selectedTask?.amount }}</span>
              <span>Bajarilgan: {{ selectedTask?.processedCount }}</span>
              <span>
          Qoldi:
          {{ (selectedTask?.amount || 0) - (selectedTask?.processedCount || 0) }}
        </span>
            </div>
          </div>

          <!-- 📥 Input -->
          <div class="flex flex-col gap-2">
            <label>Bajarish</label>
            <input
                type="number"
                v-model="form.processedCount"
                class="border rounded p-2"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label>Izoh</label>
            <textarea
                v-model="form.notes"
                class="border rounded p-2"
                placeholder="Izoh yozing..."
            />
          </div>
          <div class="flex justify-end gap-2 mt-2">
            <CButton
                type="button"
                text="Bekor qilish"
                variant="ghost-accent"
                @click="activeTaskForm = false"
            />
            <CButton
                text="Saqlash"
                variant="primary"
                @click="completedTask"
            />
          </div>

        </div>
      </CDialog>
      <div
          v-if="previewImage"
          class="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          @click="closePreview"
      >
        <div class="relative max-w-5xl w-full flex justify-center">

          <button
              @click.stop="closePreview"
              class="absolute cursor-pointer top-[-50px] right-2 sm:right-4 md:top-4 md:right-4 lg:right-10 border-2 border-red-200
            bg-red-100 hover:bg-red-300  text-red-600 rounded-full w-10 h-10 flex items-center justify-center transition "
          >
            <i class="fa-solid fa-close text-lg"></i>
          </button>
          <img
              alt=""
              :src="previewImage"
              class="max-h-[85vh] w-auto rounded-2xl shadow-2xl"
              @click.stop
          />
        </div>
      </div>
      <div class="flex items-center gap-2">
        <CButton
            type="button"
            text="Ortga"
            is-has-fa-icon
            variant="ghost-accent"
            faClass="fa-solid fa-arrow-left"
            @click="router.back()"
        />
        <h2 class="text-xl font-semibold">Barcha vazifalar</h2>
      </div>
      <div
          class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 items-end gap-4 py-2"
      >
        <AppSelect
            :options="itemStatus"
            v-model="formStatus"
            label="Holat"
            has-reset
            resetText="Hammasi"
        />
        <AppInput
            v-model="formFilter"
            label="Qidirish"
            placeholder="Qidirish ..."
        />
        <AppInput
            v-model="formData"
            type="date"
            label="Qabul sanasi"
        />
        <AppInput
            v-model="endData"
            type="date"
            label="Tugash sanasi"
        />
        <CButton
            type="button"
            text="Tozalash"
            variant="ghost-accent"
            @click="closeFilter"
            class="mb-1"
        />
      </div>
      <div
          class="overflow-auto"
      >
        <table
            class="w-full table-auto overflow-auto"
        >
          <colgroup>
            <col style="width: 3%">
            <col style="width: 15%">
            <col style="width: 13%">
            <col style="width: 12%">
            <col style="width: 12%">
            <col style="width: 12%">
            <col style="width: 12%">
            <col style="width: 12%">
            <col style="width: 13%">
            <col style="width: 12%">
            <col style="width: 15%">
          </colgroup>
          <thead class="bg-gray-200 text-gray-700 tracking-wider">
          <tr>
            <th class="px-1 py-3 items-start">№</th>
            <th class="p-2 text-start">Buyurtma nomi</th>
            <th class="p-2 text-start">Rasm</th>
            <th class="p-2 text-start">Bo'lim</th>
            <th class="p-2 text-start">Mijoz</th>
            <th class="p-2 text-start">Qabul qilgan</th>
            <th class="p-2 text-start">Sana</th>
            <th class="p-2 text-start">Muddat</th>
            <th class="p-3 text-start">Jarayon</th>
            <th class="p-2 text-start">Holat</th>
            <th class="p-3 text-start">Amallar</th>
          </tr>
          </thead>
          <tbody v-if="filteredOrders.length > 0">
          <tr
              class="py-4 border-t border-gray-600 hover:bg-gray-100"
              v-for="(task, index) in filteredOrders"
              :key="index"
          >
            <td class="px-3 py-2">{{index + 1}}</td>
            <td class="p-2 break-all">
              <p class="font-semibold">{{ task.orderName }}</p>
              <p class="text-gray-500 text-sm font-semibold">{{task.categoryName}}</p>
              <p class="text-blue-600 text-sm font-semibold">{{task.itemType}}</p>
            </td>
            <td class="p-2">
              <img
                  @click="openPreview(task.imageUrl)"
                  v-if="task.imageUrl"
                  class="w-14 h-10 sm:h-10 lg:h-12 cursor-pointer rounded-xl"
                  :src="task.imageUrl" alt="">
            </td>
            <td class="p-2 text-blue-600 font-semibold text-sm">{{statusOrder[task.kind]}}</td>
            <td class="p-2">{{task.customerName}}</td>
            <td class="p-2">{{task.receiverName}}</td>
            <td class="p-2">{{task.acceptedDate}}</td>
            <td class="p-2">{{task.deadline}}</td>
            <td class="p-2">
              <div class="flex flex-col gap-2">
                <div class="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
                  <span
                      v-if="task.amount"
                      class="block h-full transition-all duration-500 ease-out"
                      :class="getTaskProgressColor(task)"
                      :style="{
                      width: getTaskProgressPercent(task) + '%'
                    }"
                  ></span>
                </div>
                <div class="text-sm mt-1 flex items-center justify-between text-gray-600">
                  <span>{{ getTaskProcessedCount(task) }} / {{ task.amount }}</span>
                  <span>{{ task.pageCount || 0 }}-Bet</span>
                </div>
              </div>
            </td>
            <td class="p-2"
            >
              <span
                  :class="[statusColor[task.status],
                  'rounded-xl px-3 py-1 font-semibold text-sm'
                  ]"
              >
                {{statusLabel[task.status]}}
              </span>
            </td>
            <td>
              <div
                  class="flex items-center gap-2"
              >
                <CButton
                    type="button"
                    :text="task.canWork ? 'Bajarish' : 'Kuting'"
                    variant="primary"
                    :disabled="!task.canWork"
                    @click="activeFormTask(task)"
                />
              </div>
            </td>
          </tr>
          </tbody>
          <tbody v-else>
          <tr>
            <td
                colspan="10"
                class="text-center py-6 text-gray-600 font-semibold"
            >
              Vazifalar topilmadi!
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/stores/store";
import CButton from "@/components/CButton.vue";
import {computed, onMounted, ref, watch} from "vue";
import {OrderStatus, UserTask} from "@/typeModules/useModules";
import axiosInstance from "@/axios";
import CDialog from "@/components/CDialog.vue";
import { useToast } from "vue-toastification";
import AppInput from "@/components/ui/AppInput.vue";
import AppSelect from "@/components/ui/AppSelect.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const dataStore = useStore();
const Toast = useToast();
// const allTasks = computed(() => dataStore.state.tasks.content)

const activeTaskForm = ref(false)
const selectedTask = ref<UserTask | null>(null);
const previewImage = ref<string | null>(null)
const formFilter = ref<string | ''>('');
const formStatus = ref<OrderStatus | null>(null);
const formData = ref<string | null | undefined>(null);
const endData = ref<string | null | undefined>(null);



const closeFilter = () => {
  formStatus.value = null;
  formFilter.value = '';
  formData.value = null;
  endData.value = null;

  dataStore.loadGetUserTasks();
}

const openPreview = (url: string) => {
  previewImage.value = url;
}

const closePreview = () => {
  previewImage.value = null;
}

const itemStatus = ref( [
  { value: 'PENDING', text: 'Kutilmoqda' },
  { value: 'IN_PROGRESS', text: 'Jarayonda' },
  { value: 'COMPLETED', text: 'Bajarilgan' },
])

const statusOrder: Record<string, string> = {
  ALBUM: "ALBOM",
  VIGNETTE: "VINETKA",
  PICTURE: "RASMLI ALBOM",
}

const statusColor: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  IN_PROGRESS: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
}

const statusLabel: Record<string, string> = {
  PENDING:     "Kutilmoqda",
  IN_PROGRESS: "Jarayonda",
  COMPLETED:   "Bajarilgan",
};

const getTaskProcessedCount = (task: any) => {
  return task?.processedCount || 0
}

const getTaskProgressPercent = (task: any) => {
  if (!task?.amount) return 0
  return (getTaskProcessedCount(task) / task.amount) * 100
}

const getTaskProgressColor = (task: any) => {
  const percent = getTaskProgressPercent(task)

  if (percent < 30) return 'bg-red-500'
  if (percent < 70) return 'bg-yellow-500'
  return 'bg-green-600'
}

const form = ref({
  orderId: "",
  orderName: "",
  itemType: "",
  stepOrder: null,
  canWork: true,
  amount: 0,
  processedCount: 0,
  notes: '',
});
console.log('Form',form.value)


const filteredOrders = computed(() => {

  let data = [...dataStore.state.tasks.content]

  if (formFilter.value) {
    const search = formFilter.value.toLowerCase()

    data = data.filter(item =>
        item.orderName?.toLowerCase().includes(search) ||
        item.categoryName?.toLowerCase().includes(search) ||
        item.customerName?.toLowerCase().includes(search) ||
        item.receiverName?.toLowerCase().includes(search) ||
        item.itemType?.toLowerCase().includes(search) ||
        item.kind?.toLowerCase().includes(search)
    )
  }
  return data.sort((a,b) =>
      new Date(b.acceptedDate).getTime() -
      new Date(a.acceptedDate).getTime()
  )
})

const activeFormTask = (task: UserTask) => {
  selectedTask.value = {...task };
  form.value.orderId = task.orderId || ''
  form.value.orderName = task.orderName || ''
  form.value.itemType = task.itemType || ''
  form.value.amount = task.amount || 0
  form.value.processedCount = task.processedCount || 0
  form.value.notes = task.notes || ''
  form.value.canWork = true
  activeTaskForm.value = true;

}

const completedTask = async () => {
  try {
    const res = await axiosInstance.put(`/api/v1/user-tasks/me/${selectedTask.value?.orderId}`,form.value
    )
    activeTaskForm.value = false;
    console.log('Bajarish', res.data)
    await dataStore.loadGetUserTasks()
    Toast.success('Bajarildi!')
  }
  catch (error) {
    console.log(error)
  }

}

watch(
    [formStatus, formFilter, formData, endData],
    async () => {
      await dataStore.loadGetUserTasks({
        statuses: formStatus.value ? [formStatus.value] : [],
        from: formData.value || undefined,
        deadlineTo: endData.value || undefined,
        search: formFilter.value ?? null
      })
    }
)

onMounted(async () => {
  await dataStore.loadGetUserTasks()
})
</script>

<style scoped>

</style>