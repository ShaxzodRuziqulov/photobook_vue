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
          text="Xodim qo'shish"
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

        <div v-if="avatarPreview || form.avatarUrl" class="flex items-center gap-3">
          <img
              :src="avatarPreview || getAvatarUrl(form.avatarUrl)"
              class="w-16 h-16 rounded-full object-cover border"
              alt="Avatar preview"
          />
          <CButton
              type="button"
              text="Rasmni o'chirish"
              variant="danger"
              size="sm"
              @click="removeAvatar"
          />
        </div>
        <AppInput
            label="Receipt image"
            type="file"
            accept="image/*"
            @change="changeFile($event)"
        />
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
              :disabled="isLoading"
          />
        </div>
      </form>
    </CDialog>

    <CDialog
        :show="selectedRole"
        @close="selectedRole = false"
        body-class="justify-center bg-blue-800 text-center px-4 pb-8"
    >
      <div class="shadow-xl rounded-2xl p-6 text-gray-800 max-w-2xl mx-auto transition-colors">
        <form @submit.prevent="saveRole" class="w-full">
          <p class="transition-all duration-200 font-semibold">
            {{ selectedUsers?.lastName }} {{ selectedUsers?.firstName }}
          </p>
          <AppSelect
              v-model="selectedRoles"
              :options="rolesOptions"
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

    <div class="animate-fade-in overflow-auto gap-5 flex-col w-full bg-white p-6 rounded-xl h-full">
      <table class="overflow-auto table-auto w-full">
        <colgroup>
          <col style="width: 5%">
          <col style="width: 15%">
          <col style="width: 14%">
          <col style="width: 14%">
          <col style="width: 14%">
          <col style="width: 14%">
          <col style="width: 14%">
          <col style="width: 14%">
        </colgroup>
        <thead class="bg-gray-200 rounded-2xl text-sm tracking-wider">
        <tr>
          <th class="px-2 py-3 text-start">№</th>
          <th class="p-2 text-start">Ism</th>
          <th class="p-2 text-start">Rasm</th>
          <th class="p-2 text-start">User Nomi</th>
          <th class="p-2 text-start">Role</th>
          <th class="p-2 text-start">Izoh</th>
          <th class="p-2 text-start">Telefon</th>
          <th class="p-2 text-start">Amallar</th>
        </tr>
        </thead>
        <tbody v-if="allUsers.length">
        <tr
            class="border-t border-gray-600 text-sm hover:bg-gray-100"
            v-for="(user, index) in allUsers"
            :key="user.id"
        >
          <td class="p-4">{{index + 1}}</td>
          <td class="p-2">{{user.lastName}} {{user.firstName}}</td>
          <td class="p-2 flex items-center">
            <img v-if="user.avatarUrl" class="w-16 h-10 lg:h-16 rounded-full object-cover" :src="getAvatarUrl(user.avatarUrl)" alt="">
          </td>
          <td class="p-2">{{user.username}}</td>
          <td class="p-3">
            <div class="flex flex-wrap gap-1">
              <span
                  v-for="role in user.roles"
                  :key="role.id"
                  class="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-semibold"
              >
                {{ roleStatus[role.name] }}
              </span>
            </div>
          </td>
          <td class="p-2">{{user.bio}}</td>
          <td class="p-2">{{user.phone}}</td>
          <td class="p-2">
            <div class="flex items-center gap-2">
              <CButton
                  type="button"
                  text="Role"
                  variant="ghost-accent"
                  @click="changeRole(user)"
              />
              <CButton
                  text="Tahrirlash"
                  type="button"
                  size="sm"
                  variant="warning"
                  @click="editItem(user)"
              />
              <CButton
                  text="O'chirish"
                  type="button"
                  size="sm"
                  variant="danger"
                  @click="deleteItem(user.id)"
              />
            </div>
          </td>
        </tr>
        </tbody>
        <tbody v-else>
        <tr>
          <td colspan="10">
            <div class="flex p-4 items-center justify-center w-full text-gray-600 m-auto">
              Xodim topilmadi!
            </div>
          </td>
        </tr>
        </tbody>
      </table>
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
const loadStore = authService();

const visibleShow = ref(false);
const isLoading = ref(false);
const showModal = ref(false);
const selectedUser = ref<string | null>(null);
const selectedUsers = ref<UserForm | null>(null);
const selectedUserRoleId = ref<string | null>(null);
const selectedRoles: Ref = ref<string[]>([]);
const selectedRole = ref(false);
const roles = ref<Role[]>([]);
const selectedFile = ref<File | null>(null);
const isEditing = ref(false);
const avatarPreview = ref<string>("");

const oldUploadKey = ref<string | null>(null);
const newUploadId = ref<string | null>(null);

const users: ComputedRef = computed(() => store.state.user.items);
const allUsers = computed(() => users.value);

const roleLabels = [
  { value: "ROLE_ADMIN", text: "ADMIN" },
  { value: "ROLE_MANAGER", text: "MENEGER" },
  { value: "ROLE_OPERATOR", text: "OPERATOR" },
  { value: "ROLE_USER", text: "USER" },
];

const rolesOptions = computed(() => {
  return roles.value.map((role: Role) => {
    const found = roleLabels.find(r => r.value === role.name)

    return {
      id: role.id,
      name: found?.text || role.name
    }
  })
})

const roleStatus:Record<string, string> = {
  ROLE_MANAGER: "MENEJER",
  ROLE_ADMIN: "ADMIN",
  ROLE_USER: "USER",
  ROLE_OPERATOR: "OPERATOR",
}

const emptyForm = (): UserForm => ({
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

const form = ref<UserForm>(emptyForm());

const clickVisibleForm = () => {
  form.value = emptyForm();
  avatarPreview.value = '';
  selectedFile.value = null;
  oldUploadKey.value = null;
  newUploadId.value = null;
  isEditing.value = false;
  visibleShow.value = true;
};

const changeFile = (event: Event) => {
  const fileInput = event.target as HTMLInputElement;
  if (!fileInput.files?.length) return;

  selectedFile.value = fileInput.files[0];
  avatarPreview.value = URL.createObjectURL(selectedFile.value);
};

const removeAvatar = async () => {
  if (newUploadId.value) {
    await deleteUpload(newUploadId.value);
    newUploadId.value = null;
  }

  avatarPreview.value = '';
  form.value.avatarUrl = '';
  form.value.uploadId = '';
};

const deleteUpload = async (id: string) => {
  if (!id) return;

  try {
    await axiosInstance.delete(`/api/v1/uploads/${id}`);
  } catch (error) {
    console.error("Upload o'chirishda xatolik:", error);
  }
};

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

const BASE_URL = import.meta.env.VITE_BASE_API

const getAvatarUrl = (url: string | undefined): string => {
  if (!url) return '';

  if (url.startsWith('http')) return url;

  return `${BASE_URL}${url}`;

};

const submitForm = async () => {
  isLoading.value = true;
  try {
    if (selectedFile.value) {
      const uploaded = await uploadAvatar();
      if (uploaded) {
        form.value.avatarUrl = uploaded.url;
        form.value.uploadId = uploaded.id;
        newUploadId.value = uploaded.id;
      }
    }
    if (isEditing.value) {
      await store.updateUser(form.value.id, form.value);
      Toast.success("Xodim ma'lumotlari yangilandi");
    } else {
      await store.addUser(form.value);
      Toast.success("Xodim qo'shildi");
    }

    visibleShow.value = false;
    isEditing.value = false;
    selectedFile.value = null;
    avatarPreview.value = '';
    newUploadId.value = null;
    oldUploadKey.value = null;
    form.value = emptyForm();

  } catch (error) {
    Toast.error("Xatolik yuz berdi");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const saveRole = async () => {
  if (!selectedRoles.value.length || !selectedUserRoleId.value) return;

  try {
    await loadStore.loadChangeRole(selectedUserRoleId.value, selectedRoles.value);
    Toast.success("Role yangilandi");
    selectedRole.value = false;
    selectedRoles.value = [];
    await store.loadUsers();
  } catch (error) {
    console.error(error);
  }
};

const changeRole = async (user: UserForm) => {
  selectedUserRoleId.value = user.id;
  selectedUsers.value = user;
  selectedRoles.value = user.roles?.map(role => String(role.id)) || [];

  if (!roles.value.length) {
    await loadStore.loadRole();
  }

  selectedRole.value = true;
};

const editItem = (user: UserForm) => {
  form.value = { ...user };
  avatarPreview.value = '';
  selectedFile.value = null;
  newUploadId.value = null;

  oldUploadKey.value = user.uploadId || null;

  isEditing.value = true;
  visibleShow.value = true;
};

const confirmDelete = async () => {
  if (!selectedUser.value) return;

  try {
    const user = allUsers.value.items.find((u: UserForm) => u.id === selectedUser.value);
    const uploadKey = user?.uploadId;

    if (uploadKey) {
      await deleteUpload(uploadKey);
    }

    await store.deleteUser(selectedUser.value);
    Toast.success("Xodim o'chirildi");
    showModal.value = false;
    selectedUser.value = null;
  } catch (error) {
    Toast.error("O'chirishda xatolik");
    console.error(error);
  }
};

const deleteItem = (id: string) => {
  selectedUser.value = id;
  showModal.value = true;
};

const resetForm = () => {
  if (newUploadId.value) {
    deleteUpload(newUploadId.value);
    newUploadId.value = null;
  }
  visibleShow.value = false;
  selectedFile.value = null;
  avatarPreview.value = '';
  form.value = emptyForm();
};

const loadRole = async () => {
  try {
    const res = await loadStore.loadRole();
    roles.value = res.data;
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  isLoading.value = true;
  try {
    await store.loadUsers();
    await loadRole();
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
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
