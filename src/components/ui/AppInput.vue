<template>
  <div class="flex flex-col gap-1 relative" :class="type === 'date' ? 'cursor-pointer' : ''">
    <label :for="id" class="text-pb-label text-sm font-medium">{{ label }}</label>
    <div
        :class="[
          'w-full flex items-center gap-1 flex-1 outline-none rounded-lg px-3 py-2 bg-pb-surface transition-shadow transition-colors shadow-sm shadow-slate-900/[0.04]',
          showError
            ? 'border border-pb-error bg-pb-error-soft focus-within:ring-2 focus-within:ring-red-200/70 focus-within:border-pb-error'
            : 'border border-pb-border focus-within:border-pb-accent focus-within:ring-2 focus-within:ring-pb-accent/20',
        ]"
    >
      <textarea
          v-if="isTextarea"
          :id="id"
          v-model="model"
          class="w-full outline-none bg-transparent text-pb-text placeholder:text-slate-400"
          :placeholder="placeholder"
          :maxlength="maxlength"
      ></textarea>
      <input
          v-else
          :id="id"
          v-model="model"
          :type="type"
          :min="min"
          :step="step"
          :max="max"
          class="w-full outline-none bg-transparent text-pb-text placeholder:text-slate-400"
          :placeholder="placeholder"
          :maxlength="maxlength"
      />
      <i v-if="hasIcon">
        <img
            :src="iconSrc"
            alt="icon"
            :width="iconSize"
            :height="iconSize"
            class="cursor-pointer"
            @click="iconClick"
        />
      </i>
    </div>
    <span v-if="showError" class="text-pb-error text-xs absolute -bottom-5 left-0">
  {{ errorMessage }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose, watch } from 'vue';
// import {useI18n} from "vue-i18n";

const model = defineModel<string | null | number>();
// const { t } = useI18n();
interface IProps {
  id?: string;
  label: string;
  type?: string;
  hasIcon?: boolean;
  iconSrc?: string;
  required?: boolean;
  placeholder?: string;
  iconSize?: string;
  isTextarea?: boolean;
  min?: string;
  step?: string;
  max?: string;
  maxlength?: number | string;
  errorText?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  type: 'text',
  isTextarea: false,
});

const emit = defineEmits(['iconClick']);
const showError = ref(false);
const errorMessage = ref('');

const validate = () => {
  const trimmedValue = model.value ? String(model.value).trim() : '';
  model.value = trimmedValue;

  if (props.required && !trimmedValue) {
    errorMessage.value = props.errorText || "Maydonni to'ldiring";
    showError.value = true;
    return false;
  }

  errorMessage.value = '';
  showError.value = false;
  return true;
};

const iconClick = () => emit('iconClick');

defineExpose({validate});

watch(model, (newVal) => {
  if (props.required && newVal) {
    errorMessage.value = '';
    showError.value = false;
  }
});
</script>

