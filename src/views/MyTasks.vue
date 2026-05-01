<template>
  <div class="app-page flex w-full min-w-0 flex-col px-4 py-6 sm:px-6 lg:mx-auto lg:max-w-7xl">
    <div class="animate-fade-in flex w-full flex-col gap-3 rounded-xl border border-pb-border bg-pb-surface px-4 py-3 shadow-sm">
      <CDialog
          :show="activeTaskForm"
          custom-class="w-full max-w-md"
          has-close-icon
          no-header
          @close="activeTaskForm = false"
          body-class="flex max-h-[min(88vh,640px)] flex-col overflow-hidden rounded-xl border border-pb-border !bg-pb-surface p-0 shadow-lg"
      >
        <div class="flex min-h-0 flex-1 flex-col">
          <div class="shrink-0 border-b border-pb-border px-4 pb-2 pt-11 sm:pt-4">
            <h2 class="text-base font-semibold text-pb-text">Vazifa bajarish</h2>
          </div>
          <div class="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
            <div class="rounded-lg border border-pb-border bg-pb-elevated p-3 flex flex-col gap-1.5">
              <span class="font-semibold text-pb-text leading-tight">
                {{ selectedTask?.orderName }}
              </span>
              <span class="text-sm text-pb-muted">{{ selectedTask?.itemType }}</span>
              <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-pb-muted md:grid-cols-4">
                <span>Jami: {{ selectedTask?.amount }}</span>
                <span>Bajarilgan: {{ selectedTask?.processedCount }}</span>
                <span>Hozir: {{ selectedTask?.remainingAvailable ?? 0 }}</span>
                <span>Qoldiq: {{ selectedTask?.remainingTotal ?? 0 }}</span>
              </div>
              <div
                  v-if="selectedTask?.orderNotes"
                  class="mt-1 rounded-md border border-pb-border bg-pb-surface px-2.5 py-1.5 text-xs text-pb-muted"
              >
                <span class="font-semibold text-pb-text">Izoh:</span>
                {{ selectedTask.orderNotes }}
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-semibold text-pb-text">Bajarish (dona)</label>
              <input
                  type="number"
                  min="0"
                  :max="selectedTask?.remainingAvailable ?? 0"
                  v-model="form.processedCount"
                  class="w-full rounded-lg border border-pb-border bg-pb-surface px-3 py-2 text-sm text-pb-text outline-none focus:border-pb-accent focus:ring-2 focus:ring-pb-accent/20"
              />
              <span class="text-[11px] text-pb-muted">
                Bir martada ko‘pi bilan {{ selectedTask?.remainingAvailable ?? 0 }} ta.
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-semibold text-pb-text">Ishchi izohi</label>
              <textarea
                  v-model="form.notes"
                  rows="3"
                  class="w-full resize-y rounded-lg border border-pb-border bg-pb-surface px-3 py-2 text-sm text-pb-text outline-none focus:border-pb-accent focus:ring-2 focus:ring-pb-accent/20"
                  placeholder="Bajarilgan ish haqida..."
              />
            </div>
          </div>
          <div
              class="flex shrink-0 flex-col gap-2 border-t border-pb-border bg-pb-elevated px-4 py-2.5 sm:flex-row sm:justify-end"
          >
            <CButton
                type="button"
                text="Bekor qilish"
                variant="ghost-accent"
                @click="activeTaskForm = false"
            />
            <CButton
                text="Saqlash"
                variant="primary"
                :disabled="isLoading || !taskSaveAllowed"
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
              :src="getAvatarUrl(previewImage)"
              class="max-h-[85vh] w-auto rounded-2xl shadow-2xl"
              @click.stop
          />
        </div>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <CButton
            type="button"
            text="Orqaga"
            size="sm"
            is-has-fa-icon
            variant="ghost-accent"
            fa-class="fa-solid fa-arrow-left"
            @click="router.back()"
        />
        <h2 class="text-base font-bold text-pb-text sm:text-lg">Barcha vazifalar</h2>
      </div>
      <div class="flex shrink-0 items-center gap-3 rounded-xl border border-pb-accent/20 bg-pb-accent/5 px-4 py-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-pb-accent/10 text-pb-accent">
          <i class="fa-solid fa-chart-simple text-sm"></i>
        </div>
        <div class="flex flex-col">
          <span class="text-[11px] font-semibold uppercase tracking-wide text-pb-muted">{{ currentMonthLabel }} — natijangiz</span>
          <span class="text-xl font-bold tabular-nums text-pb-accent">{{ myMonthlyStats }} <span class="text-sm font-medium text-pb-muted">dona</span></span>
        </div>
      </div>
      <div
          class="grid shrink-0 grid-cols-1 items-end gap-4 border-b border-pb-border py-3 text-sm sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
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
            size="sm"
            variant="ghost-accent"
            @click="closeFilter"
            class="mb-1"
        />
      </div>
      <div class="max-h-[min(70vh,calc(100dvh-17rem))] overflow-x-auto overflow-y-auto rounded-md border border-pb-border/60">
        <table class="w-full table-auto text-sm">
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
          <thead class="bg-pb-elevated text-sm font-semibold tracking-wide text-pb-label">
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
            <th class="p-3 text-end">Amallar</th>
          </tr>
          </thead>
          <tbody v-if="isLoading">
          <tr v-for="i in 8" :key="i" class="border-t border-pb-border">
            <td class="p-2"><div class="h-4 w-6 animate-pulse rounded bg-pb-border"></div></td>

            <td class="space-y-2 p-2">
              <div class="h-4 w-32 animate-pulse rounded bg-pb-border"></div>
              <div class="h-3 w-24 animate-pulse rounded bg-pb-border"></div>
            </td>

            <td class="p-2">
              <div class="h-10 w-14 animate-pulse rounded-lg bg-pb-border"></div>
            </td>

            <td class="p-2"><div class="h-4 w-20 animate-pulse rounded bg-pb-border"></div></td>
            <td class="p-2"><div class="h-4 w-24 animate-pulse rounded bg-pb-border"></div></td>
            <td class="p-2"><div class="h-4 w-24 animate-pulse rounded bg-pb-border"></div></td>

            <td class="p-2"><div class="h-4 w-20 animate-pulse rounded bg-pb-border"></div></td>
            <td class="p-2"><div class="h-4 w-20 animate-pulse rounded bg-pb-border"></div></td>

            <td class="p-2">
              <div class="h-2 w-full animate-pulse rounded-full bg-pb-border"></div>
              <div class="mt-2 h-3 w-16 animate-pulse rounded bg-pb-border"></div>
            </td>

            <td class="p-2">
              <div class="h-6 w-20 animate-pulse rounded-full bg-pb-border"></div>
            </td>

            <td class="p-2">
              <div class="h-8 w-24 animate-pulse rounded-lg bg-pb-border"></div>
            </td>
          </tr>
          </tbody>
          <tbody v-else-if="filteredOrders.length > 0">
          <tr
              class="border-t border-pb-border py-3 transition hover:bg-pb-elevated"
              v-for="(task, index) in filteredOrders"
              :key="index"
          >
            <td class="px-3 py-2">{{index + 1}}</td>
            <td class="p-2 break-all">
              <p class="font-semibold">{{ task.orderName }}</p>
              <p class="text-sm font-semibold text-pb-muted">{{task.categoryName}}</p>
              <p class="text-sm font-semibold text-pb-accent">{{task.itemType}}</p>
            </td>
            <td class="p-2">
              <img
                  @click="openPreview(task.imageUrl)"
                  v-if="task.imageUrl"
                  class="w-14 h-10 sm:h-10 lg:h-12 cursor-pointer rounded-xl"
                  :src="getAvatarUrl(task.imageUrl)" alt="">
            </td>
            <td class="p-2 text-sm font-semibold text-pb-accent">{{statusOrder[task.kind]}}</td>
            <td class="p-2">{{task.customerName}}</td>
            <td class="p-2">{{task.receiverName}}</td>
            <td class="p-2">{{task.acceptedDate}}</td>
            <td class="p-2">{{task.deadline}}</td>
            <td class="p-2">
              <div class="flex flex-col gap-2">
                <div class="h-2 w-full overflow-hidden rounded-full bg-pb-border">
                  <span
                      v-if="task.amount"
                      class="block h-full transition-all duration-500 ease-out"
                      :class="getTaskProgressColor(task)"
                      :style="{
                      width: getTaskProgressPercent(task) + '%'
                    }"
                  ></span>
                </div>
                <div class="mt-1 flex items-center justify-between text-sm text-pb-muted">
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
            <td class="p-3 text-end">
              <div class="flex flex-nowrap items-center justify-end gap-2.5">
                <CButton
                    type="button"
                    :text="(task.remainingAvailable ?? 0) > 0 ? 'Bajarish' : 'Kuting'"
                    size="sm"
                    variant="primary"
                    :disabled="(task.remainingAvailable ?? 0) <= 0"
                    @click="activeFormTask(task)"
                />
              </div>
            </td>
          </tr>
          </tbody>
          <tbody v-else>
          <tr>
            <td
                colspan="11"
                class="py-6 text-center font-semibold text-pb-muted"
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
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {OrderStatus, UserTask, WorkStatus} from "@/typeModules/useModules";
import axiosInstance from "@/axios";
import CDialog from "@/components/CDialog.vue";
import { useToast } from "vue-toastification";
import AppInput from "@/components/ui/AppInput.vue";
import AppSelect from "@/components/ui/AppSelect.vue";
import { useRoute, useRouter } from "vue-router";
import { snapshotTaskProgressDialog } from "@/utils/updateFormDirty";

const router = useRouter();
const route = useRoute();
const dataStore = useStore();
const Toast = useToast();

const activeTaskForm = ref(false)
const selectedTask = ref<UserTask | null>(null);
const previewImage = ref<string | null>(null)
const formFilter = ref<string | ''>('');
const formStatus = ref<OrderStatus | null>(null);
const formData = ref<string | null | undefined>(null);
const endData = ref<string | null | undefined>(null);
const isLoading = ref(false);

const myMonthlyStats = ref<number>(0);
const now = new Date();
const currentMonthParam = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
const uzMonths = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
const currentMonthLabel = `${uzMonths[now.getMonth()]} ${now.getFullYear()}`;

const loadMyMonthlyStats = async () => {
  try {
    const { data } = await axiosInstance.get<number>("/api/v1/work-logs/my-monthly", {
      params: { month: currentMonthParam },
    });
    myMonthlyStats.value = Number(data) || 0;
  } catch {
    myMonthlyStats.value = 0;
  }
};

const taskProgressBaseline = ref("");

const taskSaveAllowed = computed(() => {
  const cur = snapshotTaskProgressDialog(
    form.value.notes,
    form.value.processedCount,
  );
  if (cur === taskProgressBaseline.value) return false;
  const inc = Number(form.value.processedCount) || 0;
  const max = selectedTask.value?.remainingAvailable ?? 0;
  return inc > 0 && inc <= max;
});

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

const BASE_URL = import.meta.env.VITE_BASE_API

const getAvatarUrl = (url: string | undefined): string => {
  if (!url) return '';

  if (url.startsWith('http')) return url;

  return `${BASE_URL}${url}`;

};

const itemStatus = ref( [
  { value: 'PENDING', text: "Kutilmoqda" },
  { value: 'IN_PROGRESS', text: "Jarayonda" },
  { value: 'PAUSED', text: "To‘xtatilgan" },
  { value: 'COMPLETED', text: "Bajarilgan" },
])

const statusOrder: Record<string, string> = {
  ALBUM: "ALBOM",
  VIGNETTE: "VINETKA",
  PICTURE: "RASMLI ALBOM",
}

const statusColor: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  IN_PROGRESS: 'bg-green-100 text-green-700',
  PAUSED: 'bg-orange-100 text-orange-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
}

const statusLabel: Record<string, string> = {
  PENDING:     "Kutilmoqda",
  IN_PROGRESS: "Jarayonda",
  PAUSED:      "To'xtatilgan",
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
  workStatus: "STARTED" as WorkStatus,
});


const filteredOrders = computed(() => {

  let data = [...(dataStore.state.tasks.content || [])]

  return data.sort((a, b) =>
      new Date(b.acceptedDate || 0).getTime() -
      new Date(a.acceptedDate || 0).getTime()
  )
})

const activeFormTask = (task: UserTask) => {
  selectedTask.value = {...task };
  form.value.orderId = task.orderId || ''
  form.value.orderName = task.orderName || ''
  form.value.itemType = task.itemType || ''
  form.value.amount = task.amount || 0
  form.value.processedCount = 0
  form.value.notes = task.notes || ''
  form.value.canWork = true
  form.value.workStatus = task.remainingTotal === 0 ? "COMPLETED" : "STARTED"
  activeTaskForm.value = true;
  taskProgressBaseline.value = snapshotTaskProgressDialog(task.notes || "", 0);
}

const queryOrderId = () => {
  const raw = route.query.orderId;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  if (Array.isArray(raw) && typeof raw[0] === "string" && raw[0].trim()) return raw[0].trim();
  return "";
};

const openTaskFromRouteQuery = async () => {
  const oid = queryOrderId();
  if (!oid) return;
  const task = filteredOrders.value.find(t => String(t.orderId) === oid);
  if (!task) return;
  activeFormTask(task);
  await router.replace({ path: "/tasks" });
};

const completedTask = async () => {
  isLoading.value = true;
  try {
    const remainingAvailable = selectedTask.value?.remainingAvailable ?? 0;
    const remainingTotal = selectedTask.value?.remainingTotal ?? 0;
    const increment = Number(form.value.processedCount) || 0;

    if (increment <= 0) {
      Toast.warning("Bajarilgan sonni kiriting.");
      return;
    }

    if (increment > remainingAvailable) {
      Toast.warning(`Ko'pi bilan ${remainingAvailable} ta kiritish mumkin.`);
      return;
    }

    const taskId = selectedTask.value?.id || selectedTask.value?.orderId;
    await axiosInstance.put(`/api/v1/user-tasks/me/${taskId}`, {

      processedCount: increment,
    });
    activeTaskForm.value = false;
    await dataStore.loadGetUserTasks();

    await loadMyMonthlyStats()
    try {
      await dataStore.refreshUnreadNotificationsCount();
    } catch {
      //
    }
    Toast.success("Bajarildi!");
  } catch {
  } finally {
    isLoading.value = false;
  }
};

watch(
    [formStatus, formFilter, formData, endData],
    (_newVal, _oldVal, onCleanup) => {
      const timer = setTimeout(async () => {
        isLoading.value = true
        try {
          await dataStore.loadGetUserTasks({
            search: formFilter.value || '',
            statuses: formStatus.value ? [formStatus.value] : [],
            deadlineFrom: formData.value || undefined,
            deadlineTo: endData.value || undefined,
            page: 0,
            size: 100
          })
        }
        catch (error) {
          console.error("Filtrlashda xatolik:", error)
        }
        finally {
          isLoading.value = false
        }
      }, 500)

      onCleanup(() => clearTimeout(timer))
    }
)

watch(
    () => route.query.orderId,
    async () => {
      await nextTick();
      await openTaskFromRouteQuery();
    },
    { flush: "post" },
);

watch(
    () => dataStore.state.tasks.content,
    async () => {
      if (!queryOrderId()) return;
      await nextTick();
      await openTaskFromRouteQuery();
    },
    { flush: "post" },
);

onMounted(async () => {
  isLoading.value = true;
  try {
    await dataStore.loadGetUserTasks();
    await nextTick();
    await openTaskFromRouteQuery();
    await loadMyMonthlyStats();
  } catch {
  } finally {
    isLoading.value = false;
  }
});
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
