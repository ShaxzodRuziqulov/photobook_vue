<template>
  <CDialog
      :show="show"
      has-close-icon
      no-header
      custom-class="w-full max-w-2xl"
      @close="$emit('close')"
      body-class="flex max-h-[min(80vh,600px)] flex-col overflow-hidden rounded-xl border border-pb-border !bg-pb-surface p-0 shadow-lg"
  >
    <div class="flex min-h-0 flex-1 flex-col">
      <div class="shrink-0 border-b border-pb-border px-4 pb-2 pt-6 sm:pt-6">
        <h2 class="text-base font-semibold text-pb-text">Buyurtma faollik tarixi</h2>
        <p v-if="orderName" class="mt-0.5 text-sm text-pb-muted">{{ orderName }}</p>
      </div>
      <div class="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
        <div v-if="isLoading" class="flex items-center justify-center p-8">
          <i class="fa-solid fa-spinner animate-spin text-xl text-pb-accent"></i>
        </div>
        <div v-else-if="!timeline.length" class="flex items-center justify-center py-10 text-sm text-pb-muted">
          Faollik tarixi topilmadi
        </div>
        <div v-else class="relative space-y-4 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-pb-accent before:via-pb-border before:to-transparent">
          <div
              v-for="(item, idx) in timeline"
              :key="idx"
              class="relative flex items-center gap-4 pl-10"
          >
            <div class="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border border-pb-border bg-pb-surface shadow-sm">
              <i v-if="item.type === 'STATUS'" class="fa-solid fa-rotate text-pb-accent text-xs"></i>
              <i v-else class="fa-solid fa-hammer text-emerald-500 text-xs"></i>
            </div>
            <div class="flex-1 rounded-xl border border-pb-border bg-pb-elevated p-3 shadow-sm transition hover:border-pb-accent/20">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-xs font-bold uppercase tracking-wider text-pb-muted">
                  {{ item.type === 'STATUS' ? 'Status o\'zgarishi' : 'Ish bajarildi' }}
                </span>
                <span class="text-[11px] font-medium text-pb-muted tabular-nums">
                  {{ formatDateTime(item.timestamp) }}
                </span>
              </div>
              <div class="mt-1 text-sm">
                <template v-if="item.type === 'STATUS'">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-pb-text">{{ item.fromStatus }}</span>
                    <i class="fa-solid fa-arrow-right text-[10px] text-pb-muted"></i>
                    <span class="font-bold text-pb-accent">{{ item.toStatus }}</span>
                  </div>
                </template>
                <template v-else>
                  <div class="flex flex-col gap-0.5">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-pb-text">{{ resolveEmployeeName(item.employeeId) }}</span>
                      <span class="text-emerald-600 font-bold">+{{ item.delta }} dona</span>
                    </div>
                    <div class="text-xs text-pb-muted">
                      {{ item.stepOrder }}-qadam • Jami: {{ item.snapshot }}
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex shrink-0 justify-end border-t border-pb-border bg-pb-elevated px-4 py-2.5">
        <CButton type="button" text="Yopish" variant="ghost-accent" @click="$emit('close')" />
      </div>
    </div>
  </CDialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import CDialog from "@/components/CDialog.vue";
import CButton from "@/components/CButton.vue";
import axiosInstance from "@/axios";
import { useStore } from "@/stores/store";

interface StatusHistoryItem {
  fromStatus: string;
  toStatus: string;
  changedAt: string;
}

interface WorkLogItem {
  id: string;
  employeeId: string;
  delta: number;
  snapshot: number;
  stepOrder: number;
  loggedAt: string;
}

type TimelineItem =
    | { type: 'STATUS'; timestamp: string; fromStatus: string; toStatus: string }
    | { type: 'WORK'; timestamp: string; employeeId: string; delta: number; snapshot: number; stepOrder: number };

const props = defineProps<{
  show: boolean;
  orderId: string;
  orderName?: string;
}>();

defineEmits<{ close: [] }>();

const store = useStore();
const isLoading = ref(false);
const statusHistory = ref<StatusHistoryItem[]>([]);
const workLogs = ref<WorkLogItem[]>([]);

const timeline = computed<TimelineItem[]>(() => {
  const items: TimelineItem[] = [
    ...statusHistory.value.map(s => ({
      type: 'STATUS' as const,
      timestamp: s.changedAt,
      fromStatus: s.fromStatus,
      toStatus: s.toStatus
    })),
    ...workLogs.value.map(w => ({
      type: 'WORK' as const,
      timestamp: w.loggedAt,
      employeeId: w.employeeId,
      delta: w.delta,
      snapshot: w.snapshot,
      stepOrder: w.stepOrder
    }))
  ];

  return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
});

const resolveEmployeeName = (employeeId: string): string => {
  const user = store.state.user.items.find(u => u.id === employeeId);
  if (!user) return employeeId.slice(0, 8) + "...";
  return `${user.lastName} ${user.firstName}`.trim() || user.username;
};

const formatDateTime = (dt: string): string => {
  if (!dt) return "";
  const d = new Date(dt);
  if (isNaN(d.getTime())) return dt;
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${p(d.getDate())}-${p(d.getMonth() + 1)}-${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

watch(
    () => props.show,
    async (val) => {
      if (!val || !props.orderId) return;
      isLoading.value = true;
      statusHistory.value = [];
      workLogs.value = [];
      try {
        if (!store.state.user.items.length) {
          await store.loadUsers();
        }
        const [statusRes, workRes] = await Promise.all([
          axiosInstance.get<StatusHistoryItem[]>(`/api/v1/orders/${props.orderId}/status-history`),
          axiosInstance.get<WorkLogItem[]>(`/api/v1/work-logs/orders/${props.orderId}`)
        ]);
        statusHistory.value = statusRes.data || [];
        workLogs.value = workRes.data || [];
      } catch (e) {
        console.error(e);
      } finally {
        isLoading.value = false;
      }
    },
);
</script>
