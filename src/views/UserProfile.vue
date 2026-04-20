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
  <div v-else class="profile-page relative min-h-screen w-full overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
    <img
        src="../assets/background.svg"
        alt=""
        class="pointer-events-none absolute inset-x-0 top-0 h-80 w-full object-cover opacity-20 mix-blend-screen"
    >
    <div class="profile-backdrop absolute inset-0"></div>
    <div class="profile-grid absolute inset-0"></div>
    <div class="profile-light profile-light-left absolute"></div>
    <div class="profile-light profile-light-right absolute"></div>

    <div class="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center">
      <div class="w-full overflow-hidden rounded-2xl border border-white/15 bg-white shadow-2xl">
        <div class="flex flex-col border-b border-gray-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <CButton
              type="button"
              text="Ortga"
              variant="ghost-accent"
              is-has-fa-icon
              faClass="fa-solid fa-arrow-left"
              @click="router.back()"
          />
          <div class="mt-4 sm:mt-0 sm:text-right">
            <p class="text-sm font-semibold uppercase tracking-wide text-blue-600">Profil</p>
            <h2 class="text-2xl font-bold text-gray-950">Foydalanuvchi ma'lumotlari</h2>
          </div>
        </div>

        <form
            @submit.prevent="profileSubmit"
            class="grid gap-0 lg:grid-cols-[320px_minmax(0,1fr)]"
        >
          <aside class="border-b border-gray-200 bg-slate-50 p-6 lg:border-b-0 lg:border-r lg:p-8">
            <div class="flex flex-col items-center text-center">
              <div class="relative">
                <img
                    v-if="avatarPreview || form.avatarUrl"
                    class="h-32 w-32 rounded-full border-4 border-white bg-gray-100 object-cover shadow-lg ring-1 ring-gray-200"
                    :src="avatarPreview || getAvatarUrl(form.avatarUrl)"
                    alt="Avatar"
                    @error="onImgError"
                />
                <span
                    v-else
                    class="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-600 to-cyan-500 text-3xl font-bold text-white shadow-lg ring-1 ring-gray-200"
                >
                  {{ initials }}
                </span>
                <div
                    v-if="avatarUploading"
                    class="absolute inset-0 flex items-center justify-center rounded-full bg-black/45"
                >
                  <svg class="h-7 w-7 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                </div>
              </div>

              <h3 class="mt-5 text-xl font-bold text-gray-950">{{ profileTitle }}</h3>
              <p class="mt-1 text-sm font-medium text-gray-500">{{ form.username || form.profession || "User" }}</p>

              <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  ref="profileImageInput"
                  @change="changeAvatar($event)"
              />

              <div class="mt-6 flex w-full flex-col gap-3">
                <button
                    class="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    @click="profileImageInput?.click()"
                    type="button"
                    :disabled="avatarUploading"
                >
                  <i class="fa-solid fa-camera"></i>
                  Rasmni o'zgartirish
                </button>
                <button
                    v-if="form.avatarUrl || avatarPreview"
                    class="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    @click="removeAvatar"
                    type="button"
                    :disabled="avatarUploading"
                >
                  <i class="fa-solid fa-trash"></i>
                  O'chirish
                </button>
              </div>
            </div>
          </aside>

          <section class="p-6 sm:p-8">
            <div class="grid gap-4 sm:grid-cols-2">
              <AppInput
                  label="Ism"
                  placeholder="Ism kiriting"
                  type="text"
                  v-model="form.firstName"
              />
              <AppInput
                  label="Familiya"
                  placeholder="Familiya kiriting"
                  type="text"
                  v-model="form.lastName"
              />
            </div>

            <div class="mt-4 grid gap-4 sm:grid-cols-2">
              <AppInput
                  label="Kasbi"
                  placeholder="Kasbi kiriting"
                  type="text"
                  v-model="form.profession"
              />
              <AppInput
                  label="Telefon raqam"
                  placeholder="+998..."
                  type="text"
                  v-model="form.phone"
              />
            </div>

            <div class="mt-4">
              <AppInput
                  label="Bio"
                  placeholder="Bio kiriting"
                  type="text"
                  v-model="form.bio"
              />
            </div>

            <div class="mt-8 flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
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
          </section>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppInput from "@/components/ui/AppInput.vue";
import { computed, onMounted, reactive, ref } from "vue";
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

const profileTitle = computed(() => {
  const fullName = `${form.firstName || ""} ${form.lastName || ""}`.trim();
  return fullName || form.username || "User Profile";
});

const initials = computed(() => {
  const source = profileTitle.value.trim();
  return source
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U";
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
.profile-page {
  background:
      linear-gradient(135deg, #06142f 0%, #0f2f55 42%, #111827 100%);
}

.profile-backdrop {
  background:
      radial-gradient(circle at 18% 14%, rgba(56, 189, 248, 0.34), transparent 28%),
      radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.26), transparent 30%),
      radial-gradient(circle at 65% 88%, rgba(20, 184, 166, 0.18), transparent 32%),
      linear-gradient(160deg, rgba(15, 23, 42, 0.1), rgba(2, 6, 23, 0.78));
}

.profile-grid {
  opacity: 0.22;
  background-image:
      linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(to bottom, black, transparent 78%);
}

.profile-light {
  width: 28rem;
  height: 28rem;
  border-radius: 9999px;
  filter: blur(72px);
  opacity: 0.28;
}

.profile-light-left {
  left: -8rem;
  top: 9rem;
  background: #22d3ee;
}

.profile-light-right {
  right: -10rem;
  bottom: -7rem;
  background: #6366f1;
}

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
