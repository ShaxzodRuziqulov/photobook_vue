<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Branding -->
    <div class="hidden lg:flex lg:w-1/2 split-left items-center justify-center p-12 relative">
      <div class="scan-line"></div>

      <div class="relative z-10 text-center">
        <!-- Animated Logo -->
        <div class="mb-8 float">
          <div class="inline-flex items-center justify-center w-32 h-32 logo-glow rounded-3xl bg-white/10 backdrop-blur-xl mb-6">
          <img class="w-16 brightness-0 invert" src="../assets/camera.png" alt="">

          </div>
        </div>

        <!-- Title -->
        <h1 class="text-6xl font-bold text-white mb-4 uppercase tracking-tight">
          Photobook
        </h1>
        <p class="text-2xl text-white/90 mb-8 font-light">
          Professional Management System
        </p>

        <!-- Features -->
        <div class="space-y-4 text-white/80">
          <div class="flex items-center justify-center gap-3">
            <i class="fa-solid fa-check"></i>
            <span class="text-lg">Buyurtmalarni boshqarish</span>
          </div>
          <div class="flex items-center justify-center gap-3">
            <i class="fa-solid fa-check"></i>
            <span class="text-lg">Real-time statistika</span>
          </div>
          <div class="flex items-center justify-center gap-3">
            <i class="fa-solid fa-check"></i>
            <span class="text-lg">Omborxona nazorati</span>
          </div>
          <div class="flex items-center justify-center gap-3">
            <i class="fa-solid fa-check"></i>
            <span class="text-lg">Xodimlar nazorati</span>
          </div>
        </div>

        <!-- Decorative Elements -->
        <div class="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
        <div class="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="w-full lg:w-1/2 premium-bg flex items-center justify-center p-4 relative">
      <div class="scan-line"></div>
      <div class="w-full max-w-lg relative z-10">
        <div class="lg:hidden text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 logo-glow rounded-2xl bg-white/10 backdrop-blur-xl mb-4">
            <img class="w-16 brightness-0 invert" src="../assets/camera.png" alt="">
          </div>
          <h2 class="text-3xl font-bold text-white uppercase">Photobook</h2>
        </div>
        <div class="bg-white rounded-2xl flex flex-col w-full p-4 max-w-md gap-2 shadow-2xl">
          <div class="mb-4 flex flex-col p-4">
            <h2 class="text-3xl font-bold text-gray-800 mb-2">Xush kelibsiz! 👋</h2>
            <p class="text-gray-600">Davom ettirish uchun hisobingizga kiring!</p>
          </div>
          <form
              @submit.prevent="submitLogin"
              class="flex flex-col gap-4"
          >
            <AppInput
                type="text"
                label="Login"
                v-model="form.username"
                placeholder="Login kiriting"
            />
            <AppInput
                label="Parol"
                :type="isPasswordVisible ? 'text' : 'password'"
                :hasIcon="isPasswordEyeOpen"
                :iconSrc="isPasswordVisible ? 'images/svg/eye-open.svg' : 'images/svg/eye-password-hide-svgrepo-com.svg'"
                iconSize="20"
                @iconClick="isPasswordVisible = !isPasswordVisible"
                @input="isPasswordEyeOpen = form.password.length > 0"
                placeholder="Parol kiriting"
                v-model="form.password"
                required
            />
            <CButton
                type="submit"
                text="Login"
                class="w-full mt-4 btn-premium"
                variant="primary"
            />
          </form>
          <span v-if="errorMessage" class="text-red-400 gap-2 text-sm w-full items-center justify-center flex mt-2">
            <i class="fa-solid fa-triangle-exclamation"></i>
            {{errorMessage}}
          </span>
          <div class="text-center text-md mt-4">
            © 2026 PHOTOBOOK. <span class="text-sm text-gray-700">Barcha huquqlar himoyalangan.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppInput from "@/components/ui/AppInput.vue";
import CButton from "@/components/CButton.vue";
import { ref } from "vue";
import { UserLogin } from "@/typeModules/useModules";
import {authService} from "@/service/authService";
import { useToast } from "vue-toastification";

const Toast = useToast();
const useAuthService = authService();

const isPasswordVisible = ref(false);
const isPasswordEyeOpen = ref(false);
const errorMessage = ref("");

const form = ref<UserLogin>({
  username: "",
  password: "",
})

const validateRegister = () => {
  if (!form.value.username) return "Name is required";
  if (!form.value.password) return "Password is required";

  return null;
};


const submitLogin = async () => {
  const error = validateRegister();
  if (error) {
    errorMessage.value = error;
    return;
  }
  try {
    if (form.value.username && form.value.password) {
      console.log('form', form.value)
      console.log('2222',form.value.username);
      await useAuthService.login({
        username: form.value.username,
        password: form.value.password,
      });

    }
  } catch (error: any) {
    console.log("Login error:", error);
    switch (true) {
      case error.message === 'Network Error':
        Toast.warning('Serverda xatolik yuz berdi');
        break;
      case error.response.data.description === 'The username or password is incorrect':
        Toast.warning('Foydalanuvchi nomi yoki parol xato.');
        break;
    }
  }finally
  {
    console.log('final',form.value.username);
  }
}

</script>
<style>

body {
  font-family: "Avenir", "Times New Roman", Arial, sans-serif sans-serif;
}

.premium-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.premium-bg::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: moveGrid 20s linear infinite;
}

@keyframes moveGrid {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

.glass-premium {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.input-premium {
  background: rgba(103, 126, 234, 0.05);
  border: 2px solid rgba(103, 126, 234, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-premium:focus {
  background: rgba(103, 126, 234, 0.08);
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(103, 126, 234, 0.1);
  transform: translateY(-2px);
}

.btn-premium {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 10px 30px rgba(103, 126, 234, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn-premium::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-premium:hover::before {
  width: 300px;
  height: 300px;
}

.btn-premium:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(103, 126, 234, 0.5);
}

.btn-premium:active {
  transform: translateY(-1px);
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  pointer-events: none;
  animation: rise 8s infinite;
}

@keyframes rise {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-1000px) scale(0);
    opacity: 0;
  }
}

.logo-glow {
  box-shadow: 0 0 40px rgba(103, 126, 234, 0.6),
  0 0 80px rgba(118, 75, 162, 0.4);
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 40px rgba(103, 126, 234, 0.6),
    0 0 80px rgba(118, 75, 162, 0.4);
  }
  50% {
    box-shadow: 0 0 60px rgba(103, 126, 234, 0.8),
    0 0 100px rgba(118, 75, 162, 0.6);
  }
}

.scan-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(103, 126, 234, 0.8), transparent);
  animation: scan 4s linear infinite;
}

@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}

.checkbox-premium {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #667eea;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.checkbox-premium:checked {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #764ba2;
}

.checkbox-premium:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.split-left {
  background: linear-gradient(135deg, rgba(103, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
  position: relative;
  overflow: hidden;
}

.tilt-card {
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}

</style>
