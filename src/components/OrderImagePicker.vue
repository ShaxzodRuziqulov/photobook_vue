<template>
  <div class="space-y-1.5">
    <div class="flex items-center justify-between gap-2">
      <div>
        <label class="text-xs mr-2 font-semibold text-pb-text">{{ label }}</label>
        <span v-if="!imageSrc" class="text-[11px] text-pb-muted">ixtiyoriy</span>
      </div>
    </div>
    <div class="flex items-center w-full gap-2 justify-around">
      <div
          v-if="imageSrc"
          class="relative w-full overflow-hidden rounded-lg border border-pb-border bg-pb-app/40"
      >
        <div class="flex max-h-[112px] p-1.5 items-center justify-center">
          <img
              :src="imageSrc"
              alt=""
              class="max-h-[50px] w-auto max-w-full rounded object-contain"
          />
        </div>
        <div
            v-if="busy"
            class="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-slate-900/45 text-white"
        >
          <span class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          <span class="text-[11px] font-medium">Yuklanmoqda</span>
        </div>
        <button
            v-if="!busy"
            type="button"
            class="absolute cursor-pointer right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full border border-pb-border bg-pb-surface text-pb-error shadow-sm transition hover:bg-pb-error-soft"
            title="Olib tashlash"
            aria-label="Rasmni olib tashlash"
            @click.stop="$emit('clear')"
        >
          <i class="fa-solid fa-xmark text-[11px]" aria-hidden="true" />
        </button>
      </div>

      <div
          v-if="!(busy && imageSrc)"
          class="relative w-full rounded-lg border border-dashed transition-colors"
          :class="[
        isDragging ? 'border-pb-accent bg-pb-accent/5' : 'border-pb-border bg-pb-elevated/70',
        busy && !imageSrc ? 'pointer-events-none opacity-70' : 'cursor-pointer hover:border-pb-accent-muted',
        imageSrc ? 'py-2' : 'py-3.5',
      ]"
        role="button"
        tabindex="0"
        @click="openFileDialog"
        @keydown.enter.prevent="openFileDialog"
        @keydown.space.prevent="openFileDialog"
        @dragenter.prevent="isDragging = true"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop"
    >
      <input
          ref="fileInputRef"
          type="file"
          class="sr-only"
          accept="image/jpeg,image/png,image/webp,image/gif,image/*"
          @change="onInputChange"
      />
      <div class="flex items-center justify-center gap-2 px-2 text-center">
        <template v-if="busy && !imageSrc">
          <span class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-pb-border border-t-pb-accent" />
          <span class="text-xs font-medium text-pb-text">Yuklanmoqda…</span>
        </template>
        <template v-else>
          <i class="fa-solid fa-cloud-arrow-up shrink-0 text-lg text-pb-accent-muted" aria-hidden="true" />
          <div class="min-w-0 flex-1 text-left">
            <p class="text-xs font-semibold text-pb-text leading-tight">
              {{ imageSrc ? "Almashtirish" : "Tanlash yoki tortish" }}
            </p>
            <p class="text-[11px] text-pb-muted leading-tight">JPG, PNG, WebP · {{ maxSizeLabel }}</p>
          </div>
          <span
              class="shrink-0 rounded border border-pb-border bg-pb-surface px-2 py-1 text-[11px] font-semibold text-pb-accent"
          >
            Fayl
          </span>
        </template>
      </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useToast } from "vue-toastification";

const props = withDefaults(
  defineProps<{
    imageSrc?: string;
    busy?: boolean;
    label?: string;
    maxBytes?: number;
  }>(),
  {
    imageSrc: "",
    busy: false,
    label: "Rasm",
    maxBytes: 15 * 1024 * 1024,
  }
);

const emit = defineEmits<{
  pick: [file: File];
  clear: [];
}>();

const Toast = useToast();
const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);

const maxSizeLabel = computed(() => {
  const mb = props.maxBytes / (1024 * 1024);
  return `≤${Math.round(mb)}MB`;
});

const openFileDialog = () => {
  if (props.busy) return;
  fileInputRef.value?.click();
};

const validateAndEmit = (file: File | undefined) => {
  if (!file || props.busy) return;
  if (!file.type.startsWith("image/")) {
    Toast.error("Faqat rasm faylini tanlang.");
    return;
  }
  if (file.size > props.maxBytes) {
    Toast.error(`Fayl ${maxSizeLabel.value} dan oshmasligi kerak.`);
    return;
  }
  emit("pick", file);
};

const onInputChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  validateAndEmit(file);
};

const onDrop = (e: DragEvent) => {
  isDragging.value = false;
  const file = e.dataTransfer?.files?.[0];
  validateAndEmit(file);
};
</script>
