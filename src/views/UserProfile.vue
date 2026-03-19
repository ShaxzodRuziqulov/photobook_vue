<template>
  <div class="flex items-center justify-center flex-col overflow-hidden w-full px-4 min-h-screen bg-gradient-to-br from-gray-200 to-gray-500 m-auto">
    <div class="bg-white rounded-2xl flex overflow-hidden flex-col w-full max-w-md p-4 sm:p-6 shadow-xl">
      <div class="flex items-start ">
        <CButton
            type="button"
            text="Ortga"
            variant="ghost-accent"
            is-has-fa-icon
            faClass="fa-solid fa-arrow-left"
            @click="router.back()"
        />
      </div>
      <h2 class="text-2xl pt-2 font-semibold">User Profile</h2>
      <form
          @submit.prevent="profileSubmit"
          class="flex flex-col gap-3 overflow-y-auto max-h-[80vh] sm:max-h-[80vh]"
      >
        <div class="flex items-center gap-3 flex-col justify-center w-full">
          <img
              class="w-20 h-20 sm:w-24 sm:h-24 border-2 border-gray-800 rounded-full object-cover"
              :src="avatarPreview || form.avatarUrl"
              alt=""
          />

          <input
              type="file"
              accept="image/*"
              class="hidden"
              ref="profileImageInput"
              @change="changeAvatar($event)"
          />

          <button
              class="text-sm sm:text-base cursor-pointer text-gray-600 border px-3 py-2 rounded-xl border-dashed border-gray-600"
              @click="profileImageInput?.click()"
              type="button"
          >
            Rasmni o'zgartirish
          </button>
        </div>
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
        <AppInput
            label="Kasbi"
            placeholder="Kasbi kiriting"
            type="text"
            v-model="form.profession"
        />
        <AppInput
            label="Phone Number"
            placeholder="+998... "
            type="text"
            v-model="form.phone"
        />
        <AppInput
            label="Bio"
            placeholder="Inter bio"
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
              text="Submit"
              variant="primary"
              class="w-full sm:w-auto"
          />
        </div>
      </form>
    </div>
  </div>
</template>


<script setup lang="ts">
import AppInput from "@/components/ui/AppInput.vue";
import {onMounted, reactive, ref} from "vue";
import CButton from "@/components/CButton.vue";
import { authService } from "@/service/authService";
import axiosInstance from "@/axios";
import { useStore } from "@/stores/store";
import { useRouter } from "vue-router";
import {UserForm} from "@/typeModules/useModules";

const dataStore = useStore();
const router = useRouter();
const auth = authService();
const form = reactive<UserForm>({
  id: "",
  firstName: "",
  lastName: "",
  profession: "",
  username: "",
  password: "",
  avatarUrl: "",
  phone: '',
  bio: '',
  isActive: true,
  uploadId: "",
  roles: [],
});

const selectedFile = ref<File | null>(null);
const avatarPreview = ref<string>("");
const profileImageInput = ref<HTMLInputElement>();

const changeAvatar = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]

  console.log("Uploading file:", file)
  const res = await dataStore.loadUploadImage(file)

  form.avatarUrl = res.url;
  avatarPreview.value = URL.createObjectURL(file)
  // form.avatarUrl = URL.createObjectURL(file)
}

const getAvatarUrl = (avatarField?: string) => {
  if (!avatarField) return ""

  if (avatarField.startsWith("http")) return avatarField

  return `${import.meta.env.VITE_BASE_URL}/${avatarField}`
}
//
// const changeAvatar = (event: Event) => {
//   const target = event.target as HTMLInputElement;
//   if (!target.files?.length) return;
//
//   selectedFile.value = target.files[0];
//   avatarPreview.value = URL.createObjectURL(selectedFile.value);
// };

const profileSubmit = async () => {
  try {
    const fd = new FormData()

    fd.append("id", String(form.id))
    fd.append("firstName", form.firstName)
    fd.append("lastName", form.lastName)
    fd.append("profession", form.profession)
    fd.append("uploadId", form.uploadId)
    fd.append("avatarUrl", form.avatarUrl)
    fd.append("phone", form.phone || "")
    fd.append("bio", form.bio || "")

    if (selectedFile.value) {
      fd.append("avatar", selectedFile.value)
    }

    const { data } = await axiosInstance.put('/api/v1/users/me', fd)

    Object.assign(form, data)

    auth.setUser(data)
    avatarPreview.value = ""
    selectedFile.value = null

  } catch (error) {
    console.error(error)
  }
}

const loadProfile = async () => {
  try {
    const { data } = await axiosInstance.get('/api/v1/users/me')

    form.id = data.id
    form.firstName = data.firstName
    form.lastName = data.lastName
    form.profession = data.profession
    form.avatarUrl = data.avatarUrl
    form.phone = data.phone
    form.bio = data.bio

    auth.setUser(data)
  } catch (e) {
    console.error(e)
  }
}

const clearForm = () => {
  form.id = "";
  form.firstName = "";
  form.lastName = "";
  form.profession = "";
  form.avatarUrl = "";
  form.phone = "";
  form.bio = "";
  avatarPreview.value = "";
  selectedFile.value = null;
};

onMounted(() => {
  loadProfile()
})
</script>


<style scoped>

</style>
