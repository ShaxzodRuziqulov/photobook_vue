<template>
  <div class="flex flex-col container m-auto gap-2 p-4 min-h-screen w-full">
    <div class="flex flex-col sm:flex-row gap-4 items-center bg-white rounded-xl py-3 px-4 justify-between w-full">
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
        class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-100 rounded-xl p-2 justify-between"
    >
      <div
          class="flex flex-col gap-4 bg-white rounded-xl py-2 px-4 justify-between"
          v-for="(cat, index) in categoryType"
          :key="index"
      >
        <div
            class="flex w-full flex-col border-b gap-1 border-gray-200"
        >
          <h2 class="text-md uppercase font-semibold">{{cat.text}}</h2>
          <span class="text-gray-400">Betlar: <span class="text-sm font-semibold text-gray-400">{{cat.item}}</span></span>
        </div>
        <div
            class="flex gap-4 items-center justify-between"
        >
          <div class="flex flex-col w-full border-r-2 border-gray-200">
            <div class="gap-1 flex flex-col items-start font-semibold">
              <span class="text-gray-600 text-sm flex">Jami</span>
              <div class="flex text-md gap-2 items-center">
                <span class="text-blue-600">
                {{getCategoryCount(cat.value)}}
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
                {{getCount(cat.value)}}
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
                {{getRemaining(cat.value)}}
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
        bodyClass="rounded-lg mt-28 py-4 mb-10 !bg-bg-primary"
    >
      <div
          class="flex flex-col overflow-y-auto"
      >
        <form
            @submit.prevent="submitForm"
            class="flex flex-col gap-3 overflow-y-auto text-md px-4"
        >
          <h2 class=" text-2xl font-semibold">
            {{isEditing ? "Formani uzgartirish" : "Forma qo'shish"}}
          </h2>
          <AppSelect
              v-model="itemForm.categoryName"
              :options="categoryType"
              disabledValue="Tanlang"
              text-field="text"
              value-field="value"
              label="Albom turi"
          />
          <div class="flex w-full gap-2 px-1 items-center justify-between">
            <AppInput
                label="Betlar soni"
                type="number"
                step="2"
                class="w-full"
                placeholder="2,4,6,10,...,"
                v-model="itemForm.pageNumber"
            />
            <AppInput
                type="number"
                class="w-full"
                placeholder="Masalan: 10"
                label="Buyurtma soni"
                v-model="itemForm.amountNumber"
            /><AppInput
                type="number"
                class="w-full"
                placeholder="Masalan: 10"
                label="Bajarish soni"
                v-model="itemForm.processNumber"
            />
          </div>
          <div class="flex items-center justify-between w-full gap-2">
            <AppInput
                type="text"
                placeholder="Masalan: Maktab"
                label="Nomi"
                class="w-full"
                v-model="itemForm.orderName"
            />
            <AppInput
                type="text"
                placeholder="Masalan: Qora koja"
                label="Turi"
                class="w-full"
                v-model="itemForm.itemType"
            />
          </div>
          <div class="flex w-full gap-2 items-center justify-between">
            <AppInput
                type="text"
                v-model="itemForm.customerName"
                placeholder="Ism kiriting"
                label="Mijoz ismi"
                class="w-full"
            />
            <AppInput
                v-model="itemForm.receiverName"
                placeholder="Ism kiriting"
                type="text"
                class="w-full"
                label="Qabul qiluvchi"
            />
          </div>
          <AppSelect
              v-model="itemForm.employeeName"
              :options="allUsers"
              disabledValue="Xodimni tanlang"
              text-field="name"
              value-field="name"
              label="Mas'ul xodim"
          />
          <div
              class="flex items-center w-full gap-2"
          >
            <AppInput
                v-model="itemForm.createdData"
                label="Qabul qilingan sana"
                type="date"
                class="w-full"
            />
            <AppInput
                label="Tugash sanasi"
                type="date"
                class="w-full"
                v-model="itemForm.termData"
            />
          </div>
          <div
              class="flex items-center w-full gap-2"
          >
            <AppSelect
                v-model="itemForm.status"
                :options="itemStatus"
                disabledValue="Xolatni tanlang"
                label="Status"
                text-field="text"
                value-field="value"
            />
<!--            <AppInput-->
<!--                label="Image"-->
<!--                type="file"-->
<!--                class="w-full"-->
<!--                multiple="true"-->
<!--                @change="changeImage($event)"-->
<!--            />-->
          </div>
          <FileUpload
              ref="fileUploadRef"
              mode="advanced"
              :customUpload="true"
              :auto="false"
              :multiple="false"
              accept="image/*"

              chooseLabel="Rasm tanlash"
              :showUploadButton="false"
              :showCancelButton="false"
              :showClearButton="true"

              @select="onFileSelect"
              @clear="onFileRemove"
          />
          <div
              v-if="isEditing && itemForm.imageUrl && !removedOldImage"
              class="mt-3 relative w-32 h-32"
          >
            <img
                alt=""
                :src="itemForm.imageUrl"
                class="w-full h-full object-cover rounded-xl border"
            />
            <button
                type="button"
                @click="onFileRemove"
                class="absolute cursor-pointer -top-2 -right-2 hover:bg-red-600 bg-red-500 text-white w-7 h-7 rounded-full"
            >
              ✕
            </button>
          </div>
          <div class="flex flex-col sm:flex-row items-stretch lg:flex-row gap-2 sm:items-center justify-end w-full">
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
    <div class="bg-white w-full flex flex-col px-4 py-2 gap-3 min-h-0 rounded-xl shadow">
      <div class="flex flex-col w-full border-b-2 border-gray-200">
        <h2 class="text-2xl font-semibold">Buyurtmalar jadvali</h2>
        <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 w-[80%] items-end gap-4 py-2">
          <AppSelect
              v-model="formStatus"
              :options="itemStatus"
              disabledValue="Tanlang"
              label="Holat"
              has-reset
              resetText="Hammasi"
          />
          <AppInput
              v-model="formFilter"
              type="search"
              label="Qidirish"
              placeholder="Qidirish..."
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
          <thead class="bg-gray-200 rounded-2xl border-b border-gray-600 tracking-wider">
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
            <th class="p-2 text-start">Operations</th>
          </tr>
          </thead>
          <tbody v-if="filteredAlbums.length > 0">
          <tr
              class="border-b border-gray-600 hover:bg-gray-100"
              v-for="(album, index) in filteredAlbums" :key="index"
          >
            <td class="py-2 px-3">{{ index + 1 }}</td>
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
                  :src="album.imageUrl" alt=""
              />
            </td>
            <td class="p-2">{{ album.customerName }}</td>
            <td class="p-2">{{ album.receiverName }}</td>
            <td class="p-2">{{ album.employeeName }}</td>
            <td class="py-2 px-4">
              <div class="flex flex-col gap-2">
                <div class="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
                <span
                    v-if="album.processNumber && album.amountNumber"
                    class="block h-full bg-blue-600 transition-all duration-300"
                    :style="{
                    width: ((album.processNumber) / album.amountNumber * 100) + '%'
                  }"
                ></span>
                </div>
                <div class="text-sm mt-1 flex items-center justify-between text-gray-600">
                  <span>{{ album.processNumber || 0 }} / {{ album.amountNumber }}</span>
                  <span>{{album.pageNumber || 0}}-Bet</span>
                </div>
              </div>
            </td>
            <td class="py-2 px-1">{{ formatDate(album.createdData) }}</td>
            <td class="p-2">{{ formatDate(album.termData) }}</td>
            <td class="p-2"
            >
            <span
                :class="[statusColor[album.status],
                  'rounded-xl px-3 py-1 font-semibold text-sm',
                ]">
              {{ album.status }}
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
import { AllOrders } from "@/typeModules/useModules";
import { useToast } from "vue-toastification";
import DeleteConfirm from "@/components/DeleteConfirm.vue";
import FileUpload from "primevue/fileupload";
// import Image from 'primevue/image'

const Toast = useToast();
const dataStore = useStore();

// const allUsers: ComputedRef = computed(() => dataStore.state.users);

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

const onFileSelect = (event: any) => {
  const file = event.files[0]
  if (event.files.length > 1) {
    fileUploadRef.value.clear()
    return
  }
  selectedFiles.value = file;

  previewUrl.value = URL.createObjectURL(file)

  itemForm.value.imageUrl = previewUrl.value
}

const onFileRemove = () => {
  selectedFiles.value = [];
  previewUrl.value = null;
  itemForm.value.imageUrl = ""
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

const filteredAlbums = computed(() => {
  let data = dataStore.state.albums

  if (formFilter.value) {
    const search = formFilter.value.toLowerCase()

    data = data.filter(item =>
        item.orderName?.toLowerCase().includes(search) ||
        item.categoryName?.toLowerCase().includes(search) ||
        item.customerName?.toLowerCase().includes(search) ||
        item.employeeName?.toLowerCase().includes(search) ||
        item.amountNumber?.toFixed().includes(search) ||
        item.pageNumber?.toFixed().includes(search) ||
        item.receiverName?.toLowerCase().includes(search)
    )
  }

  // return [...data].sort((a: any, b: any) => new Date(b.createdData).getMilliseconds() - new Date(a.createdData).getMilliseconds());
  return [...data].sort((a, b) => {
    const dateA =  new Date(a.createdData).getMilliseconds();
    const dateB =  new Date(b.createdData).getMilliseconds();
    return dateB - dateA  // oxirgi qo'shilgan birinchi
  })
})

const allUsers = ref([
  {id: 1, name: 'Ali Usmonov'},
  {id: 2, name: 'Elyor Usmonov'},
  {id: 3, name: 'Akbar Salimov'},
  {id: 4, name: 'Murod Xalilov'},
  {id: 5, name: 'Samandar Kamolov'},
])

const itemForm = ref<AllOrders>({
  id: '',
  categoryName: '',
  orderName: '',
  itemType: '',
  processNumber: null,
  pageNumber: null,
  amountNumber: null,
  customerName: '',
  receiverName: '',
  employeeName: '',
  termData: null,
  status: '',
  imageUrl: '',
  // doneData: null,
  createdData: '',
  createdAt: null,
  updatedAt: null,
})

// const changeFilter = (type: 'search' | 'status', value: string ) => {
//   if (type === 'search') {
//     formFilter.value = value
//   } else if (type === 'status') {
//     formStatus.value = value;
//   }
//   dataStore.loadGetAlbum()
// }
const filters = computed(() => ({
  status: formStatus.value,
  from: formData.value,
  to: endData.value
}))

watch(
    filters,
    async (newFilters) => {
      dataStore.state.albums = await dataStore.loadCollection<AllOrders>(
          "albums",
          newFilters
      )
    },
    { deep: true }
)

watch( () => formFilter.value, async (newStatus) => {
  await dataStore.loadCollection(newStatus);
})

const closeFilter = () => {
  formStatus.value = '';
  formFilter.value = '';
  formData.value = '';
  endData.value = '';
  dataStore.loadGetAlbum();
}

const categoryType = [
  { id: 1, value: 'A3 Albom', text: 'A3 Albom', item: '10, 20, 30, 40'},
  { id: 2, value: 'A3 Kitob (knijniy)', text: 'A3 Kitob (knijniy)', item: '10, 20, 30, 40'},
  { id: 3, value: "O'rtacha (Sredniy)", text: "O'rtacha (Sredniy)", item: '10, 20, 30, 40' },
  { id: 4, value: 'Kichik Albom', text: 'Kichik Albom', item: '6, 8, 10, 12, 14, 16, 18, 20, 30'},
  { id: 5, value: 'Kichik Kitob (knijniy)', text: 'Kichik Kitob (knijniy)', item: '6, 8, 10, 12, 14, 16, 18, 20, 30' },
  { id: 6, value: 'Ikki tomonlama', text: 'Ikki tomonlama', item: '6, 8, 10, 12, 14, 16' },
]

const pageProcessed = computed(() => {
  return filteredAlbums.value.reduce(
      (sum, item) => sum + (item.amountNumber || 0),
      0
  )
})

const getCategoryCount = (value: string) => {
  return filteredAlbums.value
      .filter(item => item.categoryName === value)
      .reduce((total, item) => total + (item.amountNumber || 0), 0)
}

const getCount = (value: string) => {
  return filteredAlbums.value
      .filter(item => item.categoryName === value)
      .reduce((total, item) => total + (item.processNumber || 0), 0)
}

const getRemaining = (value: string) => {
  return filteredAlbums.value
      .filter(item => item.categoryName === value)
      .reduce((total, item) => {
        const totalNum = item.amountNumber || 0
        const processed = item.processNumber || 0
        return total + (totalNum - processed)
      }, 0)
}

const itemStatus = ref( [
  { value: 'Kutilmoqda', text: 'Kutilmoqda' },
  { value: 'Jarayonda', text: 'Jarayonda' },
  { value: 'Bajarilgan', text: 'Bajarilgan' },
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
  Kutilmoqda: 'bg-yellow-100 text-yellow-700',
  Jarayonda: 'bg-green-100 text-green-700',
  Bajarilgan: 'bg-blue-100 text-blue-700',
}

const isValidForm = () => {
  const f = itemForm.value;
  return (
      f.amountNumber !== null &&
      // f.processNumber !== null &&
      f.pageNumber !== null &&
      f.receiverName !== null &&
      f.categoryName !== null &&
      f.orderName !== null &&
      f.customerName !== null &&
      f.employeeName !== null &&
      f.createdData !== null &&
      f.termData !== null &&
      f.status !== null
  );
};

const submitForm = async ( ) => {
  try {
  if (!isValidForm()) return;

  if (selectedFiles.value.length > 0) {
    itemForm.value.imageUrl = URL.createObjectURL( selectedFiles.value[0] );
  }
    filteredAlbums.value.push(itemForm.value);

    if (isEditing.value) {
      await dataStore.updateAlbum(itemForm.value.id, itemForm.value);
      Toast.success( "Yangilandi!");
    } else {
     await dataStore.addAlbum(itemForm.value);
      Toast.success( "Qo'shildi!");
    }
    await dataStore.loadGetAlbum()
    resetForm();
    isVisible.value = false;
    isEditing.value = false;
  }
  catch (error) {
    console.log("Error", error);
  }
}

const editForm = async (item: AllOrders): Promise<void> => {
  isVisible.value = true;
  isEditing.value = true;
  itemForm.value = { ...item };
};

const deleteConfirmItem = async () => {
  if (!selectedItem.value) return;
  try {
    await dataStore.deleteAlbum(selectedItem.value)
    Toast.info("Successfully deleted!");
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
    id: '',
    // imgUrl: null,
    categoryName: '',
    orderName: '',
    itemType: '',
    processNumber: null,
    pageNumber: null,
    amountNumber: null,
    customerName: '',
    receiverName: '',
    employeeName: '',
    termData: null,
    status: '',
    imageUrl: '',
    // doneData: null,
    createdData: '',
    createdAt: null,
    updatedAt: null,
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
  await dataStore.loadGetAlbum()
  // await Promise.all([
  //     // await dataStore.loadCategories(),
  // ])

})

</script>