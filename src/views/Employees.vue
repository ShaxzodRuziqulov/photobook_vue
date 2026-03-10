<template>
  <div class="flex p-6 flex-col gap-4 container m-auto w-full h-full">
    <div class="flex bg-white p-4 rounded-xl w-full items-center justify-between">
      <h2 class="text-2xl font-semibold">Xodimlar</h2>
      <CButton
          type="button"
          text="Add user"
          @click="clickVisibleForm"
      />
    </div>
    <CDialog
        :show="visibleShow"
        @close="visibleShow = false"
        bodyClass="!bg-bg-primary px-6 py-4 mt-20 overflow-hidden"
    >
      <form
          class="flex flex-col gap-2 overflow-y-auto max-h-[75vh]"
          @submit.prevent="submitForm"
      >
        <h2 class=" text-2xl font-semibold">
          {{isEditing ? "Xodim ma'lumotlarini uzgartirish" : "Xodim qo'shish"}}
        </h2>
        <AppInput label="F.I.O"
                  type="text"
                  placeholder="Ism kiritng"
                  v-model="form.fullName"
        />
        <AppInput label="Kasbi"
                  type="text"
                  placeholder="Kasbni kiriting"
                  v-model="form.profession"
        />
        <AppInput label="Login"
                  type="text"
                  placeholder="Loginni kiriting"
                  v-model="form.isLogin"
        />
        <AppInput label="Password"
                  type="number"
                  placeholder="123..."
                  v-model="form.isPassword"
        />
        <AppInput label="Phone number"
                  type="number"
                  placeholder="+998 -"
                  v-model="form.phoneNumber"
        />
        <AppSelect
            v-model="form.roles"
            label="Role"
            :options="userRoles"
            disabledValue="Tanlang"
            text-field="text"
            value-field="value"
            is-multiple
        />
<!--        <AppInput-->
<!--            label="Payment method"-->
<!--            type="text"-->
<!--            placeholder="Enter Payment method"-->
<!--            v-model="form.paymentMethod"-->
<!--        />-->
<!--        <AppInput label="Data"-->
<!--                  type="date"-->
<!--                  v-model="form.date"-->
<!--        />-->
<!--        <AppInput-->
<!--            label="Receipt image"-->
<!--            type="file"-->
<!--            accept="image/*"-->
<!--            @change="changeFile($event)"-->
<!--        />-->
<!--        <AppSelect-->
<!--            :options="allItems"-->
<!--            label="All Items"-->
<!--            text-field="name"-->
<!--            value-field="_id"-->
<!--            disabled-value="Select item"-->
<!--            v-model="form.itemId"-->
<!--        />-->
<!--        <AppInput label="Description"-->
<!--                  type="textarea"-->
<!--                  placeholder="Enter Description"-->
<!--                  v-model="form.description"-->
<!--        />-->
        <div class="flex justify-end gap-4 items-center">
          <CButton
              type="button"
              text="Cancel"
              variant="ghost-accent"
              @click="resetForm"
          />
          <CButton
              type="submit"
              text="Submit"
              variant="primary"
          />
        </div>
      </form>
    </CDialog>
    <CDialog
        :show="showModal"
        @close="showModal = false"
        body-class="justify-center bg-blue-800 text-center px-4 pb-8"
    >
      <DeleteConfirm
          title="Ushbu xodimni uchirmoqchimisiz?"
          v-model:show="showModal"
          @confirm="confirmDelete"
      />
    </CDialog>
    <div
        class=" gap-5 flex-col w-full bg-white p-6 rounded-xl h-full"
    >
<!--      <Loading v-if="isLoading"/>-->
      <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
           v-if="allUsers.length"
      >
        <div
            class="flex flex-col rounded-xl p-4 shadow-md gap-4 bg-gradient-to-br from-blue-50 to-purple-50"
            v-for="(user, index) in allUsers"
            :key="index"
        >
          <div class="flex items-center gap-2 justify-between">
            <div class="flex items-center gap-4">
            <span
                class="font-semibold text-xl w-12 h-12 p-4 flex items-center justify-center rounded-full text-white bg-blue-800"
            >
              {{getInitials(user.fullName)}}
            </span>
              <div
                  class="flex flex-col"
              >
                <span class="font-semibold break-all">{{user.fullName}}</span>
                <span class="text-sm text-gray-600 break-all">{{user.profession}}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <CButton
                  is-has-fa-icon
                  fa-class="fas fa-pencil"
                  type="button"
                  size="sm"
                  variant="warning"
                  @click="editItem(user)"
              />
              <CButton
                  is-has-fa-icon
                  fa-class="far fa-trash-alt"
                  type="button"
                  size="sm"
                  variant="danger"
                  @click="deleteItem(user.id)"
              />
            </div>
          </div>
          <div
              class="flex items-end gap-2 justify-between"
          >
            <div class="flex flex-col items-start text-md font-semibold">
              <div>Login: <span class="text-gray-600">{{user.isLogin}}</span></div>
              <div>Parol: <span class="text-gray-600">{{user.isPassword}}</span></div>
              <div
                  class="flex gap-1"
              >
                Role:
                <div class="flex items-center gap-2">
                  <div class="text-gray-600 flex flex-col w-full gap-2"
                       v-for="(role, index) in user.roles"
                       :key="index"
                  >
                    {{role}}
                  </div>
                </div>
              </div>
            </div>
            <div
                class="flex flex-col items-start text-md font-semibold"
            >
              <div class="flex">

              </div>
              <span><i class="fas fa-phone text-blue-600"></i> Tel: {{user.phoneNumber}}</span>
            </div>
          </div>
        </div>
      </div>
      <div
          v-else
          class="flex items-center justify-center w-full text-gray-600 m-auto"
      >
        Xodim topilmadi!
      </div>
    </div>
<!--      allUsers-->


<!--      <div class="grid grid-cols-3 gap-6 p-4">-->
<!--        <div-->
<!--            class="flex flex-col rounded-xl p-4 gap-2 border border-gray-300 bg-white"-->
<!--            v-for="(item, index) in allExpenses"-->
<!--            :key="index"-->
<!--        >-->
<!--          <h2>Product card</h2>-->
<!--          <img-->
<!--              :src="getAvatarUrl(item.receipt_image)"-->
<!--              alt=""-->
<!--              class="object-cover p-1 flex rounded-xl w-full h-20">-->
<!--          <span>Item name: {{item.name}}</span>-->
<!--          <span>Item price: {{item.price}}</span>-->
<!--          <span>Payment method: {{item.paymentMethod}}</span>-->
<!--          <span>Data: {{getDate(item.date)}}</span>-->
<!--          <span>Item: {{getItemName(item.itemId)}}</span>-->
<!--          <span>Description: {{item.description}}</span>-->
<!--          <div class="flex justify-center items-center gap-2">-->
<!--            <CButton-->
<!--            type="button"-->
<!--            text="Edit"-->
<!--            variant="ghost-accent"-->
<!--            @click="editItem(item._id)"-->
<!--            />-->
<!--            <CButton-->
<!--                type="button"-->
<!--                text="Delete"-->
<!--                @click="deleteItem(item._id)"-->
<!--            />-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

<!--      bu rangli input-->
<!--      <div class="flex w-[800px] flex-col bg-white gap-5 p-6">-->
<!--        <span>This is a picture of a horse</span>-->
<!--        <input type="range" min="0" max="1" step="0.1" v-model="changeColor">-->
<!--        {{changeColor}}-->
<!--        <div id="imageItem">-->
<!--          <div :style="{ backgroundColor: `rgba(99, 0, 89, ${changeColor})` }">-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--      -->
  </div>
</template>

<script setup lang="ts">
import {computed, ref, onMounted} from "vue";
import AppInput from "@/components/ui/AppInput.vue";
import CButton from "@/components/CButton.vue";
import CDialog from "@/components/CDialog.vue";
import { useStore } from "@/stores/store";
import {Role, UserForm} from "@/typeModules/useModules";
import Loading from "@/components/Loading.vue";
import DeleteConfirm from "@/components/DeleteConfirm.vue";
import AppSelect from "@/components/ui/AppSelect.vue";

const store = useStore();

const visibleShow = ref(false);
const isLoading = ref(false);
const showModal = ref(false);
const selectedUser = ref('');
const role = ref<Role[]>([])
// const selectedFile = ref<File | null>(null);
const isEditing = ref(false);
// const avatarPreview = ref<string>("");

const allUsers = computed(() => store.state.users);
// const allItems = computed(() => store.state.items);

const form = ref<UserForm>({
  id: '',
  fullName: '',
  profession: '',
  isLogin: '',
  isPassword: '',
  roles: '',
  phoneNumber: null,
  createdAt: null,
  updatedAt: null,
});

const clickVisibleForm = () => {
  visibleShow.value = true;
  form.value = {
    id: '',
    fullName: '',
    profession: '',
    isLogin: '',
    isPassword: '',
    roles: '',
    phoneNumber: null,
    createdAt: null,
    updatedAt: null,
  }
}

const userRoles = ref([
  { id: 0, value: 'USER', text: 'USER' },
  { id: 1, value: 'ADMIN', text: 'ADMIN' },
])

const getInitials = (fullName?: string) => {
  if (!fullName) return ''

  return fullName
      .trim()
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
}


// const getItemName = (itemId: string) => {
//   const item = allItems.value.find(item => item._id === itemId);
//   return item?.name || 'Unknown';
// };

// const changeFile = (event: Event) => {
//   const fileInput = event.target as HTMLInputElement;
//
//   if (!fileInput.files?.length) return;
//
//   selectedFile.value = fileInput.files[0];
//   avatarPreview.value = URL.createObjectURL(selectedFile.value);
// };

// const getAvatarUrl = (path: string | null | undefined) => {
//   if (!path) return "";
  // return path.startsWith("https")
  //     ? path
  //     : `${import.meta.env.VITE_BASE_API}${path}`;
// };

const submitForm = async () => {

  if (!form.value.fullName || !form.value.profession || !form.value.phoneNumber || !form.value.isLogin || !form.value.isPassword || !form.value.roles) {
    return alert("Iltimos formani to'ldiring!");
  }
  isLoading.value = true;
  try {
    if (isEditing.value) {
      await store.updateUser(form.value.id, form.value);
    } else {
    await store.addUser(form.value);
    }

    visibleShow.value = false;
    isEditing.value = false;

    await store.loadGetUsers()
    form.value = {
      id: '',
      fullName: '',
      profession: '',
      isLogin: '',
      isPassword: '',
      roles: '',
      phoneNumber: null,
      createdAt: null,
      updatedAt: null,
    }
    isLoading.value = false;
  } catch (error) {
    console.log(error);
  }
};

const editItem = (user: UserForm) => {
  form.value = { ...user };
  isEditing.value = true;
  visibleShow.value = true;
};

const confirmDelete = async () => {
  try {
    await store.deleteUser(selectedUser.value);
    await store.loadGetUsers()
  } catch (error) {
    console.log(error);
  }
}

const deleteItem = async (id: string) => {
  selectedUser.value = id
  showModal.value = true;
};

const getDate = (date: string | null) => {
  if (!date) return null;
  const data = new Date(date);
  const year = data.getFullYear();
  const month = data.getMonth();
  const day = data.getDate();
  return `${day}.${month}.${year}`;
};

const resetForm = () => {
  visibleShow.value = false;
  closeForm();
};

const closeForm = () => {
  visibleShow.value = false;
  form.value = {
    id: '',
    fullName: '',
    profession: '',
    isLogin: '',
    isPassword: '',
    roles: '',
    phoneNumber: null,
    createdAt: null,
    updatedAt: null,
  }
};

onMounted(async () => {
  isLoading.value = true;
  try {
    await store.loadGetUsers();
    isLoading.value = false;
  }
  catch (error) {
    console.log(error);
  }
});

</script>
<!--<style>-->
<!--#imageItem {-->
<!--  position: relative;-->
<!--  background-image: url("@/assets/white_horse.jpg");-->
<!--  background-size: cover;-->
<!--  width: 300px;-->
<!--  height: 200px;-->
<!--  border: dashed 1px black;-->

<!--  div {-->
<!--    position: absolute;-->
<!--    inset: 0;-->
<!--  }-->
<!--}-->

<!--</style>-->