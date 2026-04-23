<template>
  <div class="app-page flex w-full min-w-0 flex-col gap-5 px-4 py-6 text-pb-text sm:px-6 lg:mx-auto lg:max-w-7xl">
    <div class="flex flex-col items-center justify-between gap-4 rounded-xl border border-pb-border bg-pb-surface px-4 py-3 shadow-sm sm:flex-row">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pb-elevated text-pb-accent">
          <i class="fa-solid fa-book-open text-2xl" aria-hidden="true"></i>
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-wide text-pb-accent">Buyurtmalar</p>
          <h2 class="text-lg font-bold text-pb-text">Vinetka buyurtmalari</h2>
          <p class="text-sm font-medium text-pb-muted">{{ pageProcessed }} dona</p>
        </div>
      </div>
      <CButton
          type="button"
          text="+Yangi buyurtma"
          variant="primary"
          @click="visibleForm"
      />
    </div>
    <div
        v-if="categoryStatus.length > 0"
        class="grid grid-cols-1 animate-fade-in justify-between gap-3 rounded-xl border border-pb-border bg-pb-elevated/70 p-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
    >
      <div
          v-for="(cat, index) in categoryStatus"
          :key="index"
          class="flex flex-col justify-between gap-4 rounded-xl border border-pb-border bg-pb-surface px-4 py-2 shadow-sm"
      >
        <div class="flex w-full flex-col gap-1 border-b border-pb-border pb-1">
          <h2 class="text-sm font-semibold uppercase text-pb-text">{{ cat.name }}</h2>
          <span class="text-sm text-pb-muted">
            Betlar:
            <span v-if="cat.defaultPages" class="font-semibold text-pb-text">{{ cat.defaultPages }}</span>
          </span>
        </div>
        <div class="grid grid-cols-3 divide-x divide-pb-border">
          <div class="flex flex-col gap-1 px-1.5 text-center sm:px-3">
            <span class="text-xs font-medium text-pb-muted sm:text-sm">Jami</span>
            <div class="flex flex-wrap items-baseline justify-center gap-1">
              <span class="text-md font-bold tabular-nums text-pb-accent sm:text-lg">{{ cat.total }}</span>
              <span class="text-xs text-pb-muted sm:text-sm">dona</span>
            </div>
          </div>
          <div class="flex flex-col gap-1 px-1.5 text-center sm:px-3">
            <span class="text-xs font-medium text-pb-muted sm:text-sm">Bajarilgan</span>
            <div class="flex flex-wrap items-baseline justify-center gap-1">
              <span class="text-md font-bold tabular-nums text-pb-accent sm:text-lg">{{ cat.processed }}</span>
              <span class="text-xs text-pb-muted sm:text-sm">dona</span>
            </div>
          </div>
          <div class="flex flex-col gap-1 px-1.5 text-center sm:px-3">
            <span class="text-xs font-medium text-pb-muted sm:text-sm">Qoldi</span>
            <div class="flex flex-wrap items-baseline justify-center gap-1">
              <span class="text-md font-bold tabular-nums text-pb-accent sm:text-lg">{{ cat.remaining }}</span>
              <span class="text-xs text-pb-muted sm:text-sm">dona</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CDialog
        :show="showConfirmItem"
        custom-class="w-full max-w-sm"
        @close="showConfirmItem = false"
        body-class="!bg-pb-surface rounded-xl border border-pb-border p-5 text-center shadow-lg"
    >
      <DeleteConfirm
          v-model:show="showConfirmItem"
          @confirm="deleteConfirmItem"
          title="Ushbu buyurtmani o'chirmoqchimisiz?"
      />
    </CDialog>
    <CDialog
        has-close-icon
        no-header
        :show="isVisible"
        custom-class="w-full max-w-md"
        @close="closeForm"
        body-class="flex max-h-[min(88vh,640px)] flex-col overflow-hidden rounded-xl border border-pb-border !bg-pb-surface p-0 shadow-lg"
    >
      <form class="flex min-h-0 flex-1 flex-col" @submit.prevent="submitForm">
        <div class="shrink-0 border-b border-pb-border px-4 pb-2 pt-11 sm:pt-4">
          <h2 class="text-base font-semibold text-pb-text leading-snug">
            {{ isEditing ? "Tahrirlash" : "Yangi buyurtma" }}
          </h2>
        </div>
        <div class="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
          <OrderImagePicker
              :image-src="orderImageDisplaySrc"
              :busy="imageUploading"
              @pick="onImagePicked"
              @clear="onFileRemove"
          />
          <div class="flex flex-col w-full">
            <AppSelect
                v-model="itemForm.categoryId"
                :options="vignetteCategory"
                disabledValue="Tanlang"
                text-field="text"
                value-field="value"
                label="Vinetka turi"
                @change="clearError('categoryId')"
            />
            <p v-if="errors.categoryId" class="text-red-500 text-sm">
              {{errors.categoryId}}
            </p>
          </div>
          <div class="flex w-full gap-2 px-1 items-center justify-between">
            <div class="flex flex-col w-full">
              <AppInput
                  label="Betlar soni"
                  type="number"
                  step="2"
                  class="w-full"
                  placeholder="2,4,6"
                  v-model="itemForm.pageCount"
                  @input="clearError('pageCount')"
              />
              <p v-if="errors.pageCount" class="text-red-500 text-sm">
                {{errors.pageCount}}
              </p>
            </div>
            <div class="flex flex-col w-full">
              <AppInput
                  type="number"
                  class="w-full"
                  placeholder=""
                  label="Buyurtma soni"
                  v-model="itemForm.amount"
                  @input="clearError('amount')"
              />
              <p v-if="errors.amount" class="text-red-500 text-sm">
                {{errors.amount}}
              </p>
            </div>
          </div>
          <div
              class="flex gap-2 items-center justify-between"
          >
            <div class="flex flex-col w-full">
              <AppInput
                  type="text"
                  placeholder="Nomini kiriting"
                  label="Nomi"
                  class="w-full"
                  v-model="itemForm.orderName"
                  @input="clearError('orderName')"
              />
              <p v-if="errors.orderName" class="text-red-500 text-sm">
                {{errors.orderName}}
              </p>
            </div>
            <AppInput
                type="text"
                class="w-full"
                v-model="itemForm.customerName"
                placeholder="Ism kiriting"
                label="Mijoz ismi"
            />
          </div>
          <div class="flex flex-col w-full">
            <AppSelect
                :options="oderReceiver"
                v-model="itemForm.receiverName"
                disabledValue="Tanlang"
                text-field="text"
                value-field="value"
                label="Qabul qiluvchi"
                @change="clearError('receiverName')"
            />
            <p v-if="errors.receiverName" class="text-red-500 text-sm">
              {{errors.receiverName}}
            </p>
          </div>
          <div class="flex flex-col w-full">
            <AppSelect
                :model-value="itemForm.employees"
                @update:modelValue="(val) => {
                  handleEmployeeChange(val)
                  clearError('employees')
                }"
                :options="orderedUsers"
                disabledValue="Xodimni tanlang"
                text-field="firstName"
                value-field="id"
                isMultiple
                label="Mas'ul xodim"
            />
            <p v-if="errors.employees" class="text-red-500 text-sm">
              {{errors.employees}}
            </p>
          </div>
          <AppSelect
              v-model="itemForm.status"
              :options="itemStatus"
              disabledValue="Xolatni tanlang"
              label="Status"
              text-field="text"
              value-field="value"
          />
          <div
              class="flex items-center w-full gap-2"
          >
            <div class="flex flex-col w-full">
              <AppInput
                  v-model="itemForm.acceptedDate"
                  label="Qabul qilingan sana"
                  type="date"
                  class="w-full"
                  @input="clearError('acceptedDate')"
              />
              <p v-if="errors.acceptedDate" class="text-red-500 text-sm">
                {{errors.acceptedDate}}
              </p>
            </div>
            <div class="flex flex-col w-full">
              <AppInput
                  label="Tugash sanasi"
                  type="date"
                  class="w-full"
                  v-model="itemForm.deadline"
                  @input="clearError('deadline')"
              />
              <p v-if="errors.deadline" class="text-red-500 text-sm">
                {{errors.deadline}}
              </p>
            </div>
          </div>
        </div>
        <div
            class="flex shrink-0 flex-col gap-2 border-t border-pb-border bg-pb-elevated px-4 py-2.5 sm:flex-row sm:justify-end"
        >
          <CButton
              type="button"
              text="Bekor qilish"
              variant="ghost-accent"
              :disabled="isSubmitting || imageUploading"
              @click="closeForm"
          />
          <CButton
              type="submit"
              :text="isEditing ? 'Yangilash' : 'Saqlash'"
              variant="primary"
              :loading="isSubmitting"
              :disabled="imageUploading || orderSaveDisabled"
          />
        </div>
      </form>
    </CDialog>
    <div
        v-if="previewImage"
        class="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        @click="closePreview"
    >
      <div class="relative max-w-5xl w-full flex justify-center">

        <button
            @click.stop="closePreview"
            class="absolute cursor-pointer top-[-50px] right-2 sm:right-4 md:top-4 md:right-4 lg:right-10 border-2 border-red-200
            bg-red-100 hover:bg-red-300  text-red-600 rounded-full w-10 h-10 flex items-center justify-center transition "
        >
          <i class="fa-solid fa-close text-lg"></i>
        </button>
        <img
            alt=""
            :src="getAvatarUrl(previewImage)"
            class="max-h-[85vh] w-auto rounded-2xl shadow-2xl"
            @click.stop
        />
      </div>
    </div>
    <div class="animate-fade-in flex w-full min-w-0 flex-col gap-3 rounded-xl border border-pb-border bg-pb-surface px-4 py-3 shadow-sm">
      <div class="flex w-full min-w-0 shrink-0 flex-col border-b border-pb-border pb-3">
        <div class="flex items-center gap-2 py-1">
          <CButton
              text="Orqaga"
              type="button"
              size="sm"
              is-has-fa-icon
              variant="ghost-accent"
              fa-class="fa-solid fa-arrow-left"
              @click="router.back()"
          />
          <h2 class="text-base font-bold text-pb-text sm:text-lg">Buyurtmalar jadvali</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-2 items-end gap-2 py-2">
          <AppInput
              v-model="formFilter"
              type="search"
              label="Qidirish"
              placeholder="Qidirish..."
          />
          <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-end justify-around w-full gap-2">
            <AppSelect
                v-model="formStatus"
                :options="itemStatus"
                disabledValue="Tanlang"
                label="Holat"
                has-reset
                resetText="Hammasi"
            />
            <AppInput
                v-model="formData"
                type="date"
                label="Qabul sanasi"
            />
            <AppInput
                v-model="endData"
                type="date"
                label="Tugash sanasi"
            />
            <CButton
                type="button"
                text="Tozalash"
                size="sm"
                variant="ghost-accent"
                @click="closeFilter"
                class="mb-1"
            />
          </div>
        </div>
      </div>
      <div class="max-h-[min(70vh,calc(100dvh-17rem))] overflow-x-auto overflow-y-auto rounded-md border border-pb-border/60">
      <table
          class="w-full rounded">
        <colgroup>
          <col style="width: 2%">
          <col style="width: 13%">
          <col style="width: 12%">
          <col style="width: 12%">
          <col style="width: 12%">
          <col style="width: 12%">
          <col style="width: 10%">
          <col style="width: 9%">
          <col style="width: 9%">
          <col style="width: 8%">
          <col style="width: 8%">
        </colgroup>
        <thead class="bg-pb-elevated text-sm font-semibold tracking-wide text-pb-label">
        <tr>
          <th class="p-1 text-start">№</th>
          <th class="p-2 text-start">Buyurtma nomi</th>
          <th class="p-2 text-center">Rasm</th>
          <th class="p-2 text-start">Mijoz</th>
          <th class="p-2 text-start">Qabul qilgan</th>
          <th class="p-2 text-start">Mas'ul</th>
          <th class="p-2 px-3 text-start">Jarayon</th>
          <th class="py-3 px-4 text-start">Sana</th>
          <th class="p-2 text-start">Muddat</th>
          <th class="p-2 text-start">Holat</th>
          <th class="p-2 text-end">Amallar</th>
        </tr>
        </thead>
        <tbody v-if="isLoading">
        <tr v-for="i in 8" :key="i" class="border-t border-pb-border">
          <td class="p-2"><div class="h-4 w-6 animate-pulse rounded bg-pb-border"></div></td>

          <td class="space-y-2 p-2">
            <div class="h-4 w-32 animate-pulse rounded bg-pb-border"></div>
            <div class="h-3 w-24 animate-pulse rounded bg-pb-border"></div>
          </td>

          <td class="p-2">
            <div class="h-10 w-14 animate-pulse rounded-lg bg-pb-border"></div>
          </td>

          <td class="p-2"><div class="h-4 w-20 animate-pulse rounded bg-pb-border"></div></td>
          <td class="p-2"><div class="h-4 w-24 animate-pulse rounded bg-pb-border"></div></td>
          <td class="p-2"><div class="h-4 w-24 animate-pulse rounded bg-pb-border"></div></td>

          <td class="p-2">
            <div class="h-2 w-full animate-pulse rounded-full bg-pb-border"></div>
            <div class="mt-2 h-3 w-16 animate-pulse rounded bg-pb-border"></div>
          </td>
          <td class="p-2"><div class="h-4 w-20 animate-pulse rounded bg-pb-border"></div></td>
          <td class="p-2"><div class="h-4 w-20 animate-pulse rounded bg-pb-border"></div></td>


          <td class="p-2">
            <div class="h-6 w-20 animate-pulse rounded-full bg-pb-border"></div>
          </td>

          <td class="p-2">
            <div class="h-8 w-24 animate-pulse rounded-lg bg-pb-border"></div>
          </td>
        </tr>
        </tbody>
        <tbody v-else-if="filteredOrders.length > 0">
        <tr
            class="border-t border-pb-border text-sm text-gray-600 transition hover:bg-pb-elevated hover:bg-gray-100"
            v-for="(order, index) in filteredOrders" :key="index"
        >
          <td class="p-1">{{ rowNumber(index) }}</td>
          <td class="p-2 break-all">
            <p class="break-all font-semibold">{{ order.orderName }}</p>
            <p class="text-sm font-semibold text-pb-muted">{{order.categoryName}}</p>
          </td>
          <td class="p-3 items-center justify-center flex">
            <img
                v-if="order.imageUrl"
                @click="openPreview(order.imageUrl)"
                class="w-14 h-10 sm:h-10 lg:h-12 cursor-pointer rounded-xl"
                :src="getAvatarUrl(order.imageUrl)" alt=""
            />
          </td>
          <td class="p-2 ">{{ order.customerName }}</td>
          <td class="p-2 ">{{ order.receiverName }}</td>
          <td class="px-1 ">
            <div
                v-if="order.employees"
                v-for="(emp, index) in getOrderedEmployees(order)"
                :key="index"
                class="border-b border-pb-border py-1"
            >
              <div class="flex text-sm items-center justify-between gap-1">
                <i
                    v-if="(emp.processedCount ?? 0) === order.amount"
                    class="fa-solid fa-circle-check text-green-600"
                />
                <i
                    v-else-if="(emp.processedCount ?? 0) > 0"
                    class="fa-solid fa-play text-pb-accent"
                />
                <i
                    v-else
                    class="fa-regular fa-circle text-pb-muted"
                />
                <span class="flex p-1">{{ getFullName(emp.employeeName) }}</span>
                <div class="flex items-center justify-between text-sm">
                  <span>{{emp.processedCount}} ta</span>
                </div>
              </div>
              <div v-if="emp.notes" class="break-words pl-5 text-xs text-pb-muted">
                Izoh: {{ emp.notes }}
              </div>
            </div>
          </td>
          <td class="py-2 px-3">
            <div class="h-2 w-full overflow-hidden rounded-full bg-pb-border">
                <span
                    v-if="getProcessedCount(order) || order.amount"
                    class="block h-full transition-all duration-500 ease-out"
                    :class="getProgressColor(order)"
                    :style="{
                    width: getProgressPercent(order) + '%'
                  }"
                ></span>
            </div>
            <div class="mt-1 flex items-center justify-between w-full text-sm text-pb-muted">
              <span>{{ getProcessedCount(order) || 0 }} / {{ order.amount }}</span>
              <span>{{order.pageCount || 0}}-Bet</span>
            </div>
          </td>
          <td class="p-2">{{ formatDate(order.acceptedDate) }}</td>
          <td class="p-2">{{ formatDate(order.deadline) }}</td>
          <td class="p-2"
          >
            <span
                :class="[statusColor[order.status],
                  'rounded-xl px-3 py-1 font-semibold text-sm',
                ]">
              {{ statusLabel[order.status] }}
            </span>
          </td>
          <td class="p-2 text-end">
            <div class="flex flex-nowrap items-center justify-end gap-2.5">
              <CButton
                  type="button"
                  text="Tahrirlash"
                  size="sm"
                  variant="outline-edit"
                  @click="editForm(order)"
              />
              <CButton
                  type="button"
                  text="O'chirish"
                  size="sm"
                  variant="danger"
                  @click="deleteItem(order.id)"
              />
            </div>
          </td>
        </tr>
        </tbody>
        <tbody v-else>
        <tr>
          <td
              colspan="11"
              class="py-6 text-center font-semibold text-pb-muted"
          >
            Buyurtma topilmadi!
          </td>
        </tr>
        </tbody>
      </table>
      </div>
      <div
          v-if="totalPages > 1"
          class="sticky bottom-0 z-10 mt-4 flex h-20 shrink-0 items-center justify-center gap-2 border-t border-pb-border bg-pb-surface pb-2"
      >
        <div class="mr-4 rounded-lg border border-pb-border bg-pb-elevated px-3 py-2 text-sm text-pb-text">
          {{paginationInfo.from}} - {{paginationInfo.to}} dan {{paginationInfo.total}}
        </div>
        <button
            type="button"
            @click="changePage(page - 1)"
            :disabled="page === 1"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-pb-header text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <i class="fa-solid fa-chevron-left text-sm"></i>
        </button>
        <div
            v-for="(pageItem, idx) in allPagesNumbers"
            :key="idx"
            class="flex h-11 w-11 select-none items-center justify-center rounded-3xl px-3 py-1"
            :class="{
              'bg-pb-accent font-bold text-white': pageItem === page,
              'cursor-pointer hover:bg-pb-elevated': pageItem !== '...' && pageItem !== page,
              'cursor-default text-lg text-pb-muted': pageItem === '...',
            }"
            @click="pageItem !== '...' && changePage(pageItem)"
        >
          {{ pageItem }}
        </div>
        <button
            type="button"
            @click="changePage(page + 1)"
            :disabled="page >= totalPages"
            class="flex h-10 w-10 items-center justify-center rounded-full transition"
            :class="page >= totalPages
              ? 'cursor-not-allowed bg-pb-border text-pb-muted'
              : 'cursor-pointer bg-pb-header text-white hover:bg-slate-800'"
        >
          <i class="fa-solid fa-chevron-right text-sm"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CButton from "@/components/CButton.vue";
import {computed, ComputedRef, nextTick, onMounted, ref, watch} from "vue";
import CDialog from "@/components/CDialog.vue";
import AppInput from "@/components/ui/AppInput.vue";
import AppSelect from "@/components/ui/AppSelect.vue";
import {useStore} from "@/stores/store";
import {Order, OrderCreateDto} from "@/typeModules/useModules";
import { useToast } from "vue-toastification";
import DeleteConfirm from "@/components/DeleteConfirm.vue";
import OrderImagePicker from "@/components/OrderImagePicker.vue";
import { useRoute, useRouter } from "vue-router";
import {
  snapshotOrderForm,
  type OrderFormSnapshotFields,
} from "@/utils/updateFormDirty";

const router = useRouter();
const route = useRoute();
const Toast = useToast();
const dataStore = useStore();

const allUsers: ComputedRef = computed(() => dataStore.state.user.items);
const vignetteCategory: ComputedRef = computed(() => dataStore.state.vignetteCategory)

const orderedUsers = computed(() => {
  const selected = itemForm.value.employees

  return [...allUsers.value].sort((a, b) => {
    const aIndex = selected.indexOf(a.id)
    const bIndex = selected.indexOf(b.id)

    if (aIndex === -1 && bIndex === -1) return 0
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1

    return aIndex - bIndex
  })
})

const isEditing = ref(false);
const orderEditBaseline = ref("");
const isVisible = ref(false);
const selectedItem = ref<string | null>(null);
const showConfirmItem = ref(false);
const formStatus = ref<string | null>(null);
const formData = ref<string | null>(null);
const endData = ref<string | null>(null);
const formFilter = ref<string | ''>('');
const previewImage = ref<string | null>(null)
const isLoading = ref(false);
const errors = ref<Record<string, string>>({})

const openPreview = (url: string) => {
  previewImage.value = url;
}

const closePreview = () => {
  previewImage.value = null;
}

const BASE_URL = import.meta.env.VITE_BASE_API

const getAvatarUrl = (url: string | undefined): string => {
  if (!url) return '';

  if (url.startsWith('http')) return url;

  return `${BASE_URL}${url}`;

};

const selectedFiles = ref<File[]>([])
const previewUrl = ref<string | null>(null)
const removedOldImage = ref(false)
const imageUploading = ref(false)
const isSubmitting = ref(false)

const orderImageDisplaySrc = computed(() => {
  const u = itemForm.value.imageUrl
  if (!u) return ""
  if (u.startsWith("blob:") || u.startsWith("http")) return u
  return getAvatarUrl(u)
})

const onImagePicked = async (file: File) => {
  if (imageUploading.value) return
  if (previewUrl.value?.startsWith("blob:")) {
    URL.revokeObjectURL(previewUrl.value)
  }
  selectedFiles.value = [file]
  previewUrl.value = URL.createObjectURL(file)
  itemForm.value.imageUrl = previewUrl.value

  imageUploading.value = true
  try {
    const uploaded = await dataStore.loadUploadImage(file)
    itemForm.value.uploadId = uploaded.id || ""
    itemForm.value.imageUrl = uploaded.url
      ? (uploaded.url.startsWith("http") ? uploaded.url : `${import.meta.env.VITE_BASE_API}${uploaded.url}`)
      : previewUrl.value
  } catch {
    itemForm.value.uploadId = ""
    Toast.error("Rasmni yuklab bo'lmadi.")
    if (previewUrl.value?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl.value)
    }
    previewUrl.value = null
    selectedFiles.value = []
    itemForm.value.imageUrl = ""
  } finally {
    imageUploading.value = false
  }
}

const onFileRemove = () => {
  if (previewUrl.value?.startsWith("blob:")) {
    URL.revokeObjectURL(previewUrl.value)
  }
  selectedFiles.value = []
  previewUrl.value = null
  itemForm.value.imageUrl = ""
  itemForm.value.uploadId = ""
  removedOldImage.value = true
}

watch(
    () => isEditing.value,
    (val) => {
      if (val) {
        removedOldImage.value = false
      }
    }
)

const filteredOrders = computed(() => {

  let data = [...dataStore.state.vignettes.items]
  const categoryIds = new Set(vignetteCategory.value.map((category: any) => category.id))

  if (categoryIds.size) {
    data = data.filter(item => categoryIds.has(item.categoryId))
  }

  if (formFilter.value) {
    const search = formFilter.value.toLowerCase()

    data = data.filter(item =>
        item.orderName?.toLowerCase().includes(search) ||
        item.categoryName?.toLowerCase().includes(search) ||
        item.customerName?.toLowerCase().includes(search) ||
        item.receiverName?.toLowerCase().includes(search)
    )
  }
  return data.sort((a,b) =>
      new Date(b.acceptedDate).getTime() -
      new Date(a.acceptedDate).getTime()
  )
})

const categoryStatus = computed(() => {
  return vignetteCategory.value.map((cat: any) => {
    const items = filteredOrders.value.filter(
        item => item.categoryId === cat.id
    )

    const total = items.reduce(
        (sum, item) => sum + (item.amount || 0),
        0
    )

    const processed = items.reduce(
        (sum, item) => sum + (getProcessedCount(item) || 0),
        0
    )

    const remaining = total - processed

    return {
      ...cat,
      total,
      processed,
      remaining
    }
  })
})

const getFullName = (name: string) => {
  if (!name) return ''

  const [firstName, lastName] = name.split(' ')

  return `${lastName} ${firstName}`
}

const paginationInfo = computed(() => {
  const total = dataStore.state.paging.ALBUM.totalElements || 0
  const current = currentPage.value
  const size = pageSize.value

  const from = total === 0 ? 0 : current * size + 1
  const to = Math.min((current + 1) * size, total)

  return {
    from,
    to,
    total
  }
})

const getOrderedEmployees = (order: any) => {
  const saved = localStorage.getItem(`order_${order.id}_employees`)
  if (!saved) return order.employees

  const ids = JSON.parse(saved)

  return [...order.employees].sort((a, b) => {
    return ids.indexOf(a.employeeId) - ids.indexOf(b.employeeId)
  })
}

const getProcessedCount = (album: any) => {
  if (!album?.employees?.length) return 0

  const lastEmployee = album.employees[album.employees.length - 1]
  return lastEmployee?.processedCount || 0
}

const getProgressPercent = (album: any) => {
  if (!album?.amount) return 0
  return (getProcessedCount(album) / album.amount) * 100
}

const getProgressColor = (album: any) => {
  const percent = getProgressPercent(album)

  if (percent < 30) return 'bg-red-500'
  if (percent < 70) return 'bg-yellow-500'
  return 'bg-green-600'
}


type OrderForm = Omit<OrderCreateDto, "employees"> & {
  employees: string[]
}

const itemForm = ref<OrderForm>({
  kind: 'VIGNETTE',
  categoryId: "",
  categoryName: "",
  orderName: "",
  itemType: "",
  customerId: "",
  customerName: "",
  receiverName: "",
  employees: [],
  pageCount: null,
  amount: null,
  acceptedDate: "",
  deadline: "",
  status: "",
  imageUrl: "",
  notes: "",
  uploadId: ""
})

const orderSnapshotFields = computed((): OrderFormSnapshotFields => ({
  categoryId: itemForm.value.categoryId,
  orderName: itemForm.value.orderName,
  itemType: itemForm.value.itemType ?? "",
  customerId: itemForm.value.customerId ?? "",
  customerName: itemForm.value.customerName,
  receiverName: itemForm.value.receiverName,
  employees: itemForm.value.employees,
  pageCount: itemForm.value.pageCount,
  amount: itemForm.value.amount,
  acceptedDate: itemForm.value.acceptedDate,
  deadline: itemForm.value.deadline,
  status: itemForm.value.status,
  imageUrl: itemForm.value.imageUrl ?? "",
  notes: itemForm.value.notes ?? "",
  uploadId: itemForm.value.uploadId,
}));

const orderSaveDisabled = computed(
  () =>
    isSubmitting.value ||
    (isEditing.value &&
      orderEditBaseline.value !== "" &&
      snapshotOrderForm(
        orderSnapshotFields.value,
        selectedFiles.value.length > 0,
        removedOldImage.value,
      ) === orderEditBaseline.value),
);

const handleEmployeeChange = (newValues: string[]) => {
  const oldValues = itemForm.value.employees || []

  const added = newValues.filter(id => !oldValues.includes(id))

  const removed = oldValues.filter(id => !newValues.includes(id))

  let result = oldValues.filter(id => !removed.includes(id))

  result = [...result, ...added]

  itemForm.value.employees = result
}
// const changeFilter = (type: 'search' | 'status', value: string ) => {
//   if (type === 'search') {
//     formFilter.value = value
//   } else if (type === 'status') {
//     formStatus.value = value;
//   }
//   dataStore.loadGetAlbum()
// }

const currentPage = computed(() => dataStore.state.paging.VIGNETTE.pageNumber)
const page = computed(() => currentPage.value + 1)
const totalPages = computed(() => dataStore.state.paging.VIGNETTE.totalPages)
const pageSize = computed(() => dataStore.state.paging.VIGNETTE.pageSize)
const rowNumber = (index: number) => currentPage.value * pageSize.value + index + 1

const orderFilters = computed(() => ({
  status: formStatus.value || undefined,
  acceptedDate: formData.value || undefined,
  deadline: endData.value || undefined,
  search: formFilter.value || undefined,
}))

const allPagesNumbers = computed(() => {
  const total = totalPages.value
  const current = page.value
  const delta = 2
  const pages: (number | '...')[] = []

  for (let i = 1; i <= total; i++) {
    if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return pages
})

const changePage = async (targetPage: number | '...') => {
  if (targetPage === '...' || typeof targetPage !== 'number') return
  if (targetPage < 1 || targetPage > totalPages.value) return

  await dataStore.changePage("VIGNETTE", targetPage - 1, orderFilters.value)
}

watch([formStatus, formData, endData, formFilter], (_newValue, _oldValue, onCleanup) => {
  const timer = window.setTimeout(async () => {
    isLoading.value = true
    try {
      await dataStore.loadOrders("VIGNETTE", {
        ...orderFilters.value,
        page: 0,
      })
    } catch {
    } finally {
      isLoading.value = false
    }
  }, 300)

  onCleanup(() => window.clearTimeout(timer))
})

const closeFilter = () => {
  formStatus.value = null;
  formFilter.value = '';
  formData.value = null;
  endData.value = null;
  dataStore.loadOrders('VIGNETTE', { page: 0 });
}

// const filteredCategories = computed(() => {
//   return categoryType.filter(cat => {
//     return (
//         getCategoryCount(cat.value) > 0 ||
//         getCount(cat.value) > 0
//
//     )
//   })
// }) bu categoriyalarda yo'g'ini chiqarmaydi

const pageProcessed = computed(() => {
  return dataStore.state.paging.VIGNETTE.totalElements
})

const itemStatus = ref( [
  { value: 'PENDING', text: 'Kutilmoqda' },
  { value: 'IN_PROGRESS', text: 'Jarayonda' },
  { value: 'PAUSED', text: "To'xtatilgan" },
  { value: 'COMPLETED', text: 'Bajarilgan' },
])

const statusColor: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  IN_PROGRESS: 'bg-green-100 text-green-700',
  PAUSED: 'bg-orange-100 text-orange-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
}

const statusLabel: Record<string, string> = {
  PENDING:     "Kutilmoqda",
  IN_PROGRESS: "Jarayonda",
  PAUSED: "To'xtatilgan",
  COMPLETED:   "Bajarilgan",
}

const oderReceiver = ref([
  {value: "ADMIN", text: "ADMIN" },
  {value: "MENEGER", text: "MENEGER" },
])

const visibleForm = () => {
  isVisible.value = true;
  resetForm()

};
const closeForm = () => {
  isVisible.value = false;

}

const clearError = (key: string) => {
  delete errors.value[key]
}

const validateForm = () => {
  errors.value = {}

  const f = itemForm.value

  if (!f.orderName) errors.value.orderName = "Buyurtma nomi majburiy"
  if (!f.categoryId) errors.value.categoryId = "Kategoriya tanlanishi shart"
  if (!f.amount) errors.value.amount = "Buyurtma soni kiritilmadi"
  if (!f.pageCount) errors.value.pageCount = "Betlar soni kiritilmadi"
  if (!f.receiverName) errors.value.receiverName = "Qabul qiluvchi tanlanmadi"
  if (!f.status) errors.value.status = "Status tanlanmadi"
  if (!f.acceptedDate) errors.value.acceptedDate = "Sana kiritilmadi"
  if (!f.deadline) errors.value.deadline = "Muddat kiritilmadi"
  if (!f.employees.length) errors.value.employees = "Kamida 1 xodim tanlang"

  return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
  isSubmitting.value = true

  if (!validateForm()) {
    isSubmitting.value = false
    return
  }

  try {

    const payload: OrderCreateDto = {
      ...itemForm.value,
      kind: "VIGNETTE",
      employees: itemForm.value.employees.map((id, index) => ({
        employeeId: id,
        stepOrder: index + 1
      }))
    }

    if (isEditing.value) {
      await dataStore.updateOrder(itemId.value, payload)
      Toast.success("Yangilandi")
    } else {
      await dataStore.addOrder(payload)
      Toast.success("Qo'shildi")
    }

    await dataStore.loadOrders("VIGNETTE")
    resetForm()
    isVisible.value = false

  } catch (err) {
    console.error(err)
  } finally {
    isSubmitting.value = false
  }
}

const itemId = ref<string>('')

const editForm = (item: Order) => {
  isVisible.value = true;
  isEditing.value = true;

  itemForm.value = {
    ...item,
    kind: "VIGNETTE",
    employees: item.employees?.map(e => e.employeeId) || []
  }
  itemId.value = item.id;
  void nextTick(() => {
    orderEditBaseline.value = snapshotOrderForm(
      orderSnapshotFields.value,
      selectedFiles.value.length > 0,
      removedOldImage.value,
    );
  });
};

const deleteConfirmItem = async () => {
  if (!selectedItem.value) return;
  try {
    await dataStore.deleteOrder(selectedItem.value, 'VIGNETTE')
    Toast.info("Muvoffaqiyatli uchirildi!");
    showConfirmItem.value = false;
    selectedItem.value = null;
  }
  catch {
  }
}

const deleteItem = async (id: string | null) => {
  selectedItem.value = id;
  showConfirmItem.value = true;
}

const resetForm = () => {
  if (previewUrl.value?.startsWith("blob:")) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = null
  selectedFiles.value = []
  removedOldImage.value = false
  itemForm.value = {
    kind: "VIGNETTE",
    categoryId: "",
    categoryName: "",
    orderName: "",
    itemType: "",
    customerId: "",
    customerName: "",
    receiverName: "",
    employees: [],
    pageCount: 0,
    amount: 0,
    acceptedDate: "",
    deadline: "",
    status: "PENDING",
    imageUrl: "",
    notes: "",
    uploadId: ""
  }
  isEditing.value = false
  orderEditBaseline.value = ""
}

const formatDate = (dateString?: string | null): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2,'0');
  return `${day}-${month}-${year}`;
};
onMounted(async () => {
  if (route.query.status) {
    formStatus.value = route.query.status as string;
  }
  isLoading.value = true;
  try {
    await Promise.all([
      dataStore.loadOrders('VIGNETTE', {
        ...orderFilters.value,
        page: 0,
      }),
      dataStore.loadCategory('VIGNETTE'),
      dataStore.loadUsers()
    ]);
  } catch {
  } finally {
    isLoading.value = false;
  }
});

</script>
<style scoped>
.app-page {
  background:
      linear-gradient(180deg, rgb(248 250 252 / 0.9) 0%, var(--color-pb-app) 36%, var(--color-pb-app) 100%),
      radial-gradient(ellipse 65% 40% at 50% -8%, rgb(37 99 235 / 0.07), transparent 52%);
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
