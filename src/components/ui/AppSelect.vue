<template>
  <div class="w-full flex flex-col relative gap-1" :class="customClass">
    <label :for="id" class="text-gray-700 font-medium mt-1">
      {{ label }}
    </label>
    <select
        v-if="!isMultiple"
        :id="id"
        v-model="model"
        :disabled="disabled"
        class="p-2 pr-8 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-lg w-full transition-all duration-200 bg-white disabled:opacity-60 disabled:bg-gray-100"
        :class="[disabled ? 'cursor-not-allowed' : 'cursor-pointer', showError ? '!border-red-500 focus:ring-red-200' : '']"
    >
      <option v-if="disabledValue" value="" disabled class="text-gray-400">{{ disabledValue }}</option>
      <option v-if="hasReset" :value="null" class="text-gray-900">{{ resetText }}</option>
      <option disabled v-if="normalizedOptions.length === 0">Malumot yoq</option>
      <option
          v-for="(option, index) in normalizedOptions"
          :key="index"
          :value="optionValue(option)"
          :disabled="option.disabled"
          class="text-gray-900 disabled:bg-[#eee] hover:bg-gray-100"
      >
        {{ optionText(option) }}
      </option>
    </select>
    <span v-if="required && !isMultiple" class="text-red-600 text-sm absolute -bottom-6 left-0">
      {{ errorMessage }}
    </span>

    <div v-if="isMultiple" class="relative select__container" v-click-outside="closeDropdown">
      <button
          v-if="model.length > 0"
          class="w-6 h-6 border cursor-pointer border-field-stroke-secondary flex items-center justify-center absolute top-2 right-2 rounded-full shrink-0 flex-center transition-300 group active:scale-95 z-50"
          @click="clearAllItems"
      >
        <Icon
            class="text-black group-hover:text-icon-brand-secondary"
            icon-name="close"
        />
      </button>
      <div
          class="p-2 pr-8 border border-gray-300 rounded-lg bg-white cursor-pointer min-h-[42px] flex flex-wrap gap-1"
          :class="[disabled ? 'cursor-not-allowed' : 'cursor-pointer', showError ? '!border-red-500 focus:ring-red-200' : '']"
          @click="toggleDropdown"
          ref="target"
      >
        <template v-if="model && model.length">
          <span
              v-for="(option, index) in selectedOptions"
              :key="index"
              class="bg-blue-100 text-blue-800 px-2 py-1  cursor-default rounded flex items-center gap-1 text-sm"
          >
           <span class="flex flex-col">
            <span class="text-lg">  {{ optionText(option) }}</span>
            <small class="text-xs text-gray-700 dark:text-gray-300">{{ option.inventoryNumber }}</small>
           </span>
            <button type="button" @click.stop="removeOption(option)"
                    class="text-lg px-1   font-bold hover:text-red-800 cursor-pointer text-blue-800">×</button>
          </span>
        </template>
        <span v-else class="text-gray-400">{{ disabledValue }}</span>
      </div>

      <teleport defer to=".select__container">
        <div
            v-if="isOpen"
            ref="dropdown"
            class="z-50 bg-white absolute left-0 top-full w-full border border-gray-200 rounded-lg shadow max-h-130 overflow-auto"
        >
          <span class="px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                v-if="normalizedOptions.length === 0">Malumot yoq</span>
          <div
              v-for="(option, index) in normalizedOptions"
              :key="index"
              @click="toggleOption(option)"
              class="px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
          >
            <span>{{ optionText(option) }}</span>
            <span v-if="isSelected(option)" class="text-blue-600">✔</span>
          </div>
        </div>
      </teleport>
      <span v-if="required && isMultiple" class="text-red-600 text-sm absolute -bottom-6 left-0">
        {{ errorMessage }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch, nextTick, onMounted, onBeforeUnmount} from 'vue'
// import {useI18n} from "vue-i18n";
import Icon from "@/components/Icon.vue";

interface IProps {
  id?: string
  label?: string
  disabledValue?: string
  options: any[]
  modelValue?: any
  required?: boolean
  textField?: string
  valueField?: string
  hasReset?: boolean
  resetText?: string
  customClass?: string
  isMultiple?: boolean
  disabled?: boolean
  errorText?: string
}

const props = withDefaults(defineProps<IProps>(), {
  disabledValue: '',
  required: false,
  textField: 'text',
  valueField: 'value',
  isMultiple: false,
})

const emit = defineEmits(['update:modelValue', 'close'])

const showError = ref(false)
const errorMessage = ref('');
// const {t} = useI18n();

const model = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})

const clearAllItems = () => {
  model.value = []
}

const validate = () => {
  const isEmpty = props.required && (
      (!props.isMultiple && !model.value) ||
      (props.isMultiple && (!Array.isArray(model.value) || model.value.length === 0))
  )

  if (isEmpty) {
    errorMessage.value = props.errorText || t('components.selectErrorText')
    showError.value = true
    return false
  }

  errorMessage.value = ''
  showError.value = false
  return true
}
defineExpose({validate})

const optionText = (option: any) => {
  if (!option) return ''
  if (typeof option === 'string' || typeof option === 'number') return option
  return option[props.textField] ?? option.name ?? option.label ?? String(option)
}

const optionValue = (option: any) => {
  if (option === null) return null
  if (typeof option === 'string' || typeof option === 'number') return option
  return option[props.valueField] ?? option.id ?? option.value ?? option
}

const normalizedOptions = computed(() => {
  return props.options.map(option => ({
    ...option,
    _text: optionText(option),
    _value: optionValue(option),
  }))
})

const isOpen = ref(false)
const dropdown = ref<HTMLElement | null>(null)
const target = ref<HTMLElement | null>(null)

const toggleDropdown = async () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    await nextTick()
  }
}

const closeDropdown = () => {
  isOpen.value = false
}

const isSelected = (option: any) => {
  return Array.isArray(model.value) && model.value.includes(optionValue(option))
}

const toggleOption = (option: any) => {
  const value = optionValue(option)
  let newValue: any[] = Array.isArray(model.value) ? [...model.value] : []
  if (newValue.includes(value)) {
    newValue = newValue.filter(item => item !== value)
  } else {
    newValue.push(value)
  }
  emit('update:modelValue', newValue)
}

const removeOption = (option: any) => {
  const value = optionValue(option)
  const newValue = model.value.filter((item: any) => item !== value)
  emit('update:modelValue', newValue)
}

const selectedOptions = computed(() => {
  return normalizedOptions.value.filter(option => model.value.includes(optionValue(option)))
})

watch(() => props.isMultiple, () => {
  closeDropdown()
})
watch(model, (newVal) => {
  if (
      props.required &&
      ((!props.isMultiple && newVal) || (props.isMultiple && Array.isArray(newVal) && newVal.length > 0))
  ) {
    errorMessage.value = ''
    showError.value = false
  }
})
</script>

<style scoped lang="scss">

select {
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 0.375rem;
  flex: 1;
  transition: 0.4s;

  &, &::picker(select) {
    appearance: base-select;
  }
}

.dark select {
  background: #1f2937;
  border-color: #374151;
  color: #f3f4f6;
}

select:hover {
  background: rgba(221, 221, 221, 0.66);
  transition: 0.4s ease-in-out;
}

select::picker-icon {
  color: #999;
  transition: 0.4s rotate;
}

select:open::picker-icon {
  rotate: 180deg;
}

::picker(select) {
  border: none;
}

optgroup {
  box-shadow: 0px 4px 16px 0px #0000001F;
}

option {
  display: flex;
  justify-content: flex-start;
  border: 1px solid #ddd;
  padding: 8px;
  transition: 0.4s;
  background: #fff;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.08);

  &::checkmark {
    display: none;
  }
}

.dark option {
  background: #1f2937;
  border-color: #374151;
  color: #f3f4f6;
}

option:first-of-type {
  border-radius: 8px 8px 0 0;
}

option:disabled {
  cursor: not-allowed;
  background-color: #eee;
}

.dark option:disabled {
  background-color: #374151;
}

option:last-of-type {
  border-radius: 0 0 8px 8px;
}

option:not(option:last-of-type) {
  border-bottom: none;
}

option:hover {
  background: rgba(236, 233, 233, 0.48);
}

.dark option:hover {
  background: rgba(55, 65, 81, 0.8);
}

option:checked {
  color: #1E40AF;
  background-color: #EFF6FF;
  font-weight: 500;
}

.dark option:checked {
  color: #93C5FD;
  background-color: #1E3A8A;
}

selectedcontent .icon {
  display: none;
}

::picker(select):popover-open {
  opacity: 1;
}

@starting-style {
  ::picker(select):popover-open {
    opacity: 0;
  }
}
</style>

