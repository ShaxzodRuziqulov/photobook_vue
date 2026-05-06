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
      <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 items-center justify-between gap-2 py-4">
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
        <div class="flex items-center sm:justify-start lg:justify-end w-full gap-4">
          <button
              type="button"
              class="flex cursor-pointer h-8 w-8 items-center justify-center rounded-lg border border-pb-border bg-pb-surface text-pb-muted transition hover:bg-pb-app hover:text-pb-text active:scale-95"
              @click="prevMonth"
          >
            <i class="fa-solid fa-chevron-left text-xs"></i>
          </button>
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-pb-text">{{ selectedMonthLabel }}</span>
            <span v-if="isCurrentMonth" class="rounded-full bg-pb-accent/10 px-2 py-0.5 text-[11px] font-semibold text-pb-accent">Hozir</span>
          </div>
          <button
              type="button"
              class="flex cursor-pointer h-8 w-8 items-center justify-center rounded-lg border border-pb-border bg-pb-surface text-pb-muted transition hover:bg-pb-app hover:text-pb-text active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              :disabled="isCurrentMonth"
              @click="nextMonth"
          >
            <i class="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div class="col-span-2 sm:col-span-1 flex items-center gap-3 rounded-xl border border-pb-accent/20 bg-pb-accent/5 px-3 py-3">
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pb-accent/10 text-pb-accent">
              <i class="fa-solid fa-chart-simple text-sm"></i>
            </div>
            <div class="min-w-0 flex-1">
              <span class="text-[11px] font-semibold uppercase tracking-wide text-pb-muted">Natija</span>
              <template v-if="statsLoading">
                <div class="mt-1 h-6 w-20 animate-pulse rounded bg-pb-accent/20"></div>
                <div class="mt-1 h-3 w-28 animate-pulse rounded bg-pb-accent/10"></div>
              </template>
              <template v-else>
                <p class="text-xl font-bold tabular-nums text-pb-accent leading-tight">
                  {{ myMonthlyStats }}<span class="text-sm font-medium text-pb-muted"> dona</span>
                </p>
                <p v-if="myLastMonthlyStats > 0 || myMonthlyStats > 0" class="text-[11px] mt-0.5" :class="monthGrowth >= 0 ? 'text-emerald-600' : 'text-red-500'">
                  <i :class="monthGrowth >= 0 ? 'fa-solid fa-arrow-trend-up' : 'fa-solid fa-arrow-trend-down'"></i>
                  {{ monthGrowth >= 0 ? '+' : '' }}{{ monthGrowth }}% oldingi oydan
                </p>
              </template>
            </div>
          </div>
          <div class="flex items-center gap-3 rounded-xl border px-3 py-3"
            :class="prevMonthUnfinishedCount > 0 ? 'border-orange-200 bg-orange-50' : 'border-pb-border bg-pb-surface'"
          >
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              :class="prevMonthUnfinishedCount > 0 ? 'bg-orange-100 text-orange-500' : 'bg-violet-50 text-violet-400'"
            >
              <i class="fa-solid fa-calendar-xmark text-sm"></i>
            </div>
            <div class="min-w-0 flex-1">
              <span class="text-[11px] font-semibold uppercase tracking-wide text-pb-muted">Oldingi oydan</span>
              <template v-if="prevMonthUnfinishedLoading || statsLoading">
                <div class="mt-1 h-6 w-16 animate-pulse rounded bg-pb-border"></div>
                <div class="mt-1 h-3 w-24 animate-pulse rounded bg-pb-border"></div>
              </template>
              <template v-else>
                <p class="text-xl font-bold tabular-nums leading-tight text-pb-text">
                  {{ myLastMonthlyStats }}<span class="text-sm font-medium text-pb-muted"> dona</span>
                </p>
                <p class="text-[11px] text-pb-muted mt-0.5">
                  {{ prevMonthUnfinishedCount > 0 ? `${prevMonthUnfinishedCount} ta tugallanmagan` : 'hammasi bajarilgan' }}
                </p>
              </template>
            </div>
          </div>
          <div class="flex items-center gap-3 rounded-xl border px-3 py-3"
            :class="overdueTasksCount > 0 ? 'border-red-200 bg-red-50' : 'border-pb-border bg-pb-surface'"
          >
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              :class="overdueTasksCount > 0 ? 'bg-red-100 text-red-500' : 'bg-amber-50 text-amber-500'">
              <i class="fa-solid fa-clock text-sm"></i>
            </div>
            <div class="min-w-0 flex-1">
              <span class="text-[11px] font-semibold uppercase tracking-wide text-pb-muted">Muddati o'tgan</span>
              <template v-if="isLoading">
                <div class="mt-1 h-6 w-12 animate-pulse rounded bg-pb-border"></div>
              </template>
              <template v-else>
                <p class="text-xl font-bold tabular-nums leading-tight" :class="overdueTasksCount > 0 ? 'text-red-600' : 'text-pb-text'">
                  {{ overdueTasksCount }}<span class="text-sm font-medium text-pb-muted"> ta</span>
                </p>
                <p v-if="dueTodayTasksCount > 0" class="text-[11px] text-amber-600 mt-0.5">
                  <i class="fa-solid fa-triangle-exclamation"></i> Bugun: {{ dueTodayTasksCount }} ta
                </p>
              </template>
            </div>
          </div>
          <div class="flex items-center gap-3 rounded-xl border border-pb-border bg-pb-surface px-3 py-3">
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <i class="fa-solid fa-list-check text-sm"></i>
            </div>
            <div class="min-w-0 flex-1">
              <span class="text-[11px] font-semibold uppercase tracking-wide text-pb-muted">Faol vazifalar</span>
              <template v-if="isLoading">
                <div class="mt-1 h-6 w-12 animate-pulse rounded bg-pb-border"></div>
              </template>
              <template v-else>
                <p class="text-xl font-bold tabular-nums text-pb-text leading-tight">
                  {{ activeTasksCount }}<span class="text-sm font-medium text-pb-muted"> ta</span>
                </p>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="border-b border-pb-border py-3">
        <p class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-pb-muted">
          Kategoriya bo'yicha bajarilgan
        </p>
        <div v-if="categoryStatsLoading" class="flex flex-wrap gap-2">
          <div v-for="i in 4" :key="i" class="min-w-[160px] rounded-xl border border-pb-border bg-pb-surface px-3 py-3 flex flex-col gap-3">
            <div class="flex items-start gap-2">
              <div class="h-7 w-7 shrink-0 animate-pulse rounded-lg bg-pb-border"></div>
              <div class="flex flex-col gap-1.5 flex-1">
                <div class="h-3 w-20 animate-pulse rounded bg-pb-border"></div>
                <div class="h-3 w-14 animate-pulse rounded bg-pb-border"></div>
              </div>
            </div>
            <div class="flex items-end justify-between gap-2">
              <div class="flex flex-col gap-1">
                <div class="h-5 w-24 animate-pulse rounded bg-pb-border"></div>
                <div class="h-3 w-16 animate-pulse rounded bg-pb-border"></div>
              </div>
              <div class="h-7 w-10 animate-pulse rounded bg-pb-border"></div>
            </div>
          </div>
        </div>
        <div v-else-if="categoryGroups.length === 0" class="text-sm text-pb-muted">
          Bajarilgan vazifalar mavjud emas
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          <div
            v-for="group in categoryGroups"
            :key="`${group.categoryId}-${group.kind}`"
            class="min-w-[160px] rounded-xl border border-pb-border bg-pb-surface px-3 py-3 flex flex-col gap-3"
          >
            <div class="flex items-start gap-2">
              <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500 mt-0.5">
                <i class="fa-solid fa-tag text-xs"></i>
              </div>
              <div class="flex flex-col">
                <span class="truncate text-[11px] font-bold uppercase tracking-wide text-pb-text">
                  {{ group.categoryName }}
                </span>
                <span class="text-[11px] font-semibold text-pb-muted">
                  {{ group.kind === 'ALBUM' ? 'Albom' : group.kind === 'VIGNETTE' ? 'Vinetka' : 'Rasmli albom' }}
                </span>
              </div>
            </div>
            <div class="flex items-end justify-between gap-2">
              <div>
                <p class="text-base font-bold tabular-nums text-pb-text leading-tight">
                  {{ group.totalOrderCount }}
                  <span class="text-sm font-medium text-pb-muted">ta buyurtma</span>
                </p>
                <p class="text-[12px] font-semibold text-pb-accent">{{ group.totalProcessed }} dona</p>
              </div>
              <div v-if="group.defaultPages" class="text-right shrink-0">
                <p class="text-xl font-bold tabular-nums text-pb-text leading-tight">{{ group.defaultPages }}</p>
                <p class="text-[11px] text-pb-muted">bet</p>
              </div>
            </div>
          </div>
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
            type="search"
            label="Qidirish"
            placeholder="Qidirish ..."
        />
        <AppInput
            v-model="formData"
            type="date"
            label="Muddat boshi"
        />
        <AppInput
            v-model="endData"
            type="date"
            label="Muddat tugashi"
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
            <col style="width: 8%">
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
                  loading="lazy"
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
                    :disabled=" !canUserWork(task)"
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
import {CategoryGroup, CategoryMonthlyStats, OrderStatus, UserTask, WorkStatus} from "@/typeModules/useModules";
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
const myLastMonthlyStats = ref<number>(0);
const statsLoading = ref(false);

const prevMonthUnfinishedCount = ref<number>(0);
const prevMonthUnfinishedLoading = ref(false);

const categoryStats = ref<CategoryMonthlyStats[]>([]);
const categoryStatsLoading = ref(false);

const categoryGroups = computed<CategoryGroup[]>(() => {
  const map = new Map<string, CategoryGroup>();
  for (const item of categoryStats.value) {
    const key = `${item.categoryId}-${item.kind}-${item.defaultPages ?? 0}`;
    if (!map.has(key)) {
      map.set(key, {
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        kind: item.kind,
        defaultPages: item.defaultPages ?? null,
        totalOrderCount: 0,
        totalProcessed: 0,
        months: [],
      });
    }
    const group = map.get(key)!;
    group.totalOrderCount += Number(item.orderCount);
    group.totalProcessed += Number(item.totalProcessed);
    group.months.push(item);
  }
  return Array.from(map.values()).sort((a, b) => b.totalProcessed - a.totalProcessed);
});

const now = new Date();
const uzMonths = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const todayStr = toDateKey(now);

const selectedYear = ref(now.getFullYear());
const selectedMonth = ref(now.getMonth());

const toParam = (year: number, month: number) =>
  `${year}-${String(month + 1).padStart(2, "0")}`;

const selectedMonthParam = computed(() => toParam(selectedYear.value, selectedMonth.value));
const selectedMonthLabel = computed(() => `${uzMonths[selectedMonth.value]} ${selectedYear.value}`);
const isCurrentMonth = computed(() =>
  selectedYear.value === now.getFullYear() && selectedMonth.value === now.getMonth()
);

const prevMonthParam = computed(() => {
  const d = new Date(selectedYear.value, selectedMonth.value - 1, 1);
  return toParam(d.getFullYear(), d.getMonth());
});

const monthGrowth = computed(() => {
  if (!myLastMonthlyStats.value) return myMonthlyStats.value > 0 ? 100 : 0;
  return Math.round(((myMonthlyStats.value - myLastMonthlyStats.value) / myLastMonthlyStats.value) * 100);
});

const allTasks = computed(() => dataStore.state.tasks.content || []);
const activeTasksCount = computed(() => allTasks.value.filter(t => t.status === 'IN_PROGRESS' || t.status === 'PENDING').length);
const overdueTasksCount = computed(() => allTasks.value.filter(t => t.deadline && t.deadline.slice(0, 10) < todayStr && t.status !== 'COMPLETED').length);
const dueTodayTasksCount = computed(() => allTasks.value.filter(t => t.deadline && t.deadline.slice(0, 10) === todayStr && t.status !== 'COMPLETED').length);

const prevMonth = () => {
  const d = new Date(selectedYear.value, selectedMonth.value - 1, 1);
  selectedYear.value = d.getFullYear();
  selectedMonth.value = d.getMonth();
};

const nextMonth = () => {
  if (isCurrentMonth.value) return;
  const d = new Date(selectedYear.value, selectedMonth.value + 1, 1);
  selectedYear.value = d.getFullYear();
  selectedMonth.value = d.getMonth();
};

const loadMyMonthlyStats = async () => {
  statsLoading.value = true;
  try {
    const [cur, prev] = await Promise.allSettled([
      axiosInstance.get<number>("/api/v1/work-logs/my-monthly", { params: { month: selectedMonthParam.value } }),
      axiosInstance.get<number>("/api/v1/work-logs/my-monthly", { params: { month: prevMonthParam.value } }),
    ]);
    if (cur.status === "fulfilled") myMonthlyStats.value = Number(cur.value.data) || 0;
    if (prev.status === "fulfilled") myLastMonthlyStats.value = Number(prev.value.data) || 0;
  } catch {
    myMonthlyStats.value = 0;
  } finally {
    statsLoading.value = false;
  }
};

const monthAcceptedDateFrom = computed(() => {
  const m = String(selectedMonth.value + 1).padStart(2, '0');
  return `${selectedYear.value}-${m}-01`;
});

const monthAcceptedDateTo = computed(() => {
  const lastDay = new Date(selectedYear.value, selectedMonth.value + 1, 0).getDate();
  const m = String(selectedMonth.value + 1).padStart(2, '0');
  return `${selectedYear.value}-${m}-${String(lastDay).padStart(2, '0')}`;
});

const prevMonthAcceptedDateFrom = computed(() => {
  const d = new Date(selectedYear.value, selectedMonth.value - 1, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
});

const prevMonthAcceptedDateTo = computed(() => {
  const d = new Date(selectedYear.value, selectedMonth.value, 0);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
});

const loadPrevMonthUnfinished = async () => {
  prevMonthUnfinishedLoading.value = true;
  try {
    const res = await axiosInstance.post<{ totalElements: number }>(
      '/api/v1/user-tasks/me/paging',
      {
        statuses: ['PENDING', 'IN_PROGRESS', 'PAUSED'],
        acceptedDateFrom: prevMonthAcceptedDateFrom.value,
        acceptedDateTo: prevMonthAcceptedDateTo.value,
      },
      { params: { page: 0, size: 1 } }
    );
    prevMonthUnfinishedCount.value = res.data.totalElements ?? 0;
  } catch {
    prevMonthUnfinishedCount.value = 0;
  } finally {
    prevMonthUnfinishedLoading.value = false;
  }
};

const currentFilters = () => ({
  search: formFilter.value || '',
  statuses: formStatus.value ? [formStatus.value] : [],
  acceptedDateFrom: monthAcceptedDateFrom.value,
  acceptedDateTo: monthAcceptedDateTo.value,
  deadlineFrom: formData.value || undefined,
  deadlineTo: endData.value || undefined,
});

let taskLoadVersion = 0;

const reloadTasksByMonth = async () => {
  const version = ++taskLoadVersion;
  isLoading.value = true;
  try {
    await dataStore.loadGetUserTasks(currentFilters());
  } finally {
    if (version === taskLoadVersion) isLoading.value = false;
  }
};

watch([selectedYear, selectedMonth], () => {
  void reloadTasksByMonth();
  void loadMyMonthlyStats();
  void loadCategoryStats();
  void loadPrevMonthUnfinished();
});

const loadCategoryStats = async () => {
  categoryStatsLoading.value = true;
  try {
    const res = await axiosInstance.get<CategoryMonthlyStats[]>('/api/v1/user-tasks/me/stats/by-category', {
      params: { month: selectedMonthParam.value },
    });
    categoryStats.value = res.data;
  } catch {
    categoryStats.value = [];
  } finally {
    categoryStatsLoading.value = false;
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

const closeFilter = async () => {
  formStatus.value = null;
  formFilter.value = '';
  formData.value = null;
  endData.value = null;
  isLoading.value = true;
  try {
    await dataStore.loadGetUserTasks({
      acceptedDateFrom: monthAcceptedDateFrom.value,
      acceptedDateTo: monthAcceptedDateTo.value,
    });
  } finally {
    isLoading.value = false;
  }
};

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

const canUserWork = (task: UserTask) => {
  return task.status === 'IN_PROGRESS' && (task.remainingAvailable ?? 0) > 0;
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
  form.value.processedCount = 0
  form.value.notes = ''
  form.value.workStatus = task.remainingTotal === 0 ? "COMPLETED" : "STARTED"
  activeTaskForm.value = true;
  taskProgressBaseline.value = snapshotTaskProgressDialog("", 0);
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
    if (!taskId) {
      Toast.error("Vazifa topilmadi");
      return;
    }
    const nextRemainingAvailable = remainingAvailable - increment;
    await axiosInstance.put(`/api/v1/user-tasks/me/${taskId}`, {
      processedCount: increment,
      notes: form.value.notes?.trim() || null,
      workStatus: nextRemainingAvailable <= 0 ? "COMPLETED" : "STARTED",
    });
    activeTaskForm.value = false;
    await Promise.all([
      dataStore.loadGetUserTasks(currentFilters()),
      loadMyMonthlyStats(),
      loadCategoryStats(),
      loadPrevMonthUnfinished(),
    ]);
    try {
      await dataStore.refreshUnreadNotificationsCount();
    } catch {
      //
    }
    Toast.success("Bajarildi!");
  } catch (e: any) {
    const msg =
      e?.response?.data?.errors?.request?.[0] ||
      e?.response?.data?.message ||
      "Xatolik yuz berdi";
    Toast.error(msg);
    await dataStore.loadGetUserTasks(currentFilters());
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
            acceptedDateFrom: monthAcceptedDateFrom.value,
            acceptedDateTo: monthAcceptedDateTo.value,
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
    await dataStore.loadGetUserTasks(currentFilters());
    await nextTick();
    await openTaskFromRouteQuery();
    void Promise.all([
      loadMyMonthlyStats(),
      loadCategoryStats(),
      loadPrevMonthUnfinished(),
    ]);
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
