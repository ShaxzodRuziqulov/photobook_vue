<template>
  <div class="flex flex-col relative gap-1">
    <label
        v-if="label"
        class="text-sm font-medium text-pb-label"
    >
      {{ label }}
    </label>

    <VueDatePicker
        v-model="model"
        :time-config="{ enableTimePicker: false }"
        auto-apply
        :placeholder="placeholder"
        :min-date="minDate"
        :max-date="maxDate"
        teleport
        :formats="{input: 'dd.MM.yyyy'}"
        class="border-gray-300 rounded-sm"
        :class="isError ? 'border border-red-500' : ''"
    />
    <span
        class="absolute bottom-[-20px] left-0 flex items-center gap-2"
    >
      <span
          v-if="isError"
          class="text-red-500 text-sm mt-1"
      >
    {{ isError }}
    </span>
    </span>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import { VueDatePicker } from '@vuepic/vue-datepicker';
// import  {useI18n} from "vue-i18n";

// const  {t} = useI18n();

const props = defineProps<{
  modelValue: Date | string | null | undefined;
  label?: string
  placeholder?: string
  minDate?: Date | string
  maxDate?: Date | string
  isError?: string
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const model = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (value instanceof Date) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');

      emit('update:modelValue', `${year}-${month}-${day}`);
    } else {
      emit('update:modelValue', value);
    }

    emit('change');
  }
})
</script>