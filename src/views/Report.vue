<template>
  <div class="app-page flex w-full min-w-0 flex-col gap-5 px-4 py-6 sm:px-6 lg:mx-auto lg:max-w-7xl">
    <div class="flex w-full flex-col gap-3 rounded-xl border border-pb-border bg-pb-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
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
          <p class="text-xs font-bold uppercase tracking-wide text-pb-accent">Hisobot</p>
          <h1 class="text-md font-bold text-pb-text">Oylik ish hisoboti</h1>
        </div>
      </div>
      <AppInput
          type="month"
          label=""
          v-model="selectedMonth"
          class="w-44"
      />
    </div>

    <div class="animate-fade-in flex w-full flex-col gap-4 overflow-x-auto rounded-xl border border-pb-border bg-pb-surface p-4 shadow-sm sm:p-6">
      <div class="flex items-center justify-between border-b border-pb-border pb-3">
        <span class="text-sm font-semibold text-pb-text">
          {{ selectedMonth }} — Xodimlar soni: {{ report.length }}
        </span>
        <span class="text-sm font-semibold text-pb-muted">
          Umumiy: <span class="text-pb-accent">{{ totalDelta }}</span> dona
        </span>
      </div>

      <div v-if="isLoading" class="space-y-3">
        <div v-for="i in 6" :key="i" class="h-10 animate-pulse rounded-lg bg-pb-border"></div>
      </div>

      <table v-else class="w-full table-auto text-sm">
        <thead class="bg-pb-elevated border-b border-pb-border text-sm font-semibold tracking-wide text-pb-label">
        <tr>
          <th class="px-3 py-3 text-start">№</th>
          <th class="px-3 py-3 text-start">Xodim</th>
          <th class="px-3 py-3 text-center">Qayta ishlagan (dona)</th>
        </tr>
        </thead>
        <tbody v-if="sortedReport.length">
        <tr
            v-for="(row, idx) in sortedReport"
            :key="row.employeeId"
            class="group cursor-pointer border-b border-pb-border transition hover:bg-pb-elevated"
            @click="openHistory(row)"
        >
          <td class="px-3 py-5 text-pb-muted">{{ idx + 1 }}</td>
          <td class="px-3 py-3 font-medium text-pb-text group-hover:text-pb-accent duration-200 transition-colors">
            {{ getFullName(row.employeeFullName) || resolveEmployeeName(row.employeeId) }}
          </td>
          <td class="relative px-3 py-3 text-center">
            <span
                class="rounded-lg bg-pb-accent/10 px-3 py-1 font-bold tabular-nums text-gray-600 transition group-hover:bg-blue-200 group-hover:text-gray-600"
            >
              {{ row.totalDelta }}
            </span>
            <i
                class="fa-solid fa-pen-to-square
             absolute right-3 top-1/2 -translate-y-1/2
             opacity-0 group-hover:opacity-100
             transition-all duration-200 text-pb-accent"
            ></i>
          </td>
        </tr>
        </tbody>
        <tbody v-else>
        <tr>
          <td colspan="3">
            <div class="flex w-full items-center justify-center p-8 text-pb-muted">
              {{ selectedMonth }} uchun ma'lumot topilmadi
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <EmployeeWorkHistoryDialog
        :show="historyDialogShow"
        :employee-id="historyEmployeeId"
        :employee-name="historyEmployeeName"
        :month="selectedMonth"
        @close="historyDialogShow = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import axiosInstance from "@/axios";
import { useStore } from "@/stores/store";
import type { MonthlyWorkReport } from "@/typeModules/useModules";
import CButton from "@/components/CButton.vue";
import AppInput from "@/components/ui/AppInput.vue";
import EmployeeWorkHistoryDialog from "@/components/EmployeeWorkHistoryDialog.vue";

const router = useRouter();
const store = useStore();

const now = new Date();
const selectedMonth = ref(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
);

const isLoading = ref(false);
const report = ref<MonthlyWorkReport[]>([]);
const historyDialogShow = ref(false);
const historyEmployeeId = ref("");
const historyEmployeeName = ref("");

const getFullName = (name: string | undefined) => {
  if (!name) return ''

  const [firstName, lastName] = name.split(' ')

  return `${lastName} ${firstName}`
}

const openHistory = (row: MonthlyWorkReport) => {
  historyEmployeeId.value = row.employeeId;
  historyEmployeeName.value = getFullName(row.employeeFullName) || resolveEmployeeName(row.employeeId);
  historyDialogShow.value = true;
};

const totalDelta = computed(() => report.value.reduce((s, r) => s + r.totalDelta, 0));

const sortedReport = computed(() =>
    [...report.value].sort((a, b) => b.totalDelta - a.totalDelta)
);

const resolveEmployeeName = (employeeId: string): string => {
  const user = store.state.user.items.find(u => u.id === employeeId);
  if (!user) return employeeId.slice(0, 8) + "…";
  return `${user.lastName} ${user.firstName}`.trim() || user.username;
};

const loadReport = async () => {
  isLoading.value = true;
  report.value = [];
  try {
    const { data } = await axiosInstance.get<MonthlyWorkReport[]>("/api/v1/work-logs/monthly", {
      params: { month: selectedMonth.value },
    });
    report.value = data || [];
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

watch(selectedMonth, loadReport);

onMounted(async () => {
  if (!store.state.user.items.length) {
    await store.loadUsers();
  }
  await loadReport();
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
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
