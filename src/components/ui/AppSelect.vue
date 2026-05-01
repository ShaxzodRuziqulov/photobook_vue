<template>
  <div class="w-full flex flex-col relative gap-1" :class="customClass">
    <label :for="id" class="text-pb-label text-sm font-medium mt-1">
      {{ label }}
    </label>
    <select
        v-if="!isMultiple"
        :id="id"
        v-model="model"
        :disabled="disabled"
        class="p-2 pr-8 border rounded-lg w-full transition-all duration-200 bg-pb-surface text-pb-text shadow-sm shadow-slate-900/[0.04] focus:outline-none focus:ring-2 focus:ring-pb-accent/25 focus:border-pb-accent disabled:opacity-60 disabled:bg-pb-elevated disabled:cursor-not-allowed border-pb-border"
        :class="[disabled ? 'cursor-not-allowed' : 'cursor-pointer', showError ? '!border-pb-error focus:ring-red-200/70' : '']"
    >
      <option v-if="disabledValue" value="" disabled class="text-pb-muted">{{ disabledValue }}</option>
      <option v-if="hasReset" :value="null" class="text-pb-text">{{ resetText }}</option>
      <option disabled v-if="normalizedOptions.length === 0">Ma'lumot yo'q</option>
      <option
          v-for="(option, index) in normalizedOptions"
          :key="index"
          :value="optionValue(option)"
          :disabled="option.disabled"
          class="text-pb-text disabled:bg-pb-elevated hover:bg-pb-app"
      >
        {{ optionText(option) }}
      </option>
    </select>
    <span v-if="required && !isMultiple" class="text-pb-error text-sm absolute -bottom-6 left-0">
      {{ errorMessage }}
    </span>

    <div v-if="isMultiple" class="relative select__container">
      <button
          v-if="model.length > 0"
          class="group w-6 h-6 border cursor-pointer border-pb-border bg-pb-surface flex items-center justify-center absolute top-2 right-2 rounded-full shrink-0 flex-center transition-colors hover:bg-pb-app hover:border-slate-300 active:scale-95 z-50"
          @click="clearAllItems"
      >
        <Icon
            class="text-slate-600 group-hover:text-pb-accent"
            icon-name="close"
        />
      </button>
      <div
          class="p-2 pr-8 border border-pb-border rounded-lg bg-pb-surface cursor-pointer min-h-[42px] flex flex-wrap gap-1 shadow-sm shadow-slate-900/[0.04]"
          :class="[disabled ? 'cursor-not-allowed' : 'cursor-pointer', showError ? '!border-pb-error' : '']"
          @click="toggleDropdown"
          ref="target"
      >
        <template v-if="model && model.length">
          <span
              v-for="(option, index) in selectedOptions"
              :key="index"
              class="bg-pb-accent/10 text-pb-accent px-2 py-1 cursor-default rounded-md flex items-center gap-1 text-sm border border-pb-accent/15"
          >
           <span class="flex flex-col">
            <span class="text-lg">  {{ optionText(option) }}</span>
            <small class="text-xs text-gray-700 dark:text-gray-300">{{ option.inventoryNumber }}</small>
           </span>
            <button type="button" @click.stop="removeOption(option)"
                    class="text-lg px-1 font-bold hover:text-pb-error cursor-pointer text-pb-accent">×</button>
          </span>
        </template>
        <span v-else class="text-pb-muted">{{ disabledValue }}</span>
      </div>

      <teleport to="body">
        <div
            v-if="isOpen"
            ref="dropdown"
            class="app-select-dropdown fixed z-[10050] min-w-[200px] overflow-auto rounded-lg border border-pb-border bg-pb-surface shadow-lg shadow-slate-900/10"
            :style="dropdownPanelStyle"
        >
          <span class="px-4 py-2 cursor-pointer hover:bg-pb-app flex justify-between items-center text-pb-muted"
                v-if="normalizedOptions.length === 0">Ma'lumot yo'q</span>
          <div
              v-for="(option, index) in normalizedOptions"
              :key="index"
              @click="toggleOption(option)"
              class="px-4 py-2 cursor-pointer hover:bg-pb-app flex justify-between items-center text-pb-text"
          >
            <span>{{ optionText(option) }}</span>
            <span v-if="isSelected(option)" class="text-pb-accent font-semibold">✔</span>
          </div>
        </div>
      </teleport>
      <span v-if="required && isMultiple" class="text-pb-error text-sm absolute -bottom-6 left-0">
        {{ errorMessage }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch, nextTick, onBeforeUnmount} from 'vue'
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
    errorMessage.value = props.errorText || "Tanlash majburiy"
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

const dropdownPanelStyle = ref<Record<string, string>>({})

const DROPDOWN_MAX_H = 280
const DROPDOWN_GUTTER = 8

const updateDropdownPosition = () => {
  const trigger = target.value
  if (!trigger) return
  const rect = trigger.getBoundingClientRect()
  const vh = window.innerHeight
  const spaceBelow = vh - rect.bottom - DROPDOWN_GUTTER
  const spaceAbove = rect.top - DROPDOWN_GUTTER
  const gap = 4

  const openBelow = spaceBelow >= 100 || spaceBelow >= spaceAbove
  let topPx: number
  let maxH: number

  if (openBelow) {
    maxH = Math.min(DROPDOWN_MAX_H, Math.max(80, spaceBelow - gap))
    topPx = rect.bottom + gap
  } else {
    maxH = Math.min(DROPDOWN_MAX_H, Math.max(80, spaceAbove - gap))
    topPx = rect.top - maxH - gap
  }

  topPx = Math.min(Math.max(DROPDOWN_GUTTER, topPx), vh - DROPDOWN_GUTTER - 40)

  const vw = window.innerWidth
  const isMobile = vw < 640
  let leftPx = rect.left
  let widthPx = rect.width

  if (isMobile) {
    const sidePad = 12
    widthPx = Math.min(rect.width, vw - sidePad * 2)
    leftPx = Math.max(sidePad, Math.min(leftPx, vw - widthPx - sidePad))
  }

  dropdownPanelStyle.value = {
    top: `${topPx}px`,
    left: `${leftPx}px`,
    width: `${widthPx}px`,
    maxHeight: `${maxH}px`,
  }
}

const onDocumentPointerDown = (event: MouseEvent) => {
  const node = event.target as Node | null
  if (!node) return
  if (target.value?.contains(node) || dropdown.value?.contains(node)) return
  closeDropdown()
}

const onScrollOrResize = () => {
  if (isOpen.value) updateDropdownPosition()
}

let outsideClickTimeout: ReturnType<typeof setTimeout> | null = null

const detachDropdownListeners = () => {
  if (outsideClickTimeout != null) {
    clearTimeout(outsideClickTimeout)
    outsideClickTimeout = null
  }
  document.removeEventListener('click', onDocumentPointerDown, true)
  document.removeEventListener('scroll', onScrollOrResize, true)
  window.removeEventListener('resize', onScrollOrResize)
}

const toggleDropdown = async () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    await nextTick()
    updateDropdownPosition()
    window.addEventListener('resize', onScrollOrResize)
    document.addEventListener('scroll', onScrollOrResize, true)
    outsideClickTimeout = setTimeout(() => {
      outsideClickTimeout = null
      if (!isOpen.value) return
      document.addEventListener('click', onDocumentPointerDown, true)
    }, 0)
  }
}

const closeDropdown = () => {
  isOpen.value = false
}

watch(isOpen, (open) => {
  if (!open) {
    detachDropdownListeners()
    dropdownPanelStyle.value = {}
  }
})

onBeforeUnmount(() => {
  detachDropdownListeners()
})

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

select:hover:not(:disabled) {
  background: #f1f5f9;
  transition: 0.2s ease-in-out;
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
  color: #2563eb;
  background-color: #eff6ff;
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

