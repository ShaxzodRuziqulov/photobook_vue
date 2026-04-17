<template>
  <div v-if="isLoading" class="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-950 to-gray-800">
    <div class="bg-white rounded-2xl p-6 w-full max-w-sm space-y-5 animate-pulse">

      <!-- Header -->
      <div class="flex justify-between items-center">
        <div class="w-20 h-8 bg-gray-300 rounded"></div>
        <div class="w-32 h-6 bg-gray-300 rounded"></div>
      </div>

      <!-- Avatar -->
      <div class="flex flex-col items-center gap-3">
        <div class="w-24 h-24 bg-gray-300 rounded-full"></div>
        <div class="flex gap-2">
          <div class="w-28 h-8 bg-gray-300 rounded"></div>
          <div class="w-20 h-8 bg-gray-300 rounded"></div>
        </div>
      </div>

      <!-- Inputs -->
      <div class="flex gap-2">
        <div class="w-full h-12 bg-gray-200 rounded-xl"></div>
        <div class="w-full h-12 bg-gray-200 rounded-xl"></div>
      </div>

      <div class="w-full h-12 bg-gray-200 rounded-xl"></div>
      <div class="w-full h-12 bg-gray-200 rounded-xl"></div>
      <div class="w-full h-12 bg-gray-200 rounded-xl"></div>

      <!-- Buttons -->
      <div class="flex gap-3">
        <div class="w-full h-12 bg-gray-300 rounded-xl"></div>
        <div class="w-full h-12 bg-gray-300 rounded-xl"></div>
      </div>

    </div>
  </div>
  <div v-else class="flex items-center flex-col overflow-hidden w-full min-h-screen bg-gradient-to-br from-blue-950 to-gray-800 m-auto">
    <img src="../assets/background.svg" alt="">
    <div class="bg-white fixed rounded-2xl overflow-hidden top-[100px] max-w-sm flex-col p-4 w-md sm:p-2 shadow-xl">
      <div class="flex items-center justify-between">
        <CButton
            type="button"
            text="Ortga"
            variant="ghost-accent"
            is-has-fa-icon
            faClass="fa-solid fa-arrow-left"
            @click="router.back()"
        />
        <h2 class="text-2xl font-semibold">User Profile</h2>
      </div>

      <form
          @submit.prevent="profileSubmit"
          class="flex flex-col gap-3 overflow-y-auto max-h-[72vh] p-2"
      >
        <div class="flex items-center gap-3 flex-col justify-center w-full">
          <div class="relative">
            <img
                v-if="form.avatarUrl"
                class="w-24 h-24 border-2 border-gray-300 rounded-full object-cover bg-gray-100"
                :src="avatarPreview || getAvatarUrl(form.avatarUrl)"
                alt="Avatar"
                @error="onImgError"
            />
            <span v-else class="text-2xl rounded-full border-2 bg-gray-800 text-white border-gray-300 flex w-20 h-20 items-center justify-center">
            <i class="fa-solid fa-user"></i>
            </span>
            <div
                v-if="avatarUploading"
                class="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center"
            >
              <svg class="animate-spin w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            </div>
          </div>
          <input
              type="file"
              accept="image/*"
              class="hidden"
              ref="profileImageInput"
              @change="changeAvatar($event)"
          />

          <div class="flex gap-2">
            <button
                class="text-sm cursor-pointer text-white bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded-xl border border-dashed border-gray-500 disabled:opacity-50"
                @click="profileImageInput?.click()"
                type="button"
                :disabled="avatarUploading"
            >
              Rasmni o'zgartirish
            </button>
            <button
                v-if="form.avatarUrl || avatarPreview"
                class="text-sm cursor-pointer text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-xl disabled:opacity-50"
                @click="removeAvatar"
                type="button"
                :disabled="avatarUploading"
            >
              O'chirish
            </button>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <AppInput
              label="Ism"
              placeholder="Ism kiriting"
              type="text"
              v-model="form.lastName"
          />
          <AppInput
              label="Familiya"
              placeholder="Familiya kiriting"
              type="text"
              v-model="form.firstName"
          />
        </div>
        <AppInput
            label="Kasbi"
            placeholder="Kasbi kiriting"
            type="text"
            v-model="form.profession"
        />
        <AppInput
            label="Phone Number"
            placeholder="+998..."
            type="text"
            v-model="form.phone"
        />
        <AppInput
            label="Bio"
            placeholder="Bio kiriting"
            type="text"
            v-model="form.bio"
        />

        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <CButton
              type="button"
              text="Clear"
              variant="ghost-accent"
              class="w-full sm:w-auto"
              @click="clearForm"
          />
          <CButton
              type="submit"
              text="Saqlash"
              variant="primary"
              :disabled="isLoading || avatarUploading"
              class="w-full sm:w-auto"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppInput from "@/components/ui/AppInput.vue";
import { onMounted, reactive, ref } from "vue";
import CButton from "@/components/CButton.vue";
import { authService } from "@/service/authService";
import axiosInstance from "@/axios";
import { useRouter } from "vue-router";
import { UserForm } from "@/typeModules/useModules";
import { useToast } from "vue-toastification";

const router = useRouter();
const auth = authService();
const Toast = useToast();

const isLoading = ref(false);
const avatarUploading = ref(false);
const selectedFile = ref<File | null>(null);
const avatarPreview = ref<string>("");
const profileImageInput = ref<HTMLInputElement>();

const currentUploadKey = ref<string>("");

const BASE_URL = import.meta.env.VITE_BASE_API

const form = reactive<UserForm>({
  id: "",
  firstName: "",
  lastName: "",
  profession: "",
  username: "",
  password: "",
  avatarUrl: "",
  phone: "",
  bio: "",
  isActive: true,
  uploadId: "",
  roles: [],
});

const getAvatarUrl = (url: string | undefined): string => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url}`;
};

const onImgError = (e: Event) => {
  (e.target as HTMLImageElement).src = "";
};

const uploadAvatar = async (): Promise<{ url: string; id: string; key: string } | null> => {
  if (!selectedFile.value) return null;
  try {
    const formData = new FormData();
    formData.append("file", selectedFile.value);

    const { data } = await axiosInstance.post("/api/v1/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return {
      url: data.url,
      id: data.id,
      key: data.key
    };
  } catch (e) {
    console.error("UPLOAD ERROR:", e);
    Toast.error("Rasm yuklashda xatolik");
    return null;
  }
};

const removeAvatar = async () => {
  if (currentUploadKey.value) {
    await deleteUpload(currentUploadKey.value);
    currentUploadKey.value = "";
  }

  avatarPreview.value = "";
  form.avatarUrl = "";
  form.uploadId = "";
};

const deleteUpload = async (id: string) => {
  if (!id) return;

  try {
    await axiosInstance.delete(`/api/v1/uploads/${id}`);
  } catch (error) {
    console.error("DELETE ERROR:", error);
  }
};

const changeAvatar = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  selectedFile.value = input.files[0];

  avatarPreview.value = URL.createObjectURL(selectedFile.value);
  // avatarUploading.value = true;
};

const profileSubmit = async () => {
  isLoading.value = true;
  try {
    if (selectedFile.value) {
      const uploaded = await uploadAvatar()

      if (uploaded) {
        form.avatarUrl = uploaded.url;
        form.uploadId = uploaded.id;
        currentUploadKey.value = uploaded.key;
      }
    }
    const { data } = await axiosInstance.put("/api/v1/users/me", {
      id:         form.id,
      firstName:  form.firstName,
      lastName:   form.lastName,
      profession: form.profession,
      phone:      form.phone,
      bio:        form.bio,
      avatarUrl:  form.avatarUrl,
      uploadId:   form.uploadId || '',
    });

    const freshProfile = await loadProfile()

    currentUploadKey.value = data.uploadId || "";
    avatarPreview.value = "";

    if (freshProfile) {
      auth.setUser(freshProfile);
    }
    Toast.success("Profil yangilandi");
  } catch (error) {
    Toast.error("Saqlashda xatolik");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const loadProfile = async () => {
  try {
    const { data } = await axiosInstance.get("/api/v1/users/me");

    form.id         = data.id         || "";
    form.firstName  = data.firstName  || "";
    form.lastName   = data.lastName   || "";
    form.profession = data.profession || "";
    form.avatarUrl  = data.avatarUrl  || "";
    form.phone      = data.phone      || "";
    form.bio        = data.bio        || "";
    form.username   = data.username   || "";
    form.uploadId   = data.uploadId   || "";

    currentUploadKey.value = data.uploadId || "";

    auth.setUser(data);
    return data;
  } catch (e) {
    console.error("Profil yuklashda xatolik:", e);
    return null;
  }
};

const clearForm = () => {
  form.firstName  = "";
  form.lastName   = "";
  form.profession = "";
  form.phone      = "";
  form.avatarUrl  = "";
  form.bio        = "";
  avatarPreview.value = "";
};

onMounted(() => {
  loadProfile();
});
</script>
<style scoped>
@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

.animate-pulse {
  background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e5e7eb 37%,
      #f0f0f0 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s infinite;
}
</style>