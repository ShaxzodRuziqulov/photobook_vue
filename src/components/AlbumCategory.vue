<template>
  <div class="space-y-6">
    <div class="flex bg-white p-3 rounded-2xl shadow-lg items-center justify-between">
      <div class="flex items-center">
        <h2 class="text-xl font-bold flex items-center text-gray-500 gap-3">
          <i class="fa-solid fa-book text-blue-500"></i>
          Albomlar
        </h2>
      </div>
      <CButton
          text="Yangi qo'shish"
          type="button"
          @click="openModal()"
      />
    </div>
    <CDialog
        :show="showConfirmItem"
        @close="showConfirmItem = false"
        body-class="justify-center bg-blue-800 text-center px-4 pb-8"
    >
      <DeleteConfirm
          v-model:show="showConfirmItem"
          @confirm="deleteConfirmItem"
          title="Siz ushbu categoriyani uchirmoqchimisiz?"
      />
    </CDialog>

    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table
            v-if="alCategories.length > 0"
            class="w-full text-sm">
          <colgroup>
            <col style="width: 5%">
            <col style="width: 18%">
            <col style="width: 18%">
            <col style="width: 18%">
            <col style="width: 18%">
          </colgroup>
          <thead class="bg-gray-300 border-b border-gray-200">
          <tr>
            <th class="text-left py-4 px-6 font-semibold">№</th>
            <th class="text-left py-4 px-6 font-semibold">Nomi</th>
            <th class="text-left py-4 px-6 font-semibold">Betlar</th>
            <th class="text-left py-4 px-6 font-semibold">Ulchami</th>
            <th class="text-left py-4 px-6 font-semibold">Amallar</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(vin, index) in alCategories"
              :key="index"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td class="py-4 px-6 text-gray-600">{{ index + 1 }}</td>
            <td class="py-4 px-6">
              <div class="font-semibold text-gray-800">{{ vin.name }}</div>
            </td>
            <td class="py-4 px-6">
              {{ vin.pageNumber }}
            </td>
            <td class="py-4 px-6">{{vin.itemSize}}</td>
            <td class="py-4 px-6 text-right items-center flex">
              <button
                  @click="editItem(vin)"
                  class="text-blue-600 cursor-pointer hover:text-blue-800 mr-3 transition-colors"
                  title="Tahrirlash"
              >
                <i class="fa-solid fa-pencil"></i>
              </button>
              <button
                  @click="deleteItem(vin.id)"
                  class="text-red-600 hover:text-red-800 cursor-pointer transition-colors"
                  title="O'chirish"
              >
                <i class="fas fa-trash-can"></i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>

        <div v-else class="text-center py-16">
          <p class="text-gray-500 text-lg font-semibold">Albom topilmadi !</p>
        </div>
      </div>
    </div>

    <div
        v-if="showModal"
        @click.self="closeModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div class="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 class="text-xl font-bold text-gray-800">
            {{ isEditing ? "Formani Tahrirlash" : "Forma Qo'shish" }}
          </h3>
          <button @click="closeModal" class="cursor-pointer text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center border border-gray-600 rounded-full">
            <i class="fa-solid fa-close text-xl"></i>
          </button>
        </div>

        <form @submit.prevent="saveForm" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Nomi <span class="text-red-500">*</span>
            </label>
            <input
                v-model="form.name"
                type="text"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                placeholder="Masalan: A3 albom"
            >
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Betlar Soni <span class="text-red-500">*</span>
            </label>
            <input
                v-model="form.pageNumber"
                type="text"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                placeholder="2,4,6,8, ..."
            >
          </div>
          <AppInput label="Ulchami"
                    type="text"
                    placeholder="20x30"
                    v-model="form.itemSize"
          />

          <div class="flex gap-3 pt-4">
            <button
                type="button"
                @click="closeModal"
                class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold transition-all"
            >
              Bekor qilish
            </button>
            <button
                type="submit"
                class="flex-1 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all"
            >
              {{ isEditing ? 'Yangilash' : 'Saqlash' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import CButton from "@/components/CButton.vue";
import { useStore } from "@/stores/store";
import AppInput from "@/components/ui/AppInput.vue";
import { AllCategory } from "@/typeModules/useModules";
import DeleteConfirm from "@/components/DeleteConfirm.vue";
import CDialog from "@/components/CDialog.vue";


const dataStore = useStore();
const alCategories = computed(() => dataStore.state.alCategory);

const showModal = ref(false);
const isEditing = ref(false);
const selectedId = ref('');
const showConfirmItem = ref(false);


const form = ref<AllCategory>({
  id: '',
  name: '',
  pageNumber: null,
  itemSize: null,
  createdAt: null,
  updatedAt: null,
});

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  form.value = {
    id: '',
    name: '',
    pageNumber: null,
    itemSize: null,
    createdAt: null,
    updatedAt: null,
  }
  showModal.value = false;
  isEditing.value = false;
};

const saveForm = async () => {
  try {
    if (form.value.id) {
      await dataStore.updateAlCategory(form.value.id, form.value);
    } else {
      await dataStore.addAlCategory(form.value);
    }
    await dataStore.loadAlbumCategories();
  }
  catch (error) {
    console.log(error)
  }

  closeModal();
};

const editItem = (item: AllCategory) => {
  isEditing.value = true;
  showModal.value = true;
  form.value = { ...item };
}

const deleteConfirmItem = async () => {
  try {
    await dataStore.deleteAlCategory(selectedId.value);
    showConfirmItem.value = false;
  }
  catch (error) {
    console.log(error)
  }
}

const deleteItem = async (id: string) => {
  selectedId.value = id;
  showConfirmItem.value = true;
};

onMounted(() => {
  dataStore.loadAlbumCategories();
})
</script>