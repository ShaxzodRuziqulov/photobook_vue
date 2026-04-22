<template>
  <div class="login-shell min-h-dvh">
    <div class="login-grid min-h-dvh">
      <section class="brand-panel hidden lg:flex">
        <div class="brand-orb brand-orb-one"></div>
        <div class="brand-orb brand-orb-two"></div>
        <div class="brand-grid"></div>

        <div class="brand-content login-brand-in">
          <div class="brand-badge login-brand-badge">
            <div class="brand-badge-icon">
              <img class="w-14 brightness-0 invert" src="../assets/camera.png" alt="Photobook">
            </div>
            <span>PHOTOBOOK ERP</span>
          </div>

          <div class="space-y-6 login-brand-block">
            <span class="brand-kicker">Photobook amallari platformasi</span>
            <h1 class="brand-title">Buyurtma, xodim va ishlab chiqarish nazorati bitta joyda.</h1>
            <p class="brand-copy">
              Ichki jarayonlarni tezroq yuritish, statuslarni kuzatish va kundalik ish oqimini aniq boshqarish uchun yagona tizim.
            </p>
          </div>

          <div class="brand-feature-list">
            <div class="brand-feature-card login-feature-card" style="--st: 0">
              <i class="fa-solid fa-layer-group"></i>
              <div>
                <h3>Buyurtmalar oqimi</h3>
                <p>Albom, vinetka va rasmli albomlar bo'yicha toza nazorat.</p>
              </div>
            </div>
            <div class="brand-feature-card login-feature-card" style="--st: 1">
              <i class="fa-solid fa-chart-line"></i>
              <div>
                <h3>Operativ statistika</h3>
                <p>Jarayondagi va bajarilgan ishlarni bir qarashda ko'rish.</p>
              </div>
            </div>
            <div class="brand-feature-card login-feature-card" style="--st: 2">
              <i class="fa-solid fa-boxes-stacked"></i>
              <div>
                <h3>Ombor va jamoa</h3>
                <p>Xomashyo, xodim va vazifalarni bir tizimdan boshqarish.</p>
              </div>
            </div>
          </div>

          <div class="brand-stats login-brand-stats">
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
        <div class="form-orb form-orb-one" aria-hidden="true"></div>
        <div class="form-orb form-orb-two" aria-hidden="true"></div>
        <div class="form-orb form-orb-three" aria-hidden="true"></div>

        <div class="form-inner w-full max-w-[440px] relative z-10">
          <div class="lg:hidden text-center mb-4 login-mobile-head">
            <div class="mobile-brand-icon">
              <img class="w-12 brightness-0 invert" src="../assets/camera.png" alt="Photobook">
            </div>
            <p class="mobile-brand-kicker">PHOTOBOOK ERP</p>
            <h2 class="mobile-brand-title">Hisobingizga kiring</h2>
          </div>

          <div class="auth-card login-auth-card-in">
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
                  placeholder="Foydalanuvchi nomini kiriting"
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
  if (!form.value.username?.trim()) return "Loginni kiriting";
  if (!form.value.password) return "Parolni kiriting";

  return null;
};

const submitLogin = async () => {
  const error = validateRegister();
  if (error) {
    errorMessage.value = error;
    return;
  }
  errorMessage.value = "";

  try {
    if (form.value.username && form.value.password) {
      await useAuthService.login({
        username: form.value.username,
        password: form.value.password,
      });
    }
  } catch (error: any) {
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
  position: relative;
  isolation: isolate;
  overflow: hidden;
  font-family: var(--font-sans, "Segoe UI", system-ui, sans-serif);
  background:
    radial-gradient(ellipse 75% 65% at 22% 24%, rgba(96, 165, 250, 0.42), transparent 58%),
    radial-gradient(ellipse 70% 60% at 82% 76%, rgba(45, 212, 191, 0.28), transparent 55%),
    linear-gradient(118deg, #040a12 0%, #0d1b32 38%, #153a66 52%, #0a1628 72%, #07111f 100%);
  background-size: 145% 145%, 135% 135%, 260% 260%;
  background-position: 0% 0%, 100% 100%, 12% 45%;
  animation: loginShellBgFlow 13s ease-in-out infinite alternate;
}

.login-shell::before {
  content: "";
  position: absolute;
  inset: -12%;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 58% 52% at 15% 32%, rgba(37, 99, 235, 0.42), transparent 60%),
    radial-gradient(ellipse 52% 48% at 88% 68%, rgba(20, 184, 166, 0.34), transparent 54%),
    radial-gradient(ellipse 45% 40% at 48% 8%, rgba(14, 165, 233, 0.2), transparent 50%);
  animation: loginAurora 10s ease-in-out infinite alternate;
}

.login-shell::after {
  content: "";
  position: absolute;
  inset: -20%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.85;
  background:
    conic-gradient(
      from 220deg at 50% 50%,
      transparent 0deg,
      rgba(59, 130, 246, 0.06) 60deg,
      transparent 120deg,
      rgba(20, 184, 166, 0.07) 200deg,
      transparent 280deg,
      rgba(125, 211, 252, 0.05) 320deg,
      transparent 360deg
    );
  animation: loginBgSpin 48s linear infinite;
}

.login-shell > * {
  position: relative;
  z-index: 1;
}

@keyframes loginShellBgFlow {
  0% {
    background-position: 0% 0%, 100% 0%, 8% 38%;
  }
  35% {
    background-position: 28% 22%, 72% 88%, 72% 28%;
  }
  70% {
    background-position: 12% 42%, 92% 18%, 88% 72%;
  }
  100% {
    background-position: 38% 8%, 0% 100%, 42% 52%;
  }
}

@keyframes loginAurora {
  0% {
    opacity: 0.68;
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
  100% {
    opacity: 1;
    transform: translate(4%, -3%) rotate(-6deg) scale(1.09);
  }
}

@keyframes loginBgSpin {
  from {
    transform: rotate(0deg) scale(1.05);
  }
  to {
    transform: rotate(360deg) scale(1.08);
  }
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
    radial-gradient(ellipse 100% 80% at 0% 50%, rgba(56, 189, 248, 0.14), transparent 62%),
    linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0)),
    linear-gradient(135deg, rgba(10, 44, 92, 0.92), rgba(9, 21, 53, 0.88));
  background-size: 180% 180%, 100% 100%, 140% 140%;
  background-position: 0% 50%, 0 0, 0% 0%;
  animation: loginBrandPanelBg 16s ease-in-out infinite alternate;
  border-right: 1px solid rgba(255,255,255,0.08);
}

@keyframes loginBrandPanelBg {
  0% {
    background-position: 0% 40%, 0 0, 0% 0%;
  }
  100% {
    background-position: 55% 60%, 0 0, 100% 100%;
  }
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
  animation: loginBadgePulse 3s ease-in-out infinite alternate;
}

@keyframes loginBadgePulse {
  from {
    box-shadow: 0 20px 40px rgba(20, 184, 166, 0.22);
  }
  to {
    box-shadow: 0 22px 52px rgba(59, 130, 246, 0.45);
  }
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
  font-size: clamp(24px, 4vw, 40px);
  line-height: 1;
  font-weight: 800;
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
  transition:
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.35s ease,
    background 0.35s ease;
}

.login-feature-card {
  animation: loginFadeUp 0.58s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(0.22s + var(--st, 0) * 0.08s);
}

.brand-feature-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
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
  background-position: 0 0, 0 0;
  mask-image: linear-gradient(to bottom, transparent, rgba(0,0,0,0.9) 15%, rgba(0,0,0,0.9) 85%, transparent);
  animation: loginGridPan 24s linear infinite;
}

@keyframes loginGridPan {
  to {
    background-position: 32px 32px, 32px 32px;
  }
}

.brand-orb,
.form-orb {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(22px);
  will-change: transform;
}

.brand-orb-one {
  width: 320px;
  height: 320px;
  background: rgba(56, 189, 248, 0.24);
  top: -80px;
  right: -80px;
  animation: loginBrandBubbleA 12s ease-in-out infinite;
}

.brand-orb-two {
  width: 260px;
  height: 260px;
  background: rgba(16, 185, 129, 0.16);
  bottom: 40px;
  left: -90px;
  animation: loginBrandBubbleB 15s ease-in-out infinite;
  animation-delay: -3s;
}

@keyframes loginBrandBubbleA {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(-28px, 22px) scale(1.07);
  }
  66% {
    transform: translate(14px, 36px) scale(1.03);
  }
}

@keyframes loginBrandBubbleB {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  40% {
    transform: translate(22px, -26px) scale(1.09);
  }
  80% {
    transform: translate(-18px, 12px) scale(0.98);
  }
}

.form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background:
    radial-gradient(ellipse 90% 70% at 50% -10%, rgba(56, 189, 248, 0.12), transparent 55%),
    radial-gradient(ellipse 80% 60% at 100% 100%, rgba(20, 184, 166, 0.1), transparent 50%),
    linear-gradient(165deg, rgba(7, 17, 31, 0.35) 0%, rgba(13, 27, 50, 0.2) 100%);
  background-size: 120% 120%, 110% 110%, 200% 200%;
  background-position: 50% 0%, 100% 100%, 0% 50%;
  animation: loginFormPanelBg 15s ease-in-out infinite alternate;
}

@keyframes loginFormPanelBg {
  0% {
    background-position: 40% 0%, 100% 80%, 0% 40%;
  }
  100% {
    background-position: 60% 20%, 85% 100%, 100% 60%;
  }
}

.form-inner {
  animation: loginFadeUp 0.68s 0.06s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.login-mobile-head {
  animation: loginFadeUp 0.58s 0.04s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.login-brand-badge {
  animation: loginFadeUp 0.62s 0.04s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.login-brand-block {
  animation: loginFadeUp 0.66s 0.1s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.login-brand-stats {
  animation: loginFadeUp 0.66s 0.22s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes loginFadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  overflow: hidden;
}

.login-auth-card-in {
  animation: loginFadeUp 0.74s 0.12s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.auth-card::after {
  content: "";
  position: absolute;
  inset: -50% -70%;
  background: linear-gradient(
    102deg,
    transparent 35%,
    rgba(255, 255, 255, 0.38) 50%,
    transparent 65%
  );
  transform: translateX(-40%) rotate(11deg);
  animation: loginCardSheen 6.5s ease-in-out infinite;
  pointer-events: none;
  opacity: 0.4;
}

@keyframes loginCardSheen {
  0%,
  100% {
    transform: translateX(-48%) rotate(11deg);
    opacity: 0.28;
  }
  50% {
    transform: translateX(38%) rotate(11deg);
    opacity: 0.5;
  }
}

.auth-card > * {
  position: relative;
  z-index: 1;
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
  margin-bottom: 8px;
}

.auth-title,
.mobile-brand-title {
  font-size: clamp(24px, 3vw, 30px);
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
  animation: loginStatusPulse 1.5s ease-in-out infinite;
}

@keyframes loginStatusPulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(20, 184, 166, 0.16);
  }
  50% {
    transform: scale(1.08);
    box-shadow: 0 0 0 11px rgba(20, 184, 166, 0.07);
  }
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
  width: min(52vw, 320px);
  height: min(52vw, 320px);
  background: rgba(56, 189, 248, 0.22);
  top: 6%;
  right: 4%;
  animation: loginFormBubbleA 14s ease-in-out infinite;
}

.form-orb-two {
  width: min(48vw, 280px);
  height: min(48vw, 280px);
  background: rgba(20, 184, 166, 0.16);
  bottom: 8%;
  left: 6%;
  animation: loginFormBubbleB 17s ease-in-out infinite;
  animation-delay: -4s;
}

.form-orb-three {
  width: min(56vw, 340px);
  height: min(56vw, 340px);
  background: radial-gradient(
    circle at 40% 40%,
    rgba(125, 211, 252, 0.2) 0%,
    rgba(56, 189, 248, 0.1) 45%,
    transparent 70%
  );
  top: 36%;
  left: -12%;
  opacity: 0.92;
  animation: loginFormBubbleC 19s ease-in-out infinite;
  animation-delay: -8s;
}

@keyframes loginFormBubbleA {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(28px, 22px) scale(1.06);
  }
  50% {
    transform: translate(-14px, 48px) scale(1.02);
  }
  75% {
    transform: translate(-36px, 10px) scale(1.08);
  }
}

@keyframes loginFormBubbleB {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(-32px, -18px) scale(1.05);
  }
  50% {
    transform: translate(24px, -42px) scale(1.1);
  }
  75% {
    transform: translate(40px, 12px) scale(0.97);
  }
}

@keyframes loginFormBubbleC {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(52px, -28px) scale(1.08);
  }
  66% {
    transform: translate(-24px, 36px) scale(0.96);
  }
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

@media (prefers-reduced-motion: reduce) {
  .login-shell,
  .login-shell::before,
  .login-shell::after,
  .form-panel,
  .brand-panel,
  .brand-grid,
  .brand-orb-one,
  .brand-orb-two,
  .form-orb-one,
  .form-orb-two,
  .form-orb-three,
  .brand-badge-icon,
  .auth-card::after,
  .auth-status-dot,
  .login-feature-card,
  .form-inner,
  .login-mobile-head,
  .login-brand-badge,
  .login-brand-block,
  .login-brand-stats,
  .login-auth-card-in {
    animation: none !important;
  }

  .login-feature-card:hover {
    transform: none;
  }
}
</style>
