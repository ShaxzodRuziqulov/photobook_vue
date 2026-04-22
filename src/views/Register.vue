<template>
  <div class="flex min-h-screen bg-gradient-to-br from-slate-200 to-slate-400 m-auto w-full items-center justify-center p-4">
    <div class="bg-pb-surface rounded-2xl gap-4 flex flex-col w-[400px] max-w-md p-8 shadow-xl border border-pb-border">
      <h2 class="text-xl font-semibold text-pb-text">Ro'yxatdan o'tish</h2>
      <form
          @submit.prevent="submitForm"
          class="flex flex-col gap-4"
      >
        <AppInput
            type="text"
            label="Ism yoki foydalanuvchi nomi"
            v-model="form.name"
            placeholder="Ismingizni kiriting"
        />
        <AppInput
            label="Elektron pochta"
            type="email"
            placeholder="email@misol.uz"
            v-model="form.email"
        />
        <AppInput
            label="Parol"
            type="password"
            placeholder="Parol o'ylab toping"
            v-model="form.password"
            required
        />
        <CButton
            type="submit"
            text="Ro'yxatdan o'tish"
            class="w-full mt-4"
            variant="primary"
        />

      </form>
      <p class="text-sm text-pb-muted text-center">
        Allaqachon ro'yxatdan o'tganmisiz?
        <router-link
            class="text-pb-accent font-semibold hover:underline ml-1"
            to="/login"
        >
          Tizimga kirish
        </router-link>
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import AppInput from "@/components/ui/AppInput.vue";
import CButton from "@/components/CButton.vue";
import { ref } from "vue";
import { Register } from "@/typeModules/useModules";
import { authService } from "@/service/authService";

const useAuthService = authService();
const router = useRouter();
const Toast = useToast();

const form = ref<Register>({
  name: "",
  email: "",
  password: "",
});

const validateRegister = () => {
  if (!form.value.name.trim()) return "Ism yoki foydalanuvchi nomini kiriting";
  if (!form.value.email.trim()) return "Elektron pochtani kiriting";
  if (!form.value.password.trim()) return "Parolni kiriting";

  return null;
};

const submitForm = async () => {
  const error = validateRegister();
  if (error) {
    Toast.warning(error);
    return;
  }

  try {
    await useAuthService.register(form.value);
    Toast.success("Ro'yxatdan o'tdingiz. Endi tizimga kiring.");
    await router.push("/login");
  } catch {
  }
};
</script>
