<template>
  <div class="flex flex-col text-gray-800 container m-auto gap-2 p-4 min-h-screen w-full">
    <div class="flex flex-col sm:flex-row gap-4 items-center bg-white shadow rounded-xl py-3 px-4 justify-between w-full">
      <div class="flex items-center gap-4">
        <img class="w-12" src="../assets/album.png" alt="">
        <div>
          <h2 class="text-md font-semibold uppercase">Buyurtmalar</h2>
          <p class="text-gray-600 text-sm font-semibold">{{pageProcessed}} dona</p>
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
        class="grid grid-cols-1 animate-fade-in sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 bg-gray-200 rounded-xl p-2 justify-between"
    >
      <div
          class="flex flex-col gap-4 bg-white rounded-xl py-2 px-4 justify-between"
          v-for="(cat, index) in categoryStatus"
          :key="index"
      >
        <div
            class="flex w-full flex-col border-b gap-1 border-gray-200"
        >
          <h2 class="text-sm uppercase font-semibold">{{cat.name}}</h2>
          <span class="text-gray-400 text-sm">Betlar: <span class="text-sm font-semibold text-gray-400" v-if="cat.defaultPages">{{cat.defaultPages}}</span></span>
        </div>
        <div
            class="flex gap-4 items-center justify-between"
        >
          <div class="flex flex-col w-full border-r-2 border-gray-200">
            <div class="gap-1 flex flex-col items-start font-semibold">
              <span class="text-gray-600 text-sm flex">Jami</span>
              <div class="flex text-md gap-2 items-center">
                <span class="text-blue-600">
                {{cat.total}}
                </span>
                <span class="text-gray-400">dona</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col w-full border-r-2 border-gray-200">
            <div class="gap-1 flex flex-col items-center font-semibold">
              <span class="text-gray-600 text-sm">Bajarilgan</span>
              <div class="flex text-md gap-2 items-center">
                <span class="text-blue-600">
                {{cat.processed}}
                </span>
                <span class="text-gray-400">dona</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col w-full">
            <div class="gap-2 flex flex-col items-center font-semibold">
              <span class="text-gray-600 text-sm">Qoldi</span>
              <div class="flex text-md gap-2 items-center">
                <span class="text-blue-600">
                {{cat.remaining}}
                </span>
                <span class="text-gray-400">dona</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CDialog
        :show="showConfirmItem"
        @close="showConfirmItem = false"
        body-class="justify-center bg-blue-800 text-center px-4 pb-8"
    >
      <DeleteConfirm
          v-model:show="showConfirmItem"
          @confirm="deleteConfirmItem"
          title="Siz ushbu zakazni uchirmoqchimisiz?"
      />
    </CDialog>
    <CDialog
        has-close-icon
        no-header
        :show="isVisible"
        @close="closeForm"
        bodyClass="rounded-lg mt-20 !bg-bg-primary"
    >
      <div
          class="flex flex-col overflow-hidden"
      >
        <form
            @submit.prevent="submitForm"
            class="flex flex-col gap-2 p-4 overflow-y-auto text-md max-h-[80vh]"
        >
          <h2 class=" text-2xl font-semibold">
            {{isEditing ? "Formani uzgartirish" : "Forma qo'shish"}}
          </h2>
<!--          <FileUpload-->
<!--              ref="fileUploadRef"-->
<!--              mode="advanced"-->
<!--              :customUpload="true"-->
<!--              :auto="false"-->
<!--              :multiple="false"-->
<!--              accept="image/*"-->

<!--              chooseLabel="Rasm yuklash"-->
<!--              :showUploadButton="false"-->
<!--              :showCancelButton="false"-->
<!--              :showClearButton="true"-->
<!--              @select="onFileSelect"-->
<!--              @clear="onFileRemove"-->
<!--          />-->
          <AppInput
              label="Rasm yuklash"
              type="file"
              accept="image/*"
              @change="changeFile($event)"
          />
          <div
              v-if="avatarPreview || (isEditing && form.imageUrl && !removedOldImage)"
              class="relative w-32 h-25"
          >
            <img
                alt=""
                :src="avatarPreview || getAvatarUrl(form.imageUrl)"
                class="object-cover rounded-xl border"
            />
            <button
                type="button"
                @click="onFileRemove"
                class="absolute cursor-pointer -top-2 -right-2 hover:bg-red-400 bg-red-300 text-red-800 w-7 h-7 rounded-full"
            >
              ✕
            </button>
          </div>
          <div class="flex flex-col w-full">
            <AppSelect
                v-model="form.categoryId"
                :options="allCategory"
                disabledValue="Tanlang"
                text-field="text"
                value-field="value"
                label="Albom turi"
                @change="clearError('categoryId')"
                :errorText="errors.categoryId"
            />
            <p v-if="errors.categoryId" class="text-red-500 text-sm">
              {{errors.categoryId}}
            </p>
          </div>
          <div class="flex w-full gap-2 px-1 items-center justify-between">
            <div class="flex w-full flex-col">
              <AppInput
                  label="Betlar turi"
                  type="number"
                  step="2"
                  class="w-full"
                  @input="clearError('pageCount')"
                  placeholder="2,4,6,10,...,"
                  v-model="form.pageCount"
                  :class="{'border-red-500' : errors.pageCount}"
              />
              <p v-if="errors.pageCount" class="text-red-500 text-sm">
                {{errors.pageCount}}
              </p>
            </div>
            <div class="flex flex-col w-full">
              <AppInput
                  type="number"
                  class="w-full"
                  placeholder="Masalan: 10"
                  label="Buyurtma soni"
                  v-model="form.amount"
                  @input="clearError('amount')"
              />
              <p v-if="errors.amount" class="text-red-500 text-sm">
                {{errors.amount}}
              </p>
            </div>
          </div>
          <div class="flex items-center justify-between w-full gap-2">
            <div class="flex flex-col w-full">
              <AppInput
                  type="text"
                  placeholder="Masalan: Maktab"
                  label="Nomi"
                  class="w-full"
                  v-model="form.orderName"
                  @input="clearError('orderName')"
              />
              <p v-if="errors.orderName" class="text-red-500 text-sm">
                {{errors.orderName}}
              </p>
            </div>
            <div class="flex flex-col w-full">
              <AppInput
                  type="text"
                  placeholder="Masalan: Qora koja"
                  label="Turi"
                  class="w-full"
                  v-model="form.itemType"
                  @input="clearError('itemType')"
              />
              <p v-if="errors.itemType" class="text-red-500 text-sm">
                {{errors.itemType}}
              </p>
            </div>
          </div>
          <div class="flex w-full gap-2 items-center justify-between">
            <AppInput
                type="text"
                v-model="form.customerName"
                placeholder="Ism kiriting"
                label="Mijoz ismi"
                class="w-full"
            />
            <div class="flex flex-col w-full">
              <AppSelect
                  :options="oderReceiver"
                  v-model="form.receiverName"
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
          </div>
          <div class="flex flex-col w-full">
            <AppSelect
                :model-value="form.employees"
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
          <div
              class="flex items-center w-full gap-2"
          >
            <div class="flex flex-col w-full">
              <AppInput
                  v-model="form.acceptedDate"
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
                  v-model="form.deadline"
                  @input="clearError('deadline')"
              />
              <p v-if="errors.deadline" class="text-red-500 text-sm">
                {{errors.deadline}}
              </p>
            </div>
          </div>
          <div
              class="flex items-center w-full gap-2"
          >
            <AppSelect
                v-model="form.status"
                :options="itemStatus"
                disabledValue="Xolatni tanlang"
                label="Status"
                text-field="text"
                value-field="value"
            />
          </div>
          <div class="flex my-2 flex-col sm:flex-row items-stretch lg:flex-row gap-2 sm:items-center justify-end w-full">
            <CButton
                type="button"
                text="Bekor qilish"
                variant="ghost-accent"
                @click="closeForm"
            />
            <CButton
                type="submit"
                :text="isEditing ? 'Yangilash' : 'Saqlash'"
                variant="success"
            />
          </div>
        </form>
      </div>
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
    <div class="bg-white animate-fade-in w-full flex flex-col px-4 py-2 gap-2 min-h-0 rounded-xl shadow">
      <div class="flex flex-col w-full border-b-2 border-gray-200">
        <div class="flex items-center gap-2 py-2">
          <CButton
              text="Orqaga"
              type="button"
              is-has-fa-icon
              variant="ghost-accent"
              faClass="fa-solid fa-arrow-left"
              @click="router.back()"
          />
          <h2 class="text-lg font-semibold">Buyurtmalar jadvali</h2>
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
                variant="ghost-accent"
                @click="closeFilter"
                class="mb-1"
            />
          </div>
        </div>
      </div>
      <div class="overflow-auto">
        <table
            class="w-full rounded table-auto overflow-auto">
          <colgroup>
            <col style="width: 2%">
            <col style="width: 13%">
            <col style="width: 12%">
            <col style="width: 12%">
            <col style="width: 12%">
            <col style="width: 13%">
            <col style="width: 14%">
            <col style="width: 10%">
            <col style="width: 10%">
            <col style="width: 8%">
            <col style="width: 6%">
          </colgroup>
          <thead class="bg-gray-200 rounded-2xl text-sm tracking-wider">
          <tr>
            <th class="px-2 py-3 text-start">№</th>
            <th class="p-2 text-start">Buyurtma nomi</th>
            <th class="p-2 text-center">Rasm</th>
            <th class="p-2 text-start">Mijoz</th>
            <th class="p-2 text-start">Qabul qilgan</th>
            <th class="p-2 text-start">Mas'ul</th>
            <th class="py-2 px-4 text-start">Jarayon</th>
            <th class="p-3 text-start">Sana</th>
            <th class="p-2 text-start">Muddat</th>
            <th class="p-2 text-start">Holat</th>
            <th class="p-2 text-start">Amallar</th>
          </tr>
          </thead>
          <tbody v-if="isLoading">
          <tr v-for="i in 8" :key="i" class="border-t">
            <td class="p-2"><div class="h-4 w-6 bg-gray-200 rounded animate-pulse"></div></td>

            <td class="p-2 space-y-2">
              <div class="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div class="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
            </td>

            <td class="p-2">
              <div class="w-14 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </td>

            <td class="p-2"><div class="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
            <td class="p-2"><div class="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></td>
            <td class="p-2"><div class="h-4 w-24 bg-gray-200 rounded animate-pulse"></div></td>

            <td class="p-2">
              <div class="w-full bg-gray-200 h-2 rounded-full animate-pulse"></div>
              <div class="h-3 w-16 mt-2 bg-gray-200 rounded animate-pulse"></div>
            </td>
            <td class="p-2"><div class="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>

            <td class="p-2"><div class="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
            <td class="p-2">
              <div class="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
            </td>
            <td class="p-2">
              <div class="h-8 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
            </td>
          </tr>
          </tbody>
          <tbody v-else-if="paginatedAlbums.length > 0">
          <tr
              class="border-t border-gray-600 text-sm hover:bg-gray-100"
              v-for="(album, index) in paginatedAlbums" :key="album.id"
          >
            <td class="py-2 px-3">{{ rowNumber(index) }}</td>
            <td class="p-2 break-all">
              <p class="font-semibold">{{ album.orderName }}</p>
              <p class="text-gray-500 text-sm font-semibold">{{album.categoryName}}</p>
              <p class="text-blue-600 text-sm font-semibold">{{album.itemType}}</p>
            </td>
            <td class="p-3 items-center justify-center flex">
              <img
                  v-if="album.imageUrl"
                  @click="openPreview(album.imageUrl)"
                  class="w-14 h-10 sm:h-10 lg:h-12 cursor-pointer rounded-xl"
                  :src="getAvatarUrl(album.imageUrl)" alt=""
              />
            </td>
            <td class="p-2">{{ album.customerName }}</td>
            <td class="p-2">{{ album.receiverName }}</td>
            <td class="">
              <div
                  v-for="emp in album.employees"
                  :key="emp.employeeId"
                  class="flex justify-between border-b border-gray-300 py-1"
              >
                <div class="flex text-sm gap-1 items-center">
                  <i
                      v-if="(emp.processedCount ?? 0) === album.amount"
                      class="fa-solid fa-circle-check text-green-600"
                  />
                  <i
                      v-else-if="(emp.processedCount ?? 0) > 0"
                      class="fa-solid fa-play text-blue-600"
                  />
                  <i
                      v-else
                      class="fa-regular fa-circle text-gray-400"
                  />
                  <span class="flex p-1">{{ getFullName(emp.employeeName) }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span>{{emp.processedCount}} ta</span>
                </div>
<!--                <div v-if="emp.notes" class="pl-5 text-xs text-gray-500 break-words">-->
<!--                  Izoh: {{ emp.notes }}-->
<!--                </div>-->
              </div>
            </td>
            <td class="py-2 px-4">
              <div class="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
                <span
                    v-if="getProcessedCount(album) && album.amount"
                    class="block h-full transition-all duration-500 ease-out"
                    :class="getProgressColor(album)"
                    :style="{
                    width: getProgressPercent(album) + '%'
                  }"
                ></span>
              </div>
              <div class="text-sm mt-1 flex px-1 items-center justify-between text-gray-600">
                <span>{{ getProcessedCount(album) || 0 }} / {{ album.amount }}</span>
                <span>{{album.pageCount || 0}}-Bet</span>
              </div>
            </td>
            <td class="py-2 px-1">{{ formatDate(album.acceptedDate) }}</td>
            <td class="p-2">{{ formatDate(album.deadline) }}</td>
            <td class="p-2"
            >
            <span
                :class="[statusColor[album.status],
                  'rounded-xl px-3 py-1 font-semibold text-sm'
                ]">
              {{ statusLabel[album.status] }}
            </span>
            </td>
            <td class="py-2 px-3">
              <div
                  class="flex items-center gap-2"
              >
                <CButton
                    type="button"
                    text="Edit"
                    variant="ghost-accent"
                    @click="editForm(album)"
                />
                <CButton
                    type="button"
                    text="Delete"
                    variant="danger"
                    @click="deleteItem(album.id)"
                />
              </div>
            </td>
          </tr>
          </tbody>
          <tbody v-else>
          <tr>
            <td
                colspan="10"
                class="text-center py-6 text-gray-600 font-semibold"
            >
              Buyurtma topilmadi!
            </td>
          </tr>
          </tbody>
        </table>
        <div
            v-if="totalPages > 1"
            class="flex h-20 items-center sticky bottom-0 z-10 justify-center mt-4 pb-2 gap-2 bg-white border-t"
        >
          <div class="text-sm text-gray-800 rounded p-2 border border-gray-100 mr-4">{{paginationInfo.from}} - {{paginationInfo.to}} dan {{paginationInfo.total}}</div>
          <button
              type="button"
              @click="changePage(page - 1)"
              :disabled="page === 1"
              class="flex w-10 h-10 justify-center items-center rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed bg-gray-700 text-white hover:bg-gray-800"
          >
            <i class="fa-solid fa-chevron-left text-sm"></i>
          </button>
          <div
              v-for="(pageItem, idx) in allPagesNumbers"
              :key="idx"
              class="flex justify-center items-center px-3 py-1 h-11 w-11 rounded-3xl select-none"
              :class="{
                'bg-blue-500 text-white font-bold': pageItem === page,
                'cursor-pointer hover:bg-gray-300': pageItem !== '...' && pageItem !== page,
                'text-gray-400 cursor-default text-lg': pageItem === '...',
              }"
              @click="pageItem !== '...' && changePage(pageItem)"
          >
            {{ pageItem }}
          </div>
          <button
              type="button"
              @click="changePage(page + 1)"
              :disabled="page >= totalPages"
              class="flex w-10 h-10 justify-center items-center rounded-full transition"
              :class="page >= totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-700 text-white cursor-pointer hover:bg-gray-800'"
          >
            <i class="fa-solid fa-chevron-right text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

</template>


<script setup lang="ts">
import CButton from "@/components/CButton.vue";
import {computed, onMounted, ref, watch} from "vue";
import CDialog from "@/components/CDialog.vue";
import AppInput from "@/components/ui/AppInput.vue";
import AppSelect from "@/components/ui/AppSelect.vue";
import {useStore} from "@/stores/store";
import {Order, OrderCreateDto, OrderStatus} from "@/typeModules/useModules";
import { useToast } from "vue-toastification";
import DeleteConfirm from "@/components/DeleteConfirm.vue";
import { useRoute, useRouter } from "vue-router";
import axiosInstance from "@/axios";

const router = useRouter();
const route = useRoute();
const Toast = useToast();
const dataStore = useStore();

const allUsers = computed(() => dataStore.state.user.items);
const allCategory = computed(() => dataStore.state.alCategory)

const orderedUsers = computed(() => {
  const selected = form.value.employees

  return [...allUsers.value].sort((a, b) => {
    const aIndex = selected.indexOf(a.id)
    const bIndex = selected.indexOf(b.id)

    if (aIndex === -1 && bIndex === -1) return 0
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1

    return aIndex - bIndex
  })
})

const handleEmployeeChange = (newValues: string[]) => {
  const oldValues = form.value.employees || []

  const added = newValues.filter(id => !oldValues.includes(id))

  const removed = oldValues.filter(id => !newValues.includes(id))

  let result = oldValues.filter(id => !removed.includes(id))

  result = [...result, ...added]

  form.value.employees = result
}

const isEditing = ref(false);
const isVisible = ref(false);
const selectedItem = ref<string | null>(null);
const showConfirmItem = ref(false);
const formStatus = ref<OrderStatus | string | null>((route.query.status as OrderStatus) || null);
const formData = ref<string | null>(null);
const endData = ref<string | null>(null);
const formFilter = ref('');
const previewImage = ref<string | null>(null)

const openPreview = (url: string) => {
  previewImage.value = url;
}
const closePreview = () => {
  previewImage.value = null;
}
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null)
const avatarPreview = ref<string>("");
const removedOldImage = ref(false)
const isLoading = ref(false)

const errors = ref<Record<string, string>>({})

const BASE_URL = import.meta.env.VITE_BASE_API

const getAvatarUrl = (url: string | undefined): string => {
  if (!url) return '';

  if (url.startsWith('http')) return url;

  return `${BASE_URL}${url}`;

};

const changeFile = (event: Event) => {
  const fileInput = event.target as HTMLInputElement;
  if (!fileInput.files?.length) return;

  const file = fileInput.files[0];
  selectedFile.value = file;
  avatarPreview.value = URL.createObjectURL(file);
  removedOldImage.value = false;
};

const onFileRemove = async () => {
  if (form.value.uploadId) {
    await deleteUpload(form.value.uploadId);
    selectedFile.value = null;
  }
  previewUrl.value = null;
  form.value.imageUrl = ""
  form.value.uploadId = ""
  removedOldImage.value = true
}

const uploadAvatar = async (): Promise<{ url: string; id: string } | null> => {
  if (!selectedFile.value) return null;

  const formData = new FormData();
  formData.append("file", selectedFile.value);

  const { data } = await axiosInstance.post("/api/v1/uploads", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return {
    url: data.url,
    id: data.id
  };
};

const deleteUpload = async (uploadId: string) => {
  if (!uploadId) return;

  try {
    await axiosInstance.delete(`/api/v1/uploads/${uploadId}`);
  } catch (error) {
    console.error("Upload o'chirishda xatolik:", error);
  }
};

watch(
    () => isEditing.value,
    (val) => {
      if (val) {
        removedOldImage.value = false
      }
    }
)

const filteredAlbums = computed(() => {
  const categoryIds = new Set(allCategory.value.map((category: any) => category.id))
  const items = dataStore.state.albums.items

  if (!categoryIds.size) return items

  return items.filter(item => categoryIds.has(item.categoryId))
})

const categoryStatus = computed(() => {
  return allCategory.value.map((cat: any) => {
    const items = filteredAlbums.value.filter(
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

const form = ref<OrderForm>({
  kind: 'ALBUM',
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

// const changeFilter = (type: 'search' | 'status', value: string ) => {
//   if (type === 'search') {
//     formFilter.value = value
//   } else if (type === 'status') {
//     formStatus.value = value;
//   }
//   dataStore.loadGetAlbum()
// }

const currentPage = computed(() => dataStore.state.paging.ALBUM.pageNumber);
const page = computed(() => currentPage.value + 1);
const totalPages = computed(() => dataStore.state.paging.ALBUM.totalPages)
const pageSize = computed(() => dataStore.state.paging.ALBUM.pageSize)
const rowNumber = (index: number) => currentPage.value * pageSize.value + index + 1

const orderFilters = computed(() => ({
  status: formStatus.value || undefined,
  acceptedDate: formData.value || undefined,
  deadline: endData.value || undefined,
  search: formFilter.value || undefined,
}))

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

  await dataStore.changePage("ALBUM", targetPage - 1, orderFilters.value)
}

const paginatedAlbums = computed(() => dataStore.state.albums.items)

watch([formStatus, formData, endData, formFilter], (_newValue, _oldValue, onCleanup) => {
  const timer = window.setTimeout(() => {
    dataStore.loadOrders("ALBUM", {
      ...orderFilters.value,
      page: 0,
    })
  }, 300)

  onCleanup(() => window.clearTimeout(timer))
})

const clearError = (key: string) => {
  delete errors.value[key]
}

const closeFilter = () => {
  formStatus.value = null;
  formFilter.value = '';
  formData.value = null;
  endData.value = null;
  dataStore.loadOrders('ALBUM', { page: 0});
}

const pageProcessed = computed(() => {
  return dataStore.state.paging.ALBUM.totalElements
})

const itemStatus = ref( [
  { value: "PENDING",     text: "Kutilmoqda" },
  { value: "IN_PROGRESS", text: "Jarayonda"  },
  { value: "PAUSED", text: "To'xtatilgan"  },
  { value: "COMPLETED",   text: "Bajarilgan" },
])

const statusLabel: Record<string, string> = {
  PENDING:     "Kutilmoqda",
  IN_PROGRESS: "Jarayonda",
  PAUSED: "To'xtatilgan",
  COMPLETED:   "Bajarilgan",
};

const oderReceiver = ref([
  {value: "ADMIN", text: "ADMIN" },
  {value: "MENEGER", text: "MENEGER" },
])

const visibleForm = () => {
  isVisible.value = true;
  resetForm()
};

// const changeImage = async (event: Event) => {
//   const input = event.target as HTMLInputElement
//   if (!input.files?.length) return
//
//   const file = input.files[0]
//
//   console.log("Uploading file:", file)
//   const url = await dataStore.uploadImage(file, 'albums')
  //
  // itemForm.value.imageUrl = URL.createObjectURL(file)
// }

const closeForm = () => {
  isVisible.value = false;
}

const statusColor: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  IN_PROGRESS: 'bg-green-100 text-green-700',
  PAUSED: 'bg-orange-100 text-orange-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
}

const validateForm = () => {
  errors.value = {}

  const f = form.value

  if (!f.orderName) errors.value.orderName = "Buyurtma nomi majburiy"
  if (!f.categoryId) errors.value.categoryId = "Kategoriya tanlanishi shart"
  if (!f.amount) errors.value.amount = "Buyurtma soni kiritilmadi"
  if (!f.pageCount) errors.value.pageCount = "Betlar soni kiritilmadi"
  if (!f.receiverName) errors.value.receiverName = "Qabul qiluvchi tanlanmadi"
  if (!f.status) errors.value.status = "Status tanlanmadi"
  if (!f.itemType) errors.value.itemType = "Buyurtma turi kiritilmadi"
  if (!f.acceptedDate) errors.value.acceptedDate = "Sana kiritilmadi"
  if (!f.deadline) errors.value.deadline = "Muddat kiritilmadi"
  if (!f.employees.length) errors.value.employees = "Kamida 1 xodim tanlang"

  return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
  isLoading.value = true;

  if (!validateForm()) {
    isLoading.value = false
    return
  }

  try {
    if (selectedFile.value) {
      const uploaded = await uploadAvatar();
      if (uploaded) {
        form.value.imageUrl = uploaded.url;
        form.value.uploadId = uploaded.id;
      }
    }
    const payload: OrderCreateDto = {
      ...form.value,
      kind: "ALBUM",
      employees: form.value.employees.map((id, index) => ({
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

    await dataStore.loadOrders("ALBUM")
    resetForm()
    isVisible.value = false
    isLoading.value = false

  } catch (err) {
    console.error(err)
  }
}

const itemId = ref<string>('');

const editForm = (item: Order) => {
  isVisible.value = true;
  isEditing.value = true;

  form.value = {
    ...item,
    kind: "ALBUM",
    employees: item.employees?.map(e => e.employeeId) || []
  }
  itemId.value = item.id;
};

const deleteConfirmItem = async () => {
  isLoading.value = true;
  if (!selectedItem.value) return;
  try {
    await dataStore.deleteOrder(selectedItem.value, 'ALBUM')
    Toast.info("Muvoffaqiyatli uchirildi!");
    showConfirmItem.value = false;
    selectedItem.value = null;
    isLoading.value = false;
  }
  catch (error) {
    console.log("Error", error);
  }
}

const deleteItem = async (id: string | null) => {
  selectedItem.value = id;
  showConfirmItem.value = true;
}

const resetForm = () => {
  form.value = {
    kind: "ALBUM",
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
  isLoading.value = true;
  try {
    await Promise.all([
      dataStore.loadOrders('ALBUM', {
        ...orderFilters.value,
        page: 0,
      }),
      dataStore.loadCategory('ALBUM'),
      dataStore.loadUsers()
    ])
    isLoading.value = false
  } catch (error) {
    console.log(error)
  }

})

</script>
<style scoped>
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
