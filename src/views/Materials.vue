<template>
  <div class="flex flex-col container m-auto h-full w-full p-6 gap-6">
    <div class="w-full flex bg-white p-4 rounded-xl items-center justify-between">
      <div class="flex items-center gap-2">
        <CButton
            type="button"
            text="Ortga"
            is-has-fa-icon
            variant="ghost-accent"
            faClass="fa-solid fa-arrow-left"
            @click="router.back()"
        />
        <span class="text-xl font-semibold">Xom ashyolar</span>
      </div>
      <CButton
          type="button"
          text="+Add"
          @click="addTodoItem"
      />
    </div>
    <CDialog
        title="Todo form"
        :show="visibleTodo"
        @close="visibleTodo = false"
        bodyClass="rounded-lg mt-20 !bg-bg-primary"
    >
      <form
          class="flex flex-col w-full p-6 gap-6"
          @submit.prevent="createMaterial"
      >
        <AppInput label="Tovar nomi"
                  type="text"
                  placeholder="Tovar nomini kiriting"
                  v-model="form.itemName"
        />
        <AppInput label="Tovar turi"
                  type="text"
                  placeholder="Tovar turini kiriting"
                  v-model="form.itemType"
        />
        <AppInput label="Miqdori"
                  type="number"
                  placeholder="1,2,3 ..."
                  v-model="form.quantity"
        />
        <AppInput label="Birligi"
                  type="text"
                  placeholder="masalan: Dona, Pachka, Quti, Uram"
                  v-model="form.unitName"
        />

        <div class="flex items-center gap-4 justify-center mt-4">
          <CButton
              type="button"
              text="Cancel"
              variant="ghost-accent"
              @click="closeForm"
          />
          <CButton
              type="submit"
              text="Submit"
          />
        </div>
      </form>
    </CDialog>
    <CDialog
        :show="showForm"
        @close="showForm = false"
        body-class="justify-center bg-blue-800 text-center px-4 pb-8"
    >
      <DeleteConfirm
          v-model:show="showForm"
          title="Ushbu buyumni uchirmoqchimisiz?"
          @confirm="confirmDelete"
      />
    </CDialog>
    <div
        class="flex bg-white rounded-xl flex-col w-full p-4 gap-6"
    >
      <div
          v-if="materialItems.length"
          class=" grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-4"
      >
        <div
            class="flex flex-col gap-2 shadow-md rounded-xl p-4  bg-gradient-to-br from-blue-50 to-purple-50"
            v-for="(item, index) in materialItems"
            :key="index"
        >
          <div
              class="flex items-start justify-between"
          >
            <div>
              <p class="text-xl break-all font-semibold">{{item.itemName}}</p>
              <p class="text-sm break-all text-gray-600">{{item.itemType}}</p>
            </div>
            <div class="flex items-center gap-4"
            >
              <CButton
                  type="button"
                  is-has-fa-icon
                  fa-class="fas fa-pencil"
                  variant="warning"
                  @click="editItem(item)"
              />
              <CButton
                  type="button"
                  is-has-fa-icon
                  fa-class="fas fa-trash"
                  variant="danger"
                  @click="deleteItem(item.id)"
              />
            </div>
          </div>
          <div
              class="flex items-center justify-between"
          >
            <div
                class="flex items-center text-green-700 text-2xl gap-2 font-semibold"
            >
              <span class="break-all">{{item.quantity}}</span>
              <span class="break-all">{{item.unitName}}</span>
            </div>
            <div v-if="item.updatedAt">
<!--              <p>Yaratildi: {{dataItem(item.createdAt)}}</p>-->
              <p>Yangilandi: {{dataItem(item.updatedAt)}}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="flex w-full items-center justify-center">
        Tovar topilmadi!
      </div>
    </div>
<!--    <div class="w-full relative h-40 items-center flex overflow-hidden">-->

      <!-- Left Button -->
<!--      <button-->
<!--          @click="prev"-->
<!--          class="absolute left-1 w-10 h-10 text-3xl items-center flex justify-center top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full z-10"-->
<!--      >-->
<!--        ‹-->
<!--      </button>-->

      <!-- Right Button -->
<!--      <button-->
<!--          @click="next"-->
<!--          class="absolute right-2 text-3xl flex px-5 items-start text-start justify-center h-10 w-10 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full z-10"-->
<!--      >-->
<!--        ›-->
<!--      </button>-->

      <!-- Wrapper -->
<!--      <div class="flex w-[1640px] transition-transform duration-500"-->
<!--           :style="{ transform: `translateX(-${activeIndex * cardWidth}px)` }">-->
<!---->
<!--        <div-->
<!--            v-for="(card, i) in cards"-->
<!--            :key="i"-->
<!--            class="min-w-[300px] max-w-[600px] p-4 m-2 bg-white rounded-xl shadow"-->
<!--        >-->
<!--          <h3 class="text-xl font-semibold">{{ card.title }}</h3>-->
<!--          <p class="mt-2 text-gray-600">{{ card.text }}</p>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>



<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import { useStore } from '@/stores/store'
import {IItems} from "@/typeModules/useModules";
import CButton from "@/components/CButton.vue";
import CDialog from "@/components/CDialog.vue";
import AppInput from "@/components/ui/AppInput.vue";
import DeleteConfirm from "@/components/DeleteConfirm.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useStore();

const visibleTodo = ref(false);
const selectedId = ref<string | null>(null);
const showForm = ref(false);
// const cards = ref([
//   { title: "Card 1", text: "Content 1" },
//   { title: "Card 2", text: "Content 2" },
//   { title: "Card 3", text: "Content 3" },
//   { title: "Card 4", text: "Content 4" },
//   { title: "Card 5", text: "Content 4" },
//   { title: "Card 6", text: "Content 4" },
//   { title: "Card 7", text: "Content 4" },
//   { title: "Card 8", text: "Content 4" },
//   { title: "Card 9", text: "Content 9" },
// ]);

// Bitta card eni (CSS bilan bir xil bo‘lishi kerak)
// const cardWidth = 120 + 32; // 300px + margin(16 + 16)

// const activeIndex = ref(0);

// const next = () => {
//   if (activeIndex.value < cards.value.length - 1) {
//     activeIndex.value++;
//   }
// };

// const prev = () => {
//   if (activeIndex.value > 0) {
//     activeIndex.value--;
//   }
// };

const addTodoItem = () => {
  resetForm()
  visibleTodo.value = true;
}

const materialItems = computed(() => store.state.items);

const form = ref<IItems>({
  id: null,
  itemName: '',
  itemType: '',
  unitName: '',
  quantity: null,
  createdAt: null,
  updatedAt: null,
})

const resetForm = () => {
  form.value = {
    id: '',
    itemName: '',
    itemType: '',
    unitName: '',
    quantity: null,
    createdAt: null,
    updatedAt: null,
  }
}

const createMaterial = async () => {
  try {
    if (form.value.id) {
      await store.updateMaterial(form.value.id, form.value);
    } else {
      const { id, ...formData } = form.value;
     await store.addMaterial(formData)
    }
    await store.loadMaterials()
    visibleTodo.value = false;
    closeForm();
  }
  catch (error) {
    console.log(error);
  }
}

const editItem = (item: IItems) => {
  form.value = { ...item }
  visibleTodo.value = true;
};

const confirmDelete = async () => {
  try {
    await store.deleteMaterial(selectedId.value);
    await store.loadMaterials()
  }
  catch (error) {
    console.log(error);
  }
}

const deleteItem = async (id: string | null) => {
  selectedId.value = id
  showForm.value = true
}

const closeForm = () => {
  visibleTodo.value = false;
  resetForm()
}

const dataItem = (inputDate: string | number | Date | undefined | null) => {
  if (!inputDate) return '';

  const data = new Date(inputDate);
  if (Number.isNaN(data.getTime())) return String(inputDate);

  const monthName = [
    "Yan", "Fev", "Mar", "Apr", "May", "Iyn",
    "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"
  ];

  const minutes = data.getMinutes();
  const hours = data.getHours();
  const day = data.getDate().toString().padStart(2, "0");
  const month = monthName[data.getMonth()];
  const year = data.getFullYear();

  return `${day} ${month} ${year} ${hours}:${minutes}`;
};

const pagination =ref({
  page: 1,
  size: 10,
})

watch(() => pagination.value.page, () => {
  // getTodoItems()
})

// const allTodos = ref([])
// const getTodoItems = async () => {
//   const paging = {
//     page: pagination.value.page,
//     size: pagination.value.size,
//   }
//   // const response = await axiosInstance.post(`/api/todo/paging`, paging);
//   // store.state.todos = response.data.res;
//   // allTodos.value = response.data.res;
//   // console.log('Itemlar', response.data.res);
//   // pagination.value.page = response.data.page;
// };
onMounted(async () => {
  await store.loadMaterials()
})

</script>

<style scoped>

</style>