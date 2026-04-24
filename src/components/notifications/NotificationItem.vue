<template>
  <div
      role="option"
      class="notify-item"
      :class="{ unread: !item.read, selected }"
      :aria-selected="selected"
      tabindex="0"
      @click="emitActivate"
      @keydown.enter.prevent="emitActivate"
      @keydown.space.prevent="emitActivate"
  >
    <div class="notify-content">
      <div class="notify-item-top">
        <strong>{{ item.title }}</strong>
        <span>{{ formattedTime }}</span>
      </div>
      <p class="notify-message">{{ item.message }}</p>
      <div class="notify-meta">
        <span>{{ item.orderName || "Buyurtma" }}</span>
        <span
            class="type-badge"
            :class="{ 'type-badge--admin': presentation.tone === 'admin' }"
        >{{ presentation.label }}</span>
      </div>
    </div>
    <span v-if="!item.read" class="unread-dot" aria-hidden="true"></span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getNotificationPresentation } from "@/constants/notificationTypes";
import type { NotificationItem } from "@/typeModules/useModules";

const props = defineProps<{
  item: NotificationItem;
  selected?: boolean;
}>();

const emit = defineEmits<{
  click: [item: NotificationItem];
}>();

const presentation = computed(() => getNotificationPresentation(props.item.type));

const formattedTime = computed(() => {
  if (!props.item.createdAt) return "";

  return new Intl.DateTimeFormat("uz-UZ", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(props.item.createdAt));
});

const emitActivate = () => {
  emit("click", props.item);
};
</script>

<style scoped>
.notify-item {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  width: 100%;
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid var(--color-pb-border);
  border-left: 3px solid transparent;
  background: var(--color-pb-surface);
  cursor: pointer;
  outline: none;
  transition:
    background-color 0.16s ease,
    border-color 0.16s ease,
    box-shadow 0.16s ease;
}

.notify-item:hover {
  background: var(--color-pb-app);
  border-left-color: color-mix(in srgb, var(--color-pb-accent) 35%, transparent);
}

.notify-item:focus-visible {
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--color-pb-accent) 45%, transparent);
}

.notify-item.selected {
  background: color-mix(in srgb, var(--color-pb-accent) 12%, var(--color-pb-surface));
  border-left-color: var(--color-pb-accent);
}

.notify-item.selected:hover {
  background: color-mix(in srgb, var(--color-pb-accent) 16%, var(--color-pb-app));
}

.notify-item.unread:not(.selected) {
  background: color-mix(in srgb, var(--color-pb-accent) 7%, var(--color-pb-surface));
}

.notify-content {
  min-width: 0;
  user-select: text;
  -webkit-user-select: text;
}

.notify-item-top {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
}

.notify-item-top strong {
  font-size: 14px;
  line-height: 1.35;
  color: var(--color-pb-header);
}

.notify-item-top span {
  flex-shrink: 0;
  font-size: 11px;
  color: var(--color-pb-muted);
  user-select: none;
  -webkit-user-select: none;
}

.notify-message {
  margin-top: 6px;
  color: var(--color-pb-sidebar);
  font-size: 13px;
  line-height: 1.45;
}

.notify-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
  font-size: 12px;
  color: var(--color-pb-accent-hover);
  font-weight: 700;
}

.notify-meta span {
  min-width: 0;
}

.type-badge {
  font-weight: 600;
  border-radius: 6px;
  padding: 2px 6px;
}

.type-badge--admin {
  color: var(--color-pb-muted);
  border: 1px solid color-mix(in srgb, var(--color-pb-muted) 45%, var(--color-pb-border));
  background: color-mix(in srgb, var(--color-pb-muted) 6%, var(--color-pb-surface));
}

.unread-dot {
  width: 8px;
  height: 8px;
  margin-top: 6px;
  border-radius: 999px;
  background: var(--color-pb-accent);
  flex-shrink: 0;
}
</style>
