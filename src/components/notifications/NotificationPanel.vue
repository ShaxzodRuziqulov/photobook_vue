<template>
  <div class="notify-panel" :class="{ mobile: !isDesktop }">
    <div class="notify-head">
      <div class="flex flex-col items-center w-full">
        <div class="flex items-center w-full justify-between">
          <div>
            <h3>Bildirishnomalar</h3>
            <p>{{ unreadCount }} ta o'qilmagan</p>
          </div>
          <div class="notify-actions-top">
            <button
                type="button"
                class="notify-sound-toggle"
                :class="{ active: soundEnabled }"
                :title="soundEnabled ? 'Ovozni o\'chirish' : 'Ovozni yoqish'"
                @click="$emit('toggle-sound')"
            >
              <i :class="soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark'"></i>
            </button>
            <button
                type="button"
                class="notify-read-all cursor-pointer transition-colors"
                :disabled="unreadCount === 0"
                @click="$emit('mark-all-read')"
            >
              Barchasini o'qildiga utkazish
            </button>
          </div>
        </div>
        <div class="flex items-center gap-2 w-full justify-around pt-4 text-sm font-bold text-pb-muted">
          <button
              type="button"
              class="cursor-pointer flex w-full hover:text-slate-700"
              @click="$emit('update:active-tab', 'UNREAD')"
          >
            <span
                class="border-b-2 p-1 flex w-full hover:bg-pb-app justify-center rounded-t-md transition-colors"
                :class="activeTab === 'UNREAD' ? 'text-pb-accent border-pb-accent' : 'border-transparent'"
            >
              Yangi xabar
            </span>
          </button>
          <button
              type="button"
              class="cursor-pointer flex w-full hover:text-slate-700"
              @click="$emit('update:active-tab', 'ALL')"
          >
            <span
                class="p-1 flex w-full hover:bg-pb-app border-b-2 justify-center rounded-t-md transition-colors"
                :class="activeTab === 'ALL' ? 'text-pb-accent border-pb-accent' : 'border-transparent'"
            >
              Barchasi
            </span>
          </button>
        </div>
        <div class="notify-filters">
          <input
              :value="search"
              type="search"
              class="notify-filter-input"
              placeholder="Qidirish..."
              @input="onSearchInput"
          >
          <select
              :value="type"
              class="notify-filter-select"
              @change="onTypeChange"
          >
            <option value="">Turi: hammasi</option>
            <option
                v-for="option in typeOptions"
                :key="option.value"
                :value="option.value"
            >
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div v-if="notifications.length" class="notify-list transition-all duration-200">
      <NotificationItem
          v-for="item in notifications"
          :key="item.id"
          :item="item"
          @click="$emit('notification-click', item)"
      />
      <div class="notify-actions">
        <button
            v-if="!paging.last"
            type="button"
            class="notify-load-more"
            :disabled="loading"
            @click="$emit('load-more')"
        >
          {{ loading ? "Yuklanmoqda..." : "Yana ko'rsatish" }}
        </button>
      </div>
    </div>

    <div v-else-if="error" class="notify-empty">
      <p>{{ error }}</p>
      <button type="button" class="notify-retry" @click="$emit('retry')">
        Qayta urinish
      </button>
    </div>

    <div v-else-if="loading" class="notify-empty">
      Yuklanmoqda...
    </div>

    <div v-else class="notify-empty">
      Hozircha bildirishnoma yo'q.
    </div>
  </div>
</template>

<script setup lang="ts">
import NotificationItem from "@/components/notifications/NotificationItem.vue";
import type { NotificationItem as NotificationItemType, NotificationType, PagingResponse } from "@/typeModules/useModules";

defineProps<{
  notifications: NotificationItemType[];
  paging: PagingResponse<NotificationItemType>;
  unreadCount: number;
  error: string;
  loading: boolean;
  soundEnabled: boolean;
  isDesktop: boolean;
  activeTab: "UNREAD" | "ALL";
  search: string;
  type: NotificationType | "";
  typeOptions: { value: NotificationType; text: string }[];
}>();

const emit = defineEmits<{
  "update:active-tab": [tab: "UNREAD" | "ALL"];
  "update:search": [value: string];
  "update:type": [value: NotificationType | ""];
  "mark-all-read": [];
  "retry": [];
  "toggle-sound": [];
  "notification-click": [item: NotificationItemType];
  "load-more": [];
}>();

const onSearchInput = (event: Event) => {
  emit("update:search", (event.target as HTMLInputElement).value);
};

const onTypeChange = (event: Event) => {
  emit("update:type", (event.target as HTMLSelectElement).value as NotificationType | "");
};
</script>

<style scoped>
.notify-panel {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: min(420px, 90vw);
  max-height: 70vh;
  overflow: hidden;
  border-radius: 18px;
  background: var(--color-pb-surface);
  color: var(--color-pb-header);
  box-shadow: 0 20px 60px color-mix(in srgb, var(--color-pb-header) 22%, transparent);
  border: 1px solid var(--color-pb-border);
  z-index: 20;
}

.notify-panel.mobile {
  position: fixed;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  width: 95vw;
  max-height: 80vh;
  border-radius: 16px;
}

.notify-head {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 16px 0 16px;
  border-bottom: 1px solid var(--color-pb-border);
}

.notify-head h3 {
  font-size: 16px;
  font-weight: 700;
}

.notify-head p {
  margin-top: 4px;
  font-size: 12px;
  color: var(--color-pb-muted);
}

.notify-read-all {
  color: var(--color-pb-accent);
  font-size: 12px;
  font-weight: 700;
}

.notify-read-all:hover:not(:disabled) {
  color: var(--color-pb-accent-hover);
}

.notify-read-all:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.notify-actions-top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.notify-sound-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: var(--color-pb-app);
  color: var(--color-pb-muted);
  border: 1px solid transparent;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.notify-sound-toggle:hover {
  border-color: var(--color-pb-border);
}

.notify-sound-toggle.active {
  background: color-mix(in srgb, var(--color-pb-accent-muted) 18%, var(--color-pb-surface));
  color: var(--color-pb-accent-hover);
}

.notify-filters {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  width: 100%;
  padding: 10px 0 12px;
}

.notify-filter-input,
.notify-filter-select {
  width: 100%;
  min-height: 36px;
  border: 1px solid var(--color-pb-border);
  border-radius: 8px;
  background: var(--color-pb-surface);
  color: var(--color-pb-header);
  font-size: 13px;
  outline: none;
}

.notify-filter-input:focus,
.notify-filter-select:focus {
  border-color: var(--color-pb-accent-muted);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-pb-accent) 18%, transparent);
}

.notify-filter-input {
  padding: 8px 10px;
}

.notify-filter-select {
  padding: 8px 9px;
}

@media (min-width: 640px) {
  .notify-filters {
    grid-template-columns: 1fr 170px;
  }
}

.notify-list {
  max-height: calc(65vh - 73px);
  overflow: auto;
}

.notify-empty {
  padding: 24px 16px;
  text-align: center;
  color: var(--color-pb-muted);
  font-size: 14px;
}

.notify-retry {
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-pb-accent) 10%, var(--color-pb-surface));
  color: var(--color-pb-accent-hover);
  font-weight: 700;
}

.notify-retry:hover {
  background: color-mix(in srgb, var(--color-pb-accent) 16%, var(--color-pb-surface));
}

.notify-actions {
  padding: 10px 16px 14px;
  background: var(--color-pb-surface);
}

.notify-load-more {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-pb-accent) 10%, var(--color-pb-surface));
  color: var(--color-pb-accent-hover);
  font-size: 13px;
  font-weight: 700;
}

.notify-load-more:hover:not(:disabled) {
  background: color-mix(in srgb, var(--color-pb-accent) 16%, var(--color-pb-surface));
}

.notify-load-more:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
