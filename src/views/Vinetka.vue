<template>
  <div class="flex flex-col container m-auto gap-2 p-4 min-h-screen w-full">
    <div class="flex flex-col sm:flex-row items-center bg-white shadow rounded-xl px-4 py-2 gap-4 justify-between w-full">
      <div class="flex items-center gap-4">
        <i class="fa-solid fa-book-open text-5xl text-blue-800"></i>
        <div>
          <h2 class="font-semibold uppercase text-md">Buyurtmalar</h2>
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
          class="flex flex-col gap-4 bg-white rounded-xl px-4 py-2 justify-between"
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
              <div class="flex gap-2 items-center text-md">
                <span class=" text-blue-600">
                {{cat.total}}
                </span>
                <span class="text-gray-400">dona</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col w-full border-r-2 border-gray-200">
            <div class="gap-1 flex flex-col items-start font-semibold">
              <span class="text-gray-600 text-sm">Bajarilgan</span>
              <div class="flex gap-2 text-md items-center">
                <span class="text-blue-600">
                {{cat.processed}}
                </span>
                <span class="text-gray-400">dona</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col w-full">
            <div class="gap-2 flex flex-col items-start font-semibold">
              <span class="text-gray-600 text-sm">Qoldi</span>
              <div class="flex gap-2 text-md items-center">
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
            class="flex flex-col gap-2 p-4 text-md overflow-y-auto max-h-[80vh]"
        >
          <h2 class=" text-2xl font-semibold">
            {{isEditing ? "Formani uzgartirish" : "Forma qo'shish"}}
          </h2>
          <FileUpload
              ref="fileUploadRef"
              mode="advanced"
              :customUpload="true"
              :auto="false"
              :multiple="false"
              accept="image/*"

              chooseLabel="Rasm yuklash"
              :showUploadButton="false"
              :showCancelButton="false"
              :showClearButton="true"

              @select="onFileSelect"
              @clear="onFileRemove"
          />
          <div
              v-if="isEditing && itemForm.imageUrl && !removedOldImage"
              class="relative w-32 h-25"
          >
            <img
                alt=""
                :src="itemForm.imageUrl"
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
          <AppSelect
              v-model="itemForm.categoryId"
              :options="vignetteCategory"
              disabledValue="Tanlang"
              text-field="text"
              value-field="value"
              label="Vinetka turi"
          />
          <div class="flex w-full gap-2 px-1 items-center justify-between">
            <AppInput
                label="Betlar soni"
                type="number"
                step="2"
                class="w-full"
                placeholder="2,4,6"
                v-model="itemForm.pageCount"
            />
            <AppInput
                type="number"
                class="w-full"
                placeholder="Masalan: 10"
                label="Buyurtma soni"
                v-model="itemForm.amount"
            />
          </div>
          <div
              class="flex gap-2 items-center justify-between"
          >
            <AppInput
                type="text"
                placeholder="Masalan: Maktab"
                label="Nomi"
                class="w-full"
                v-model="itemForm.orderName"
            />
            <AppInput
                type="text"
                class="w-full"
                v-model="itemForm.customerName"
                placeholder="Ism kiriting"
                label="Mijoz ismi"
            />
          </div>
          <AppSelect
              :options="oderReceiver"
              v-model="itemForm.receiverName"
              disabledValue="Tanlang"
              text-field="text"
              value-field="value"
              label="Qabul qiluvchi"
          />
          <AppSelect
              :model-value="itemForm.employees"
              @update:modelValue="handleEmployeeChange"
              :options="orderedUsers"
              disabledValue="Xodimni tanlang"
              text-field="lastName"
              value-field="id"
              isMultiple
              label="Mas'ul xodim"
          />
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
            <AppInput
                v-model="itemForm.acceptedDate"
                label="Qabul qilingan sana"
                type="date"
                class="w-full"
            />
            <AppInput
                label="Tugash sanasi"
                type="date"
                class="w-full"
                v-model="itemForm.deadline"
            />
          </div>
          <div class="flex my-4 flex-col sm:flex-row items-stretch lg:flex-row gap-2 sm:items-center justify-end w-full">
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
            :src="previewImage"
            class="max-h-[85vh] w-auto rounded-2xl shadow-2xl"
            @click.stop
        />
      </div>
    </div>
    <div class="bg-white animate-fade-in w-full flex overflow-x-auto flex-col px-4 py-2 gap-2 min-h-0 rounded-xl shadow">
      <div class="flex flex-col border-b-2 border-gray-200">
        <div class="flex items-center gap-4 py-2">
          <CButton
              text="Orqaga"
              type="button"
              is-has-fa-icon
              variant="ghost-accent"
              faClass="fa-solid fa-arrow-left"
              @click="router.back()"
          />
          <h2 class="text-xl font-semibold">Buyurtmalar jadvali</h2>
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
        <thead class="bg-gray-200 rounded-2xl text-sm">
        <tr>
          <th class="p-1 text-start">№</th>
          <th class="p-2 text-start">Buyurtma nomi</th>
          <th class="p-2 text-center">Rasm</th>
          <th class="p-2 text-start">Mijoz</th>
          <th class="p-2 text-start">Qabul qilgan</th>
          <th class="p-2 text-start">Mas'ul</th>
          <th class="p-2 text-start">Jarayon</th>
          <th class="py-3 px-4 text-start">Sana</th>
          <th class="p-2 text-start">Muddat</th>
          <th class="p-2 text-start">Holat</th>
          <th class="p-2 text-start">Amallar</th>
        </tr>
        </thead>
        <tbody v-if="filteredOrders.length > 0">
        <tr
            class="border-t border-gray-600 hover:bg-gray-100"
            v-for="(order, index) in filteredOrders" :key="index"
        >
          <td class="p-1">{{ index + 1 }}</td>
          <td class="p-2 break-all">
            <p class="break-all font-semibold">{{ order.orderName }}</p>
            <p class="text-gray-500 text-sm font-semibold">{{order.categoryName}}</p>
          </td>
          <td class="p-3 items-center justify-center flex">
            <img
                v-if="order.imageUrl"
                @click="openPreview(order.imageUrl)"
                class="w-14 h-10 sm:h-10 lg:h-12 cursor-pointer rounded-xl"
                :src="order.imageUrl" alt=""
            />
          </td>
          <td class="p-2 ">{{ order.customerName }}</td>
          <td class="p-2 ">{{ order.receiverName }}</td>
          <td class="px-1 ">
            <div
                v-if="order.employees"
                v-for="(emp, index) in getOrderedEmployees(order)"
                :key="index"
                class="border-b border-gray-300 py-1"
            >
              <div class="flex text-sm items-center gap-2">
                <i
                    v-if="(emp.processedCount ?? 0) === order.amount"
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
                <span class="flex p-1">{{ emp.employeeName }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span>{{emp.processedCount}} ta</span>
              </div>
              <div v-if="emp.notes" class="pl-5 text-xs text-gray-500 break-words">
                Izoh: {{ emp.notes }}
              </div>
            </div>
          </td>
          <td class="py-2 px-3">
            <div class="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
                <span
                    v-if="getProcessedCount(order) || order.amount"
                    class="block h-full transition-all duration-500 ease-out"
                    :class="getProgressColor(order)"
                    :style="{
                    width: getProgressPercent(order) + '%'
                  }"
                ></span>
            </div>
            <div class="text-sm mt-1 flex px-1 items-center justify-between text-gray-600">
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
          <td class="p-2">
            <div
                class="flex items-center gap-2"
            >
              <CButton
                  type="button"
                  text="Edit"
                  variant="ghost-accent"
                  @click="editForm(order)"
              />
              <CButton
                  type="button"
                  text="Delete"
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
              colspan="10"
              class="text-center py-6 text-gray-600 font-semibold"
          >
            Buyurtma topilmadi!
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import CButton from "@/components/CButton.vue";
import {computed, ComputedRef, onMounted, ref, watch} from "vue";
import CDialog from "@/components/CDialog.vue";
import AppInput from "@/components/ui/AppInput.vue";
import AppSelect from "@/components/ui/AppSelect.vue";
import {useStore} from "@/stores/store";
import {Order, OrderCreateDto} from "@/typeModules/useModules";
import { useToast } from "vue-toastification";
import DeleteConfirm from "@/components/DeleteConfirm.vue";
import FileUpload from "primevue/fileupload";
import { useRoute, useRouter } from "vue-router";

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
const isVisible = ref(false);
const selectedItem = ref<string | null>(null);
const showConfirmItem = ref(false);
const formStatus = ref<string | null>(null);
const formData = ref<string | null>(null);
const endData = ref<string | null>(null);
const formFilter = ref<string | ''>('');
const previewImage = ref<string | null>(null)


const openPreview = (url: string) => {
  previewImage.value = url;
}

const closePreview = () => {
  previewImage.value = null;
}

const selectedFiles = ref<File[]>([])
const previewUrl = ref<string | null>(null)
const fileUploadRef = ref()
const removedOldImage = ref(false)

const onFileSelect = async (event: any) => {
  const file = event.files[0]
  if (event.files.length > 1) {
    fileUploadRef.value.clear()
    return
  }
  selectedFiles.value = [file];

  previewUrl.value = URL.createObjectURL(file)
  itemForm.value.imageUrl = previewUrl.value

  try {
    const uploaded = await dataStore.loadUploadImage(file)
    itemForm.value.uploadId = uploaded.id || ""
    itemForm.value.imageUrl = uploaded.url
      ? (uploaded.url.startsWith("http") ? uploaded.url : `${import.meta.env.VITE_BASE_API}${uploaded.url}`)
      : previewUrl.value
  } catch (error) {
    itemForm.value.uploadId = ""
    Toast.error("Rasmni yuklab bo'lmadi.")
  }
}

const onFileRemove = () => {
  selectedFiles.value = [];
  previewUrl.value = null;
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

const handleEmployeeChange = (newValues: string[]) => {
  const oldValues = itemForm.value.employees || []

  // yangi qo‘shilganlarni topamiz
  const added = newValues.filter(id => !oldValues.includes(id))

  // o‘chirilganlarni topamiz
  const removed = oldValues.filter(id => !newValues.includes(id))

  // eski tartibni saqlaymiz
  let result = oldValues.filter(id => !removed.includes(id))

  // yangi tanlanganlarni oxiriga qo‘shamiz
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

watch([formStatus, formData, endData],
    async () => {

      await dataStore.loadOrders("VIGNETTE",{
        status: formStatus.value || undefined,
        from: formData.value || undefined,
        to: endData.value || undefined,
        search: formFilter.value || undefined
      })

    }
)

const closeFilter = () => {
  formStatus.value = '';
  formFilter.value = '';
  formData.value = '';
  endData.value = '';
  dataStore.loadOrders('VIGNETTE');
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
  return filteredOrders.value.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
  )
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

const isValidForm = () => {
  const f = itemForm.value;
  return (
      f.amount !== null &&
      f.pageCount !== null &&
      f.receiverName !== null &&
      f.categoryId !== null &&
      f.orderName !== null &&
      f.customerName !== null &&
      f.employees !== null &&
      f.acceptedDate !== null &&
      f.deadline !== null &&
      f.status !== null
  );
};

const submitForm = async () => {
  if (!isValidForm()) return;

  try {

    const payload: OrderCreateDto = {
      ...itemForm.value,
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
  }
}

const itemId = ref<string>('')

const editForm = (item: Order) => {
  isVisible.value = true;
  isEditing.value = true;

  itemForm.value = {
    ...item,
    employees: item.employees?.map(e => e.employeeId) || []
  }
  itemId.value = item.id;
};

const deleteConfirmItem = async () => {
  if (!selectedItem.value) return;
  try {
    await dataStore.deleteOrder(selectedItem.value, 'VIGNETTE')
    Toast.info("Muvoffaqiyatli uchirildi!");
    showConfirmItem.value = false;
    selectedItem.value = null;
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
onMounted(() => {
  if (route.query.status) {
    formStatus.value = route.query.status as string;
  }
})

onMounted(async () => {
  await Promise.all([
      await dataStore.loadOrders('VIGNETTE'),
      await dataStore.loadCategory('VIGNETTE'),
      await dataStore.loadUsers()
  ])
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
