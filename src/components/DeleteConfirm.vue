

<template>
  <p class="text-lg font-semibold my-4 text-pb-text">{{ title }}</p>
  <div class="flex pb-4 flex-nowrap justify-center gap-3">
    <CButton
        type="button"
        text="Ha, o'chirish"
        variant="danger"
        @click="handleConfirm"
    />
    <CButton
        type="button"
        text="Bekor qilish"
        variant="ghost-accent"
        @click="emit('update:show', false)"
    />
  </div>
</template>
<script setup lang="ts">
import CButton from "@/components/CButton.vue";

defineProps<{
  title: string
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'update:show', value: boolean): void
}>()

const handleConfirm = () => {
  emit('confirm')
  emit('update:show', false)
}
</script>

<style scoped>

</style>
