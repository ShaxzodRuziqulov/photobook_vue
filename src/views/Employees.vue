<template>
  <div class="flex p-6 flex-col gap-4 container m-auto w-full h-full">
    <div class="flex bg-white p-4 rounded-xl w-full items-center justify-between">
      <div class="flex items-center gap-2">
        <CButton
            type="button"
            text="Ortga"
            is-has-fa-icon
            variant="ghost-accent"
            faClass="fa-solid fa-arrow-left"
            @click="router.back()"
        />
        <span class="text-xl font-semibold">Xodimlar</span>
      </div>
      <CButton
          type="button"
          text="Add user"
          @click="clickVisibleForm"
      />
    </div>
    <CDialog
        :show="visibleShow"
        @close="visibleShow = false"
        bodyClass="!bg-bg-primary mt-20 overflow-hidden"
    >
      <form
          class="flex flex-col gap-2 overflow-y-auto px-6 py-4 max-h-[75vh]"
          @submit.prevent="submitForm"
      >
        <h2 class=" text-2xl font-semibold">
          {{isEditing ? "Xodim ma'lumotlarini uzgartirish" : "Xodim qo'shish"}}
        </h2>
        <AppInput label="Ism"
                  type="text"
                  placeholder="Ism kiriting"
                  v-model="form.lastName"
        />
        <AppInput label="Familiya"
                  type="text"
                  placeholder="Familiya kiriting"
                  v-model="form.firstName"
        />
        <AppInput label="User nomi"
                  type="text"
                  placeholder="user kiriting"
                  v-model="form.username"
        />
        <AppInput label="Kasbi"
                  type="text"
                  placeholder="Kasbni kiriting"
                  v-model="form.profession"
        />
        <AppInput label="Password"
                  type="text"
                  placeholder="123..."
                  v-model="form.password"
        />
        <AppInput label="Phone number"
                  type="text"
                  placeholder="+998 -"
                  v-model="form.phone"
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
        <AppInput
            label="Receipt image"
            type="file"
            accept="image/*"
            @change="changeFile($event)"
        />
<!--        <AppSelect-->
<!--            :options="allItems"-->
<!--            label="All Items"-->
<!--            text-field="name"-->
<!--            value-field="_id"-->
<!--            disabled-value="Select item"-->
<!--            v-model="form.itemId"-->
<!--        />-->
        <AppInput label="Bio"
                  type="textarea"
                  placeholder="Enter Description"
                  v-model="form.bio"
        />
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
        :show="selectedRole"
        @close="selectedRole = false"
        body-class="justify-center bg-blue-800 text-center px-4 pb-8"
    >
      <div
          class="shadow-xl rounded-2xl p-6 text-gray-800 max-w-2xl mx-auto transition-colors"
      >
        <form
            @submit.prevent="saveRole"
            class="w-full"
        >
          <p class=" transition-all duration-200 font-semibold">
            {{ selectedUsers?.lastName }} {{ selectedUsers?.firstName }}
          </p>
          <AppSelect
              v-model="selectedRoles"
              :options="roles"
              disabledValue="Role tanlang"
              text-field="name"
              value-field="id"
              isMultiple
          />
          <div class="flex mt-4 gap-2 items-center justify-end">
            <CButton
                type="button"
                text="Cancel"
                variant="ghost-accent"
                @click="selectedRole = false"
            />
            <CButton
                type="submit"
                text="Saqlash"
                variant="primary"
            />
          </div>
        </form>
      </div>
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
        class="animate-fade-in gap-5 flex-col w-full bg-white p-6 rounded-xl h-full"
    >
      <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
           v-if="allUsers.items.length > 0"
      >
        <div
            class="flex flex-col rounded-xl p-4 shadow-md gap-4 bg-gradient-to-br from-blue-50 to-purple-50"
            v-for="(user, index) in allUsers.items"
            :key="index"
        >
          <div class="flex items-center gap-2 justify-between">
            <div class="flex items-center gap-4">
            <span
                class="font-semibold text-xl p-4 flex items-center justify-center rounded-full "
            >
              <span
                  v-if="user.avatarUrl"
                  class="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                <img
                    :src="user.avatarUrl"
                    class="w-full h-full object-cover"
                    alt=""
                />
              </span>
              <span v-else
                    class="font-semibold text-xl bg-cover w-12 h-12 p-4 flex items-center justify-center rounded-full bg-blue-800 text-white"
              >
                  {{ user.firstName?.charAt(0)?.toUpperCase() || 'X' }}{{ user.lastName?.charAt(0)?.toUpperCase() || '' }}
              </span>
            </span>
              <div
                  class="flex flex-col"
              >
                <span class="font-semibold">{{user.firstName}}</span>
                <span class="font-semibold">{{user.lastName}}</span>
                <span class="text-sm text-gray-600 break-all">{{user.profession}}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <CButton
                  type="button"
                  text="Role"
                  variant="ghost-accent"
                  @click="changeRole(user)"
              />
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
              <span>User:  {{user.username}}</span>
              <div>Parol: <span class="text-gray-600">{{user.password}}</span></div>
              <div
                  class="flex flex-col gap-1"
              >
                <div class="flex items-center gap-2">
                  Role:
                  <div class="text-gray-600 flex flex-col w-full gap-2"
                       v-for="(role, index) in user.roles"
                       :key="index"
                  >
                    {{role.name}}
                  </div>
                </div>
                <div class="flex">
                 Ega: {{user.bio}}
                </div>
                <span><i class="fas fa-phone text-blue-600"></i> Tel: {{user.phone}}</span>

              </div>
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
  </div>
</template>

<script setup lang="ts">
import {computed, ref, onMounted, ComputedRef, Ref} from "vue";
import AppInput from "@/components/ui/AppInput.vue";
import CButton from "@/components/CButton.vue";
import CDialog from "@/components/CDialog.vue";
import { useStore } from "@/stores/store";
import {Role, UserForm} from "@/typeModules/useModules";
import DeleteConfirm from "@/components/DeleteConfirm.vue";
import AppSelect from "@/components/ui/AppSelect.vue";
import { useRouter } from "vue-router";
import axiosInstance from "@/axios";
import {authService} from "@/service/authService";
import {useToast} from "vue-toastification";

const Toast = useToast();
const router = useRouter();
const store = useStore();
const loadStore = authService()

const visibleShow = ref(false);
const isLoading = ref(false);
const showModal = ref(false);
const selectedUser = ref<string | null>(null);
const selectedUsers = ref<UserForm | null>(null);
const selectedUserRoleId = ref<string | null>(null);
const selectedRoles: Ref = ref<string[]>([]);
const selectedRole = ref(false)
const roles = ref<Role[]>([]);
const selectedFile = ref<File | null>(null);
const isEditing = ref(false);
const avatarPreview = ref<string>("");

const allUsers: ComputedRef = computed(() => store.state.user);

const form = ref<UserForm>({
  id: '',
  firstName: '',
  lastName: '',
  username: '',
  profession: '',
  password: '',
  avatarUrl: '',
  phone: null,
  bio: '',
  isActive: true,
  uploadId: '',
  roles: []
});

const clickVisibleForm = () => {
  visibleShow.value = true;
  form.value = {
    id: '',
    firstName: '',
    lastName: '',
    username: '',
    profession: '',
    password: '',
    avatarUrl: '',
    phone: null,
    bio: '',
    isActive: true,
    uploadId: '',
    roles: []
  }
}

// const getItemName = (itemId: string) => {
//   const item = allItems.value.find(item => item._id === itemId);
//   return item?.name || 'Unknown';
// };

const changeFile = (event: Event) => {
  const fileInput = event.target as HTMLInputElement;

  if (!fileInput.files?.length) return;

  selectedFile.value = fileInput.files[0];
  avatarPreview.value = URL.createObjectURL(selectedFile.value);
};

const uploadAvatar = async () => {
  if (!selectedFile.value) return null

  const formData = new FormData()
  formData.append("file", selectedFile.value)

  const { data } = await axiosInstance.post("/api/v1/uploads", formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
  )

  return data.url
}



const submitForm = async () => {

  isLoading.value = true;
  try {
    const uploadUrl = await uploadAvatar();

    if (uploadUrl) {
      form.value.avatarUrl = uploadUrl
    }
    if (isEditing.value) {
      await store.updateUser(form.value.id, form.value);
    } else {
    await store.addUser(form.value);
    }

    visibleShow.value = false;
    isEditing.value = false;

    await store.loadUsers()
    form.value = {
      id: '',
      firstName: '',
      lastName: '',
      username: '',
      profession: '',
      password: '',
      avatarUrl: '',
      phone: null,
      bio: '',
      isActive: false,
      uploadId: '',
      roles: []
    }
    isLoading.value = false;
  } catch (error) {
    console.log(error);
  }
};


const saveRole = async () => {
  if (!selectedRoles.value.length || !selectedUserRoleId.value) return;

  try {

    await loadStore.loadChangeRole(
        selectedUserRoleId.value,
        selectedRoles.value
    )

    Toast.success("Role yangilandi")
    selectedRole.value = false
    selectedRoles.value = []
    await store.loadUsers()

  } catch (error) {
    console.log(error)
  }
}

const changeRole = async (user: UserForm) => {
  selectedUserRoleId.value = user.id
  selectedUsers.value = user

  selectedRoles.value = user.roles?.map(role => String(role.id)) || [];

  if (!roles.value.length) {
    await loadStore.loadRole()
  }

  selectedRole.value = true
}

const editItem = (user: UserForm) => {
  form.value = { ...user };
  isEditing.value = true;
  visibleShow.value = true;
};

const confirmDelete = async () => {
  if (!selectedUser.value) return;

  try {
    await store.deleteUser(selectedUser.value);
    showModal.value = false;
    console.log('User delete',selectedUser.value);
    selectedUser.value = null
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
    firstName: '',
    lastName: '',
    username: '',
    profession: '',
    password: '',
    avatarUrl: '',
    phone: null,
    bio: '',
    isActive: false,
    uploadId: '',
    roles: []
  }
};

const loadRole = async () => {
  try {
    const res = await loadStore.loadRole()
    roles.value = res.data
  }
  catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  isLoading.value = true;
  try {
    await store.loadUsers();
    await loadRole()
    isLoading.value = false;
  }
  catch (error) {
    console.log(error);
  }
});

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