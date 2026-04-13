<template>
  <div class="login-shell min-h-screen">
    <div class="login-grid min-h-screen">
      <section class="brand-panel hidden lg:flex">
        <div class="brand-orb brand-orb-one"></div>
        <div class="brand-orb brand-orb-two"></div>
        <div class="brand-grid"></div>

        <div class="brand-content">
          <div class="brand-badge">
            <div class="brand-badge-icon">
              <img class="w-14 brightness-0 invert" src="../assets/camera.png" alt="Photobook">
            </div>
            <span>PHOTOBOOK ERP</span>
          </div>

          <div class="space-y-6">
            <p class="brand-kicker">Photo studio operations platform</p>
            <h1 class="brand-title">Buyurtma, xodim va ishlab chiqarish nazorati bitta joyda.</h1>
            <p class="brand-copy">
              Ichki jarayonlarni tezroq yuritish, statuslarni kuzatish va kundalik ish oqimini aniq boshqarish uchun yagona tizim.
            </p>
          </div>

          <div class="brand-feature-list">
            <div class="brand-feature-card">
              <i class="fa-solid fa-layer-group"></i>
              <div>
                <h3>Buyurtmalar oqimi</h3>
                <p>Albom, vinetka va rasmli albomlar bo'yicha toza nazorat.</p>
              </div>
            </div>
            <div class="brand-feature-card">
              <i class="fa-solid fa-chart-line"></i>
              <div>
                <h3>Operativ statistika</h3>
                <p>Jarayondagi va bajarilgan ishlarni bir qarashda ko'rish.</p>
              </div>
            </div>
            <div class="brand-feature-card">
              <i class="fa-solid fa-boxes-stacked"></i>
              <div>
                <h3>Ombor va jamoa</h3>
                <p>Xomashyo, xodim va vazifalarni bir tizimdan boshqarish.</p>
              </div>
            </div>
          </div>

          <div class="brand-stats">
            <div>
              <strong>24/7</strong>
              <span>Ish oqimi nazorati</span>
            </div>
            <div>
              <strong>3</strong>
              <span>Asosiy mahsulot yo'nalishi</span>
            </div>
            <div>
              <strong>1</strong>
              <span>Yagona boshqaruv paneli</span>
            </div>
          </div>
        </div>
      </section>

      <section class="form-panel">
        <div class="form-orb form-orb-one"></div>
        <div class="form-orb form-orb-two"></div>

        <div class="w-full max-w-[440px] relative z-10">
          <div class="lg:hidden text-center mb-8">
            <div class="mobile-brand-icon">
              <img class="w-12 brightness-0 invert" src="../assets/camera.png" alt="Photobook">
            </div>
            <p class="mobile-brand-kicker">PHOTOBOOK ERP</p>
            <h2 class="mobile-brand-title">Hisobingizga kiring</h2>
          </div>

          <div class="auth-card">
            <div class="auth-card-top">
              <div>
                <p class="auth-eyebrow">Xush kelibsiz</p>
                <h2 class="auth-title">Tizimga kirish</h2>
                <p class="auth-copy">Davom ettirish uchun login va parolingizni kiriting.</p>
              </div>
              <div class="auth-icon hidden sm:flex">
                <i class="fa-solid fa-arrow-right-to-bracket"></i>
              </div>
            </div>

            <div class="auth-status">
              <span class="auth-status-dot"></span>
              Ichki boshqaruv paneli faol
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
                  text="Tizimga kirish"
                  class="w-full mt-2 login-submit"
                  variant="primary"
              />
            </form>

            <span v-if="errorMessage" class="error-banner">
              <i class="fa-solid fa-triangle-exclamation"></i>
              {{ errorMessage }}
            </span>

            <div class="auth-footer">
              <span>© 2026 PHOTOBOOK</span>
              <span>Barcha huquqlar himoyalangan.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppInput from "@/components/ui/AppInput.vue";
import CButton from "@/components/CButton.vue";
import { ref } from "vue";
import { UserLogin } from "@/typeModules/useModules";
import { authService } from "@/service/authService";
import { useToast } from "vue-toastification";

const Toast = useToast();
const useAuthService = authService();

const isPasswordVisible = ref(false);
const isPasswordEyeOpen = ref(false);
const errorMessage = ref("");

const form = ref<UserLogin>({
  username: "",
  password: "",
});

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
      await useAuthService.login({
        username: form.value.username,
        password: form.value.password,
      });
    }
  } catch (error: any) {
    console.log("Login error:", error);
    switch (true) {
      case error.message === "Network Error":
        Toast.warning("Serverda xatolik yuz berdi");
        break;
      case error.response.data.description === "The username or password is incorrect":
        Toast.warning("Foydalanuvchi nomi yoki parol xato.");
        break;
    }
  }
};
</script>

<style scoped>
.login-shell {
  font-family: "Avenir Next", "Segoe UI", "Helvetica Neue", sans-serif;
  background:
    radial-gradient(circle at top left, rgba(88, 134, 255, 0.28), transparent 35%),
    radial-gradient(circle at bottom right, rgba(21, 195, 154, 0.2), transparent 30%),
    linear-gradient(135deg, #07111f 0%, #0d1b32 55%, #10294a 100%);
}

.login-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  min-height: 100dvh;
}

.brand-panel,
.form-panel {
  position: relative;
  overflow: hidden;
}

.brand-panel {
  padding: 36px 42px;
  align-items: center;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0)),
    linear-gradient(135deg, rgba(10, 44, 92, 0.92), rgba(9, 21, 53, 0.88));
  border-right: 1px solid rgba(255,255,255,0.08);
}

.brand-content {
  position: relative;
  z-index: 2;
  max-width: 560px;
  color: #eff6ff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100%;
}

.brand-badge {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 12px 18px 12px 12px;
  margin-bottom: 20px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255,255,255,0.14);
  backdrop-filter: blur(18px);
}

.brand-badge-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 18px;
  background: linear-gradient(135deg, #3b82f6, #14b8a6);
  box-shadow: 0 20px 40px rgba(20, 184, 166, 0.22);
}

.brand-badge span,
.brand-kicker,
.mobile-brand-kicker,
.auth-eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 12px;
  font-weight: 700;
}

.brand-kicker {
  color: #7dd3fc;
}

.brand-title {
  font-size: clamp(34px, 4vw, 56px);
  line-height: 1;
  font-weight: 800;
  max-width: 10ch;
}

.brand-copy {
  max-width: 520px;
  font-size: 16px;
  line-height: 1.65;
  color: rgba(239, 246, 255, 0.8);
}

.brand-feature-list {
  margin-top: 24px;
  display: grid;
  gap: 12px;
}

.brand-feature-card {
  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 16px;
  align-items: start;
  padding: 14px;
  border-radius: 20px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.09);
  backdrop-filter: blur(12px);
}

.brand-feature-card i {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  color: #dcfce7;
  background: linear-gradient(135deg, rgba(20,184,166,0.9), rgba(59,130,246,0.9));
}

.brand-feature-card h3 {
  font-size: 16px;
  font-weight: 700;
}

.brand-feature-card p {
  margin-top: 4px;
  color: rgba(239, 246, 255, 0.72);
  line-height: 1.45;
  font-size: 14px;
}

.brand-stats {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.brand-stats div {
  padding: 14px;
  border-radius: 18px;
  background: rgba(4, 15, 34, 0.34);
  border: 1px solid rgba(125, 211, 252, 0.12);
}

.brand-stats strong {
  display: block;
  font-size: 22px;
  line-height: 1;
  color: #f8fafc;
}

.brand-stats span {
  display: block;
  margin-top: 8px;
  color: rgba(226, 232, 240, 0.75);
  font-size: 12px;
  line-height: 1.35;
}

.brand-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(125, 211, 252, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(125, 211, 252, 0.08) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: linear-gradient(to bottom, transparent, rgba(0,0,0,0.9) 15%, rgba(0,0,0,0.9) 85%, transparent);
}

.brand-orb,
.form-orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(18px);
}

.brand-orb-one {
  width: 320px;
  height: 320px;
  background: rgba(56, 189, 248, 0.24);
  top: -80px;
  right: -80px;
}

.brand-orb-two {
  width: 260px;
  height: 260px;
  background: rgba(16, 185, 129, 0.16);
  bottom: 40px;
  left: -90px;
}

.form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
}

.auth-card {
  position: relative;
  z-index: 2;
  padding: 22px;
  border-radius: 28px;
  background: rgba(250, 252, 255, 0.92);
  border: 1px solid rgba(255,255,255,0.65);
  box-shadow: 0 30px 80px rgba(5, 16, 39, 0.26);
  backdrop-filter: blur(20px);
}

.auth-card-top {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 12px;
}

.auth-eyebrow {
  color: #0f766e;
  margin-bottom: 10px;
}

.auth-title,
.mobile-brand-title {
  font-size: clamp(24px, 3vw, 34px);
  line-height: 1.05;
  font-weight: 800;
  color: #0f172a;
}

.auth-copy {
  margin-top: 8px;
  color: #475569;
  line-height: 1.5;
  font-size: 14px;
}

.auth-icon,
.mobile-brand-icon {
  align-items: center;
  justify-content: center;
  border-radius: 22px;
  background: linear-gradient(135deg, #0f766e, #2563eb);
  color: #fff;
  box-shadow: 0 16px 36px rgba(37, 99, 235, 0.25);
}

.auth-icon {
  width: 64px;
  height: 64px;
  font-size: 22px;
}

.mobile-brand-icon {
  display: inline-flex;
  width: 72px;
  height: 72px;
  margin-bottom: 16px;
}

.mobile-brand-kicker {
  color: #7dd3fc;
  margin-bottom: 10px;
}

.mobile-brand-title {
  color: #f8fafc;
}

.auth-status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding: 8px 12px;
  border-radius: 999px;
  background: #ecfeff;
  color: #155e75;
  font-size: 13px;
  font-weight: 600;
}

.auth-status-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #14b8a6;
  box-shadow: 0 0 0 6px rgba(20, 184, 166, 0.16);
}

.login-submit {
  background: linear-gradient(135deg, #0f766e 0%, #2563eb 100%);
  box-shadow: 0 18px 32px rgba(37, 99, 235, 0.25);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.login-submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 22px 38px rgba(37, 99, 235, 0.3);
}

.error-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: 16px;
  background: #fff1f2;
  color: #be123c;
  font-size: 14px;
  font-weight: 600;
}

.auth-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(148, 163, 184, 0.22);
  color: #64748b;
  font-size: 12px;
}

.form-orb-one {
  width: 240px;
  height: 240px;
  background: rgba(56, 189, 248, 0.18);
  top: 40px;
  right: 40px;
}

.form-orb-two {
  width: 220px;
  height: 220px;
  background: rgba(20, 184, 166, 0.14);
  bottom: 50px;
  left: 40px;
}

@media (max-width: 1023px) {
  .login-grid {
    grid-template-columns: 1fr;
  }

  .form-panel {
    padding: 20px 16px;
  }

  .auth-card {
    padding: 20px 16px;
    border-radius: 24px;
  }
}

@media (max-width: 640px) {
  .auth-footer {
    flex-direction: column;
    text-align: center;
  }

  .auth-card-top {
    margin-bottom: 14px;
  }
}
</style>
