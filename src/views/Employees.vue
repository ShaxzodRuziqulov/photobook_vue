<template>
  <div class="app-page flex w-full min-w-0 flex-col gap-5 px-4 py-6 sm:px-6 lg:mx-auto lg:max-w-7xl">
    <div class="flex w-full flex-col gap-3 rounded-xl border border-pb-border bg-pb-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-wrap items-center gap-3 sm:gap-5">
        <CButton
            type="button"
            text="Orqaga"
            is-has-fa-icon
            variant="ghost-accent"
            fa-class="fa-solid fa-arrow-left"
            @click="router.back()"
        />
        <div>
          <p class="text-xs font-bold uppercase tracking-wide text-pb-accent">Jamoa</p>
          <h1 class="text-xl font-bold text-pb-text">Xodimlar</h1>
        </div>
      </div>
      <CButton
          type="button"
          text="Xodim qo'shish"
          @click="clickVisibleForm"
      />
    </div>
    <CDialog
        :show="visibleShow"
        has-close-icon
        no-header
        custom-class="w-full max-w-2xl"
        @close="visibleShow = false"
        body-class="flex max-h-[min(88vh,640px)] flex-col overflow-hidden rounded-xl border border-pb-border !bg-pb-surface p-0 shadow-lg"
    >
      <form
          class="flex min-h-0 flex-1 flex-col"
          @submit.prevent="submitForm"
      >
        <div class="shrink-0 border-b border-pb-border px-4 pb-2 pt-11 sm:pt-4">
          <h2 class="text-base font-semibold text-pb-text leading-snug">
            {{ isEditing ? "Xodimni tahrirlash" : "Xodim qo'shish" }}
          </h2>
        </div>
        <div class="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          <div
              class="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4"
          >
            <div class="w-full shrink-0 sm:max-w-[220px]">
              <OrderImagePicker
                  label="Profil rasmi"
                  :image-src="employeeAvatarDisplaySrc"
                  :busy="isSavingEmployee"
                  @pick="onEmployeeImagePicked"
                  @clear="onEmployeeImageClear"
              />
            </div>
            <div class="min-w-0 flex-1 space-y-3">
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div class="min-w-0 space-y-1">
                  <AppInput
                      label="Familiya *"
                      type="text"
                      maxlength="120"
                      placeholder="Familiya"
                      v-model="form.lastName"
                      @update:model-value="clearFieldError('lastName')"
                  />
                  <p v-if="fieldErrors.lastName" class="text-pb-error text-xs">{{ fieldErrors.lastName }}</p>
                </div>
                <div class="min-w-0 space-y-1">
                  <AppInput
                      label="Ism *"
                      type="text"
                      maxlength="120"
                      placeholder="Ism"
                      v-model="form.firstName"
                      @update:model-value="clearFieldError('firstName')"
                  />
                  <p v-if="fieldErrors.firstName" class="text-pb-error text-xs">{{ fieldErrors.firstName }}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div class="min-w-0 space-y-1">
                  <AppInput
                      label="Foydalanuvchi nomi *"
                      type="text"
                      maxlength="80"
                      placeholder="Login"
                      v-model="form.username"
                      @update:model-value="clearFieldError('username')"
                  />
                  <p v-if="fieldErrors.username" class="text-pb-error text-xs">{{ fieldErrors.username }}</p>
                </div>
                <div class="min-w-0 space-y-1">
                  <AppInput
                      :label="isEditing ? 'Parol (ixtiyoriy)' : 'Parol *'"
                      type="password"
                      :placeholder="passwordPlaceholder"
                      v-model="form.password"
                      @update:model-value="clearFieldError('password')"
                  />
                  <p v-if="fieldErrors.password" class="text-pb-error text-xs">{{ fieldErrors.password }}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div class="min-w-0">
                  <AppInput
                      label="Kasbi"
                      type="text"
                      maxlength="120"
                      placeholder="Kasb"
                      v-model="form.profession"
                  />
                </div>
                <div class="min-w-0">
                  <AppInput
                      label="Telefon"
                      type="text"
                      maxlength="40"
                      placeholder="+998901234567"
                      v-model="form.phone"
                  />
                </div>
              </div>
              <AppInput
                  label="Izoh"
                  type="textarea"
                  placeholder="Qisqa izoh"
                  v-model="form.bio"
                  :is-textarea="true"
              />
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
              :disabled="isSavingEmployee"
              @click="resetForm"
          />
          <CButton
              type="submit"
              text="Saqlash"
              variant="primary"
              :disabled="isSavingEmployee || employeeSaveDisabled"
              :loading="isSavingEmployee"
          />
        </div>
      </form>
    </CDialog>

    <CDialog
        :show="selectedRole"
        has-close-icon
        no-header
        custom-class="w-full max-w-md"
        @close="selectedRole = false"
        body-class="flex max-h-[min(88vh,520px)] flex-col overflow-hidden rounded-xl border border-pb-border !bg-pb-surface p-0 shadow-lg"
    >
        <form
            class="flex min-h-0 flex-1 flex-col"
            @submit.prevent="saveRole"
        >
          <div class="shrink-0 border-b border-pb-border px-4 pb-3 pt-11 sm:pt-4">
            <h2 class="text-base font-semibold text-pb-text leading-snug">
              Rollarni boshqarish
            </h2>
            <div class="mt-2 min-w-0 space-y-0.5">
              <p class="text-sm font-semibold leading-snug text-pb-text line-clamp-2">
                {{ roleDialogTitle }}
              </p>
              <p
                  v-if="roleDialogSubtitle"
                  class="truncate text-xs font-medium text-pb-muted"
                  :title="roleDialogSubtitle"
              >
                {{ roleDialogSubtitle }}
              </p>
            </div>
          </div>
          <div class="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-3">
            <p class="text-[11px] leading-snug text-pb-muted">
              Bir nechta rol tanlash mumkin.
            </p>
            <AppSelect
                v-model="selectedRoles"
                :options="rolesOptions"
                disabledValue="Rol tanlang"
                text-field="name"
                value-field="id"
                isMultiple
            />
          </div>
          <div
              class="flex shrink-0 flex-nowrap items-center justify-end gap-2 border-t border-pb-border bg-pb-elevated px-4 py-2.5"
          >
            <CButton
                type="button"
                text="Bekor qilish"
                variant="ghost-accent"
                :disabled="isSavingRole"
                @click="selectedRole = false"
            />
            <CButton
                type="submit"
                text="Saqlash"
                variant="primary"
                :loading="isSavingRole"
                :disabled="isSavingRole || !roleDialogDirty"
            />
          </div>
        </form>
    </CDialog>
    <CDialog
        :show="showModal"
        custom-class="w-full max-w-sm"
        @close="showModal = false"
        body-class="!bg-pb-surface rounded-xl border border-pb-border p-5 text-center shadow-lg"
    >
      <DeleteConfirm
          title="Ushbu xodimni o'chirmoqchimisiz?"
          v-model:show="showModal"
          @confirm="confirmDelete"
      />
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

    <div class="animate-fade-in flex w-full flex-col gap-4 overflow-x-auto rounded-xl border border-pb-border bg-pb-surface p-4 shadow-sm sm:p-6">
      <div v-if="isLoading" class="space-y-3">
        <div
            v-for="i in 6"
            :key="i"
            class="h-12 animate-pulse rounded-lg bg-pb-border"
        ></div>
      </div>
      <table v-else class="w-full table-auto text-sm">
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
        <thead class="bg-pb-elevated text-sm font-semibold tracking-wide text-pb-label">
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
            class="border-t border-pb-border transition hover:bg-pb-elevated"
            v-for="(user, index) in allUsers"
            :key="user.id"
        >
          <td class="p-4">{{index + 1}}</td>
          <td class="p-2">{{user.lastName}} {{user.firstName}}</td>
          <td class="p-2 flex items-center">
            <img
                v-if="user.avatarUrl" class="w-16 h-10 lg:h-16 cursor-pointer rounded-full object-cover"
                @click="openPreview(user.avatarUrl)"
                :src="getAvatarUrl(user.avatarUrl)" alt="">
          </td>
          <td class="p-2">{{user.username}}</td>
          <td class="p-2">
            <div class="flex flex-wrap gap-1">
              <span
                  v-for="role in user.roles"
                  :key="role.id"
                  class="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-pb-accent"
              >
                {{ roleStatus[role.name] }}
              </span>
            </div>
          </td>
          <td class="p-2">{{user.bio}}</td>
          <td class="p-2">{{user.phone}}</td>
          <td class="p-2">
            <div class="flex flex-nowrap items-center justify-end gap-2">
              <CButton
                  type="button"
                  text="Rol"
                  size="sm"
                  variant="outline-accent"
                  @click="changeRole(user)"
              />
              <CButton
                  text="Tahrirlash"
                  type="button"
                  size="sm"
                  variant="outline-edit"
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
          <td colspan="8">
            <div class="m-auto flex w-full items-center justify-center p-6 text-pb-muted">
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
import {computed, nextTick, ref, onMounted, ComputedRef, Ref} from "vue";
import AppInput from "@/components/ui/AppInput.vue";
import OrderImagePicker from "@/components/OrderImagePicker.vue";
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
import {
  snapshotSortedRoleIds,
  snapshotUserEmployeeEdit,
} from "@/utils/updateFormDirty";

const Toast = useToast();
const router = useRouter();
const store = useStore();
const loadStore = authService();

const visibleShow = ref(false);
const isLoading = ref(false);
const isSavingEmployee = ref(false);
const isSavingRole = ref(false);
const showModal = ref(false);
const selectedUser = ref<string | null>(null);
const selectedUsers = ref<UserForm | null>(null);
const selectedUserRoleId = ref<string | null>(null);
const selectedRoles: Ref = ref<string[]>([]);
const selectedRole = ref(false);
const roles = ref<Role[]>([]);
const selectedFile = ref<File | null>(null);
const isEditing = ref(false);
const employeeEditBaseline = ref("");
const roleDialogBaseline = ref("");
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

/** Jadval bilan bir xil: familiya, keyin ism; bo‘lmasa login. */
const roleDialogTitle = computed(() => {
  const u = selectedUsers.value;
  if (!u) return "";
  const ln = String(u.lastName ?? "").trim();
  const fn = String(u.firstName ?? "").trim();
  const full = [ln, fn].filter(Boolean).join(" ");
  if (full) return full;
  const un = String(u.username ?? "").trim();
  return un || "Xodim";
});

/** Ism-familiya bor bo‘lsa, alohida qatorda login (@…). */
const roleDialogSubtitle = computed(() => {
  const u = selectedUsers.value;
  if (!u) return "";
  const ln = String(u.lastName ?? "").trim();
  const fn = String(u.firstName ?? "").trim();
  if (!ln && !fn) return "";
  const un = String(u.username ?? "").trim();
  if (!un) return "";
  return un.startsWith("@") ? un : `@${un}`;
});

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

const employeeSnapshotNow = computed(() =>
  snapshotUserEmployeeEdit(
    form.value,
    String(form.value.password ?? "").trim().length > 0,
    !!selectedFile.value,
  ),
);

const employeeSaveDisabled = computed(
  () =>
    isEditing.value &&
    employeeEditBaseline.value !== "" &&
    employeeSnapshotNow.value === employeeEditBaseline.value,
);

const roleDialogDirty = computed(
  () => snapshotSortedRoleIds(selectedRoles.value) !== roleDialogBaseline.value,
);

type EmployeeFieldKey = "lastName" | "firstName" | "username" | "password";

const fieldErrors = ref<Record<EmployeeFieldKey, string>>({
  lastName: "",
  firstName: "",
  username: "",
  password: "",
});

const passwordPlaceholder = computed(() =>
  isEditing.value
    ? "Yangi parol (bo'sh qoldiring agar o'zgarmasin)"
    : "Kamida 6 belgi",
);

const revokePreviewUrl = () => {
  const u = avatarPreview.value;
  if (u.startsWith("blob:")) URL.revokeObjectURL(u);
};

const clearFieldError = (key: EmployeeFieldKey) => {
  fieldErrors.value[key] = "";
};

const validateEmployeeForm = (): boolean => {
  fieldErrors.value = {
    lastName: "",
    firstName: "",
    username: "",
    password: "",
  };
  let ok = true;
  const f = form.value;
  if (!String(f.lastName ?? "").trim()) {
    fieldErrors.value.lastName = "Familiya kiritilishi shart.";
    ok = false;
  }
  if (!String(f.firstName ?? "").trim()) {
    fieldErrors.value.firstName = "Ism kiritilishi shart.";
    ok = false;
  }
  if (!String(f.username ?? "").trim()) {
    fieldErrors.value.username = "Foydalanuvchi nomi kiritilishi shart.";
    ok = false;
  }
  const pwd = String(f.password ?? "").trim();
  if (!isEditing.value) {
    if (pwd.length < 6) {
      fieldErrors.value.password = "Parol kamida 6 belgi bo'lishi kerak.";
      ok = false;
    }
  } else if (pwd.length > 0 && pwd.length < 6) {
    fieldErrors.value.password =
      "Yangi parol kamida 6 belgi bo'lishi kerak yoki bo'sh qoldiring.";
    ok = false;
  }
  return ok;
};

const clickVisibleForm = () => {
  revokePreviewUrl();
  form.value = emptyForm();
  avatarPreview.value = "";
  selectedFile.value = null;
  oldUploadKey.value = null;
  newUploadId.value = null;
  employeeEditBaseline.value = "";
  isEditing.value = false;
  fieldErrors.value = {
    lastName: "",
    firstName: "",
    username: "",
    password: "",
  };
  visibleShow.value = true;
};

const previewImage = ref<string | null>(null)

const openPreview = (url: string) => {
  previewImage.value = url;
}

const closePreview = () => {
  previewImage.value = null;
}

const onEmployeeImagePicked = (file: File) => {
  revokePreviewUrl();
  selectedFile.value = file;
  avatarPreview.value = URL.createObjectURL(file);
};

const onEmployeeImageClear = async () => {
  if (newUploadId.value) {
    await deleteUpload(newUploadId.value);
    newUploadId.value = null;
  }
  revokePreviewUrl();
  avatarPreview.value = "";
  selectedFile.value = null;
  form.value.avatarUrl = "";
  form.value.uploadId = "";
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

const employeeAvatarDisplaySrc = computed(() => {
  if (avatarPreview.value) return avatarPreview.value;
  return getAvatarUrl(form.value.avatarUrl);
});

const submitForm = async () => {
  if (!validateEmployeeForm()) return;

  isSavingEmployee.value = true;
  try {
    if (selectedFile.value) {
      const uploaded = await uploadAvatar();
      if (uploaded) {
        form.value.avatarUrl = uploaded.url;
        form.value.uploadId = uploaded.id;
        newUploadId.value = uploaded.id;
      }
    }

    const payload: Record<string, unknown> = { ...form.value };
    if (isEditing.value && !String(form.value.password ?? "").trim()) {
      delete payload.password;
    }

    if (isEditing.value) {
      await store.updateUser(form.value.id, payload as UserForm);
      Toast.success("Xodim ma'lumotlari yangilandi");
    } else {
      await store.addUser(payload as UserForm);
      Toast.success("Xodim qo'shildi");
    }

    revokePreviewUrl();
    visibleShow.value = false;
    isEditing.value = false;
    selectedFile.value = null;
    avatarPreview.value = "";
    newUploadId.value = null;
    oldUploadKey.value = null;
    form.value = emptyForm();
  } catch (error) {
    Toast.error("Xatolik yuz berdi");
    console.error(error);
  } finally {
    isSavingEmployee.value = false;
  }
};

const saveRole = async () => {
  if (!selectedRoles.value.length || !selectedUserRoleId.value) return;

  isSavingRole.value = true;
  try {
    await loadStore.loadChangeRole(selectedUserRoleId.value, selectedRoles.value);
    Toast.success("Role yangilandi");
    selectedRole.value = false;
    selectedRoles.value = [];
    await store.loadUsers();
  } catch (error) {
    Toast.error("Rolni saqlashda xatolik");
    console.error(error);
  } finally {
    isSavingRole.value = false;
  }
};

const changeRole = async (user: UserForm) => {
  selectedUserRoleId.value = user.id;
  selectedUsers.value = user;
  selectedRoles.value = user.roles?.map(role => String(role.id)) || [];
  roleDialogBaseline.value = snapshotSortedRoleIds(selectedRoles.value);

  if (!roles.value.length) {
    await loadStore.loadRole();
  }

  selectedRole.value = true;
};

const editItem = (user: UserForm) => {
  revokePreviewUrl();
  form.value = { ...user, password: "" };
  avatarPreview.value = "";
  selectedFile.value = null;
  newUploadId.value = null;

  oldUploadKey.value = user.uploadId || null;

  fieldErrors.value = {
    lastName: "",
    firstName: "",
    username: "",
    password: "",
  };
  isEditing.value = true;
  visibleShow.value = true;
  void nextTick(() => {
    employeeEditBaseline.value = employeeSnapshotNow.value;
  });
};

const confirmDelete = async () => {
  if (!selectedUser.value) return;

  try {
    const user = allUsers.value.find((u: UserForm) => u.id === selectedUser.value);
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
  revokePreviewUrl();
  visibleShow.value = false;
  selectedFile.value = null;
  avatarPreview.value = "";
  form.value = emptyForm();
  fieldErrors.value = {
    lastName: "",
    firstName: "",
    username: "",
    password: "",
  };
  isEditing.value = false;
  employeeEditBaseline.value = "";
};

const loadRole = async () => {
  isLoading.value = true;
  try {
    const res = await loadStore.loadRole();
    roles.value = res.data;
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  isLoading.value = true;
  try {
    await store.loadUsers();
    await loadRole();
    isLoading.value = false;
  } catch (error) {
    console.error(error);
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
