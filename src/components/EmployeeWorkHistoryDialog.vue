<template>
  <CDialog
      :show="show"
      has-close-icon
      no-header
      custom-class="w-full max-w-2xl mt-12"
      @close="$emit('close')"
      body-class="flex max-h-[min(88vh,680px)] flex-col overflow-hidden rounded-xl border border-pb-border !bg-pb-surface p-0 shadow-lg"
  >
    <div class="flex min-h-0 flex-1 flex-col">
      <div class="shrink-0 border-b border-pb-border px-4 pb-3 pt-11 sm:pt-4">
        <h2 class="text-base font-semibold text-pb-text">{{ employeeName || "Xodim" }}</h2>
        <p class="mt-0.5 text-xs text-pb-muted">{{ formattedMonth }} — oylik ish hisoboti</p>
      </div>

      <div class="min-h-0 flex-1 overflow-auto">
        <div v-if="isLoading" class="flex items-center justify-center p-10">
          <i class="fa-solid fa-spinner animate-spin text-2xl text-pb-accent"></i>
        </div>

        <div
            v-else-if="!orders.length"
            class="flex flex-col items-center justify-center gap-2 py-12 text-sm text-pb-muted"
        >
          <i class="fa-regular fa-folder-open text-3xl opacity-50"></i>
          <span>Bu oy uchun orderlar topilmadi</span>
        </div>

        <table v-else class="w-full table-auto text-sm">
          <thead class="sticky top-0 bg-pb-elevated text-xs font-semibold uppercase tracking-wide text-pb-label">
          <tr>
            <th class="px-3 py-3 text-start">№</th>
            <th class="px-3 py-3 text-start">Buyurtma</th>
            <th class="px-3 py-3 text-center">Kategoriya</th>
            <th class="px-3 py-3 text-center">Sana</th>
            <th class="px-3 py-3 text-center">Miqdori</th>
            <th class="px-3 py-3 text-center">Holati</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(order, idx) in orders"
              :key="order.orderId"
              class="border-t border-pb-border transition hover:bg-pb-elevated"
          >
            <td class="px-3 py-2.5 text-pb-muted">{{ idx + 1 }}</td>
            <td class="px-3 py-2.5">
              <p class="font-medium text-pb-text leading-snug">{{ order.orderName }}</p>
              <span
                  v-if="order.category"
                  class="rounded font-semibold uppercase tracking-wide"
                  :class="order.category ? 'font-mono text-blue-600' : ''"
              >{{ order.category }}</span>
              <p v-if="order.itemType" class="text-xs text-pb-accent">{{ order.itemType }}</p>
            </td>
            <td class="px-3 py-2.5 text-center text-blue-600">
              {{order.kind}}
            </td>
            <td class="px-3 py-2.5 text-center text-pb-muted tabular-nums">
              {{ formatDate(order.lastLoggedAt) }}
            </td>
            <td class="px-3 py-2.5 text-center">
              <span class="font-bold tabular-nums text-pb-accent">{{ formatDelta(order.totalDelta) }}</span>
            </td>
            <td class="px-3 py-2.5 text-center">
              <span
                  class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  :class="resolveStatusBadge(order.status)"
              >
                {{ resolveStatusLabel(order.status) }}
              </span>
            </td>
          </tr>
          </tbody>
          <tfoot class="sticky bottom-0 border-t-2 border-pb-border bg-pb-elevated">
          <tr>
            <td colspan="4" class="px-3 py-2.5 text-sm font-semibold text-pb-text">
              Jami: <span class="text-gray-500">{{ orders.length }} ta buyurtma</span>
            </td>
            <td class="px-3 py-2.5 text-center font-bold text-pb-accent tabular-nums">
              {{ formatDelta(totalDelta) }}
            </td>
            <td></td>
          </tr>
          </tfoot>
        </table>
      </div>

      <div class="flex shrink-0 justify-end border-t border-pb-border bg-pb-elevated px-4 py-2.5">
        <CButton type="button" text="Yopish" variant="ghost-accent" @click="$emit('close')" />
      </div>
    </div>
  </CDialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import CDialog from "@/components/CDialog.vue";
import CButton from "@/components/CButton.vue";
import axiosInstance from "@/axios";
import type { EmployeeMonthlyOrderSummary } from "@/typeModules/useModules";

const props = defineProps<{
  show: boolean;
  employeeId: string;
  employeeName?: string;
  month: string;
}>();

defineEmits<{ close: [] }>();

const isLoading = ref(false);
const orders = ref<EmployeeMonthlyOrderSummary[]>([]);

const totalDelta = computed(() => orders.value.reduce((sum, order) => sum + order.totalDelta, 0));

const formattedMonth = computed(() => {
  if (!props.month) return "";
  const [year, month] = props.month.split("-");
  const uzMonths = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
  return `${uzMonths[Number(month) - 1]} ${year}`;
});

const formatDate = (dt: string): string => {
  if (!dt) return "";
  const d = new Date(dt);
  if (isNaN(d.getTime())) return dt;
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${p(d.getDate())}-${p(d.getMonth() + 1)}-${d.getFullYear()}`;
};

const formatDelta = (value: number): string => {
  if (value > 0) return `+${value}`;
  return String(value);
};

const resolveStatusLabel = (status: string): string => {
  switch (status) {
    case "COMPLETED":
      return "Bajarildi";
    case "PAUSED":
      return "To'xtatilgan";
    case "IN_PROGRESS":
      return "Jarayonda";
    case "PENDING":
      return "Kutilmoqda";
    default:
      return status;
  }
};

const resolveCategoryBadge = (category: string): string => {
  const key = category.toLowerCase();
  if (key.includes("albom") || key.includes("album")) return "bg-violet-100 text-violet-700";
  if (key.includes("vinetka")) return "bg-amber-100 text-amber-700";
  if (key.includes("maktab")) return "bg-sky-100 text-sky-700";
  if (key.includes("nikoh")) return "bg-pink-100 text-pink-700";
  return "bg-pb-elevated text-pb-label";
};

const resolveStatusBadge = (status: string): string => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-700";
    case "PAUSED":
      return "bg-amber-100 text-amber-700";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700";
    case "PENDING":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-pb-elevated text-pb-text";
  }
};

watch(
    () => [props.show, props.employeeId, props.month] as const,
    async ([show]) => {
      if (!show || !props.employeeId) return;
      isLoading.value = true;
      orders.value = [];
      try {
        const { data } = await axiosInstance.get<EmployeeMonthlyOrderSummary[]>(
            `/api/v1/work-logs/employee/${props.employeeId}/monthly-orders`,
            { params: { month: props.month } },
        );
        orders.value = (data || []).slice().sort(
            (a, b) => new Date(b.lastLoggedAt).getTime() - new Date(a.lastLoggedAt).getTime()
        );
      } catch (e) {
        console.error(e);
      } finally {
        isLoading.value = false;
      }
    },
);
</script>
