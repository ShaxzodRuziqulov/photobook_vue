<template>
  <section class="profile-page flex w-full min-w-0 flex-col justify-start px-4 py-8 sm:px-6 lg:min-h-full lg:justify-center">
    <span class="profile-bg-sheen" aria-hidden="true"></span>
    <div class="profile-page__inner mx-auto w-full max-w-3xl lg:max-w-4xl">
      <div v-if="isInitialLoading" class="space-y-3 rounded-xl border border-pb-border bg-pb-surface p-4 shadow-sm">
        <div class="h-6 w-40 rounded skeleton-shimmer" />
        <div class="flex gap-3 sm:gap-4">
          <div class="h-16 w-16 shrink-0 rounded-full skeleton-shimmer sm:h-[4.5rem] sm:w-[4.5rem]" />
          <div class="min-w-0 flex-1 space-y-2 pt-1">
            <div class="h-4 w-3/4 max-w-xs rounded skeleton-shimmer" />
            <div class="h-3 w-1/2 rounded skeleton-shimmer" />
          </div>
        </div>
        <div class="grid gap-2 sm:grid-cols-2">
          <div v-for="i in 4" :key="i" class="h-12 rounded-lg skeleton-shimmer" />
        </div>
        <div class="h-20 rounded-lg skeleton-shimmer" />
      </div>

      <template v-else>
        <header class="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div class="min-w-0">
            <p class="text-[11px] font-bold uppercase tracking-wide text-pb-accent">Profil</p>
            <h1 class="truncate text-lg font-bold text-pb-text sm:text-xl">{{ profileTitle }}</h1>
          </div>
          <CButton
              type="button"
              text="Orqaga"
              variant="outline-primary"
              size="sm"
              is-has-fa-icon
              fa-class="fa-solid fa-arrow-left"
              @click="router.back()"
          />
        </header>

        <!-- ─── Statistika paneli ─── -->
        <section v-if="statsLoaded" class="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

          <!-- Oylik ish (operator) -->
          <template v-if="isOperator">
            <div class="stat-card col-span-2 sm:col-span-1">
              <div class="stat-icon bg-blue-50 text-blue-600"><i class="fa-solid fa-chart-line"></i></div>
              <div class="min-w-0">
                <p class="stat-label">Bu oy</p>
                <p class="stat-value">{{ myMonthly }} <span class="stat-unit">ta</span></p>
                <p class="stat-sub" :class="monthGrowth >= 0 ? 'text-emerald-600' : 'text-red-500'">
                  <i :class="monthGrowth >= 0 ? 'fa-solid fa-arrow-trend-up' : 'fa-solid fa-arrow-trend-down'"></i>
                  {{ monthGrowth >= 0 ? '+' : '' }}{{ monthGrowth }}% o'tgan oyga nisbatan
                </p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon bg-violet-50 text-violet-600"><i class="fa-solid fa-calendar-check"></i></div>
              <div class="min-w-0">
                <p class="stat-label">O'tgan oy</p>
                <p class="stat-value">{{ myLastMonthly }} <span class="stat-unit">ta</span></p>
              </div>
            </div>

            <div class="stat-card" :class="overdueCount > 0 ? 'border-red-200 bg-red-50' : ''">
              <div class="stat-icon" :class="overdueCount > 0 ? 'bg-red-100 text-red-600' : 'bg-amber-50 text-amber-600'">
                <i class="fa-solid fa-clock"></i>
              </div>
              <div class="min-w-0">
                <p class="stat-label">Muddati o'tgan</p>
                <p class="stat-value" :class="overdueCount > 0 ? 'text-red-600' : ''">{{ overdueCount }} <span class="stat-unit">ta</span></p>
                <p v-if="dueTodayCount > 0" class="stat-sub text-amber-600">
                  <i class="fa-solid fa-triangle-exclamation"></i> Bugun: {{ dueTodayCount }} ta
                </p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon bg-emerald-50 text-emerald-600"><i class="fa-solid fa-list-check"></i></div>
              <div class="min-w-0">
                <p class="stat-label">Faol vazifalar</p>
                <p class="stat-value">{{ activeTasks.length }} <span class="stat-unit">ta</span></p>
              </div>
            </div>
          </template>

          <!-- Admin/Menejer uchun jamoa ko'rsatkichlari -->
          <template v-else-if="isAdminOrManager">
            <div class="stat-card">
              <div class="stat-icon bg-blue-50 text-blue-600"><i class="fa-solid fa-users"></i></div>
              <div class="min-w-0">
                <p class="stat-label">Jami xodimlar</p>
                <p class="stat-value">{{ leaderboard.length }} <span class="stat-unit">ta</span></p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon bg-emerald-50 text-emerald-600"><i class="fa-solid fa-trophy"></i></div>
              <div class="min-w-0">
                <p class="stat-label">Yetakchi (bu oy)</p>
                <p class="stat-value truncate">{{ leaderboard[0]?.employeeFullName || '—' }}</p>
                <p v-if="leaderboard[0]" class="stat-sub">{{ leaderboard[0].totalDelta }} ta ish</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon bg-violet-50 text-violet-600"><i class="fa-solid fa-chart-bar"></i></div>
              <div class="min-w-0">
                <p class="stat-label">Jami ish (bu oy)</p>
                <p class="stat-value">{{ totalTeamWork }} <span class="stat-unit">ta</span></p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon bg-amber-50 text-amber-600"><i class="fa-solid fa-calculator"></i></div>
              <div class="min-w-0">
                <p class="stat-label">O'rtacha (kishi)</p>
                <p class="stat-value">{{ avgTeamWork }} <span class="stat-unit">ta</span></p>
              </div>
            </div>
          </template>
        </section>

        <!-- Operator faol vazifalar -->
        <section v-if="statsLoaded && isOperator && activeTasks.length" class="mb-3 rounded-xl border border-pb-border bg-pb-surface p-3 shadow-sm sm:p-4">
          <h2 class="mb-3 text-sm font-bold text-pb-text flex items-center gap-2">
            <i class="fa-solid fa-list-check text-pb-accent"></i>
            Faol vazifalar
          </h2>
          <div class="space-y-3">
            <div v-for="task in activeTasks.slice(0, 5)" :key="task.id" class="task-progress-item">
              <div class="flex min-w-0 items-center justify-between gap-2">
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold text-pb-text">{{ task.orderName }}</p>
                  <p class="text-xs text-pb-muted">{{ task.categoryName }} · {{ kindLabel[task.kind] }}</p>
                </div>
                <div class="shrink-0 text-right">
                  <span class="text-sm font-bold text-pb-text">{{ task.processedCount ?? 0 }}/{{ task.availableToProcess ?? 0 }}</span>
                  <p class="text-[11px] text-pb-muted">{{ taskPercent(task) }}%</p>
                </div>
              </div>
              <div class="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-pb-border">
                <div
                  class="h-full rounded-full transition-[width] duration-500"
                  :class="taskPercent(task) >= 100 ? 'bg-emerald-500' : taskPercent(task) >= 60 ? 'bg-pb-accent' : 'bg-amber-400'"
                  :style="{ width: taskPercent(task) + '%' }"
                />
              </div>
              <div v-if="task.deadline" class="mt-1 flex items-center gap-1 text-[11px]" :class="isOverdue(task.deadline) ? 'text-red-500' : isDueToday(task.deadline) ? 'text-amber-600' : 'text-pb-muted'">
                <i class="fa-regular fa-calendar"></i>
                Muddat: {{ formatDeadline(task.deadline) }}
                <span v-if="isOverdue(task.deadline)" class="font-semibold"> · Kechikkan</span>
                <span v-else-if="isDueToday(task.deadline)" class="font-semibold"> · Bugun!</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Admin leaderboard -->
        <section v-if="statsLoaded && isAdminOrManager && leaderboard.length" class="mb-3 rounded-xl border border-pb-border bg-pb-surface shadow-sm overflow-hidden">
          <div class="flex items-center justify-between px-4 py-3 border-b border-pb-border">
            <h2 class="text-sm font-bold text-pb-text flex items-center gap-2">
              <i class="fa-solid fa-ranking-star text-pb-accent"></i>
              Xodimlar reytingi — {{ currentMonthLabel }}
            </h2>
          </div>
          <div class="divide-y divide-pb-border">
            <div
              v-for="(emp, idx) in leaderboard.slice(0, 8)"
              :key="emp.employeeId"
              class="flex items-center gap-3 px-4 py-2.5"
            >
              <span class="w-6 shrink-0 text-center text-sm font-bold" :class="idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-700' : 'text-pb-muted'">
                {{ idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1 }}
              </span>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-pb-text">{{ emp.employeeFullName || emp.employeeId }}</p>
                <div class="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-pb-border">
                  <div
                    class="h-full rounded-full bg-pb-accent"
                    :style="{ width: leaderboard[0]?.totalDelta ? (emp.totalDelta / leaderboard[0].totalDelta * 100) + '%' : '0%' }"
                  />
                </div>
              </div>
              <span class="shrink-0 text-sm font-bold tabular-nums text-pb-text">{{ emp.totalDelta }}</span>
            </div>
          </div>
        </section>

        <form class="grid gap-3 lg:grid-cols-[minmax(0,1fr)_15.5rem]" @submit.prevent="profileSubmit">
          <div class="space-y-3">
            <section class="overflow-hidden rounded-xl border border-pb-border bg-pb-surface shadow-sm">
              <div class="profile-cover h-2" />
              <div class="-mt-1 px-3 pb-3 pt-2 sm:px-4">
                <div class="flex flex-wrap items-center gap-3 sm:gap-4">
                  <button
                      type="button"
                      class="group relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[3px] border-white bg-pb-elevated shadow ring-1 ring-pb-border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-pb-accent sm:h-[4.5rem] sm:w-[4.5rem]"
                      :disabled="avatarBusy"
                      aria-label="Profil rasmini tanlash"
                      @click="profileImageInput?.click()"
                  >
                    <img
                        v-if="avatarPreview || form.avatarUrl"
                        class="h-full w-full rounded-full object-cover object-center"
                        :src="avatarPreview || getAvatarUrl(form.avatarUrl)"
                        alt=""
                        @error="onImgError"
                    />
                    <span v-else class="avatar-initials text-base sm:text-lg">{{ initials }}</span>
                    <span class="avatar-overlay text-base sm:text-lg">
                      <i class="fa-solid fa-camera" aria-hidden="true"></i>
                    </span>
                    <span v-if="avatarBusy" class="avatar-busy">
                      <svg class="h-6 w-6 animate-spin text-white sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    </span>
                  </button>

                  <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-1.5">
                      <span class="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">Faol</span>
                      <span v-if="roleLabel" class="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                        {{ roleLabel }}
                      </span>
                    </div>
                    <p class="mt-0.5 truncate text-xs text-pb-muted">
                      <span class="font-mono">@{{ form.username || "-" }}</span>
                      <span v-if="form.profession" class="text-slate-300"> · </span>
                      <span v-if="form.profession">{{ form.profession }}</span>
                    </p>
                  </div>

                  <div class="flex w-full gap-1.5 sm:w-auto sm:shrink-0">
                    <CButton
                        type="button"
                        text="Rasm"
                        variant="outline-accent"
                        size="sm"
                        class="min-w-0 flex-1 sm:flex-none"
                        is-has-fa-icon
                        fa-class="fa-solid fa-folder-open"
                        :disabled="avatarBusy"
                        @click="profileImageInput?.click()"
                    />
                    <CButton
                        v-if="form.avatarUrl || avatarPreview"
                        type="button"
                        text=""
                        variant="danger"
                        size="sm"
                        class="shrink-0"
                        is-has-fa-icon
                        fa-class="fa-regular fa-trash-can"
                        :disabled="avatarBusy"
                        @click="removeAvatar"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section class="rounded-xl border border-pb-border bg-pb-surface p-3 shadow-sm sm:p-4">
              <h2 class="mb-2 text-sm font-bold text-pb-text">Asosiy ma'lumotlar</h2>
              <div class="grid gap-3 sm:grid-cols-2">
                <AppInput label="Ism" placeholder="Masalan: Jamshid" type="text" v-model="form.firstName" />
                <AppInput label="Familiya" placeholder="Masalan: Karimov" type="text" v-model="form.lastName" />
                <AppInput label="Kasb" placeholder="Dizayner, operator..." type="text" v-model="form.profession" />
                <AppInput label="Telefon" placeholder="+998 90 123 45 67" type="text" v-model="form.phone" />
              </div>
              <h2 class="mb-2 mt-3 text-sm font-bold text-pb-text">Bio</h2>
              <AppInput
                  label="Qisqa tavsif"
                  placeholder="Tajriba yoki lavozim bo'yicha qisqa izoh..."
                  type="text"
                  :is-textarea="true"
                  :maxlength="500"
                  v-model="form.bio"
              />
            </section>
          </div>

          <aside class="space-y-3 lg:sticky lg:top-16 lg:self-start">
            <section
                class="relative rounded-xl border border-pb-border bg-pb-surface p-3 shadow-sm transition"
                :class="isDragOver ? 'border-pb-accent bg-blue-50/50 ring-2 ring-pb-accent/15' : ''"
                @dragenter.prevent="onAvatarDragEnter"
                @dragleave.prevent="onAvatarDragLeave"
                @dragover.prevent="onAvatarDragOver"
                @drop.prevent="onAvatarDrop"
            >
              <input
                  ref="profileImageInput"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
                  class="sr-only"
                  @change="onFileInputChange"
              />

              <div
                  v-if="isDragOver"
                  class="pointer-events-none absolute inset-2 z-10 flex items-center justify-center rounded-lg border-2 border-dashed border-pb-accent bg-white/85 text-center text-xs font-semibold text-pb-accent"
              >
                <span><i class="fa-solid fa-cloud-arrow-up mr-1" aria-hidden="true"></i>Rasmni tashlang</span>
              </div>

              <h2 class="text-sm font-bold text-pb-text">Profil rasmi</h2>
              <p class="mt-0.5 text-xs leading-snug text-pb-muted">JPG, PNG, WebP, GIF · max {{ maxAvatarMb }} MB · sudrab yoki Ctrl+V</p>

              <button
                  type="button"
                  class="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-pb-border bg-pb-elevated px-2 py-2.5 text-xs font-semibold text-pb-text transition hover:border-pb-accent hover:bg-blue-50/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-pb-accent"
                  :disabled="avatarBusy"
                  @click="profileImageInput?.click()"
              >
                <i class="fa-solid fa-upload text-pb-accent" aria-hidden="true"></i>
                Tanlash
              </button>

              <div
                  v-if="avatarUploading && uploadProgress > 0 && uploadProgress < 100"
                  class="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"
              >
                <div
                    class="h-full rounded-full bg-pb-accent transition-[width] duration-150 ease-out"
                    :style="{ width: uploadProgress + '%' }"
                />
              </div>

              <p v-if="pendingFileLabel" class="mt-2 rounded-md bg-blue-50 px-2 py-1.5 text-xs text-pb-accent">
                <i class="fa-regular fa-circle-check mr-0.5" aria-hidden="true"></i>
                {{ pendingFileLabel }}
                <span class="text-pb-muted"> — saqlanganda yuklanadi</span>
              </p>
              <p v-if="avatarFileError" class="mt-2 rounded-md bg-red-50 px-2 py-1.5 text-xs font-medium text-pb-error">
                {{ avatarFileError }}
              </p>
            </section>

            <section class="rounded-xl border border-pb-border bg-pb-surface p-3 shadow-sm">
              <div class="grid gap-2">
                <CButton
                    type="submit"
                    text="Saqlash"
                    variant="primary"
                    size="md"
                    class="w-full"
                    :loading="isSaving"
                    :disabled="profileSaveDisabled"
                    is-has-fa-icon
                    fa-class="fa-solid fa-check"
                />
                <CButton
                    type="button"
                    text="Bekor qilish"
                    variant="ghost-accent"
                    size="sm"
                    class="w-full"
                    :disabled="isSaving || avatarBusy"
                    @click="discardChanges"
                />
              </div>
            </section>
          </aside>
        </form>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import AppInput from "@/components/ui/AppInput.vue";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import CButton from "@/components/CButton.vue";
import { authService } from "@/service/authService";
import axiosInstance from "@/axios";
import axios from "axios";
import { useRouter } from "vue-router";
import type { UserForm, UserTask, MonthlyWorkReport } from "@/typeModules/useModules";
import { useToast } from "vue-toastification";
import { snapshotProfileMePatch } from "@/utils/updateFormDirty";

const router = useRouter();
const auth = authService();
const Toast = useToast();

const MAX_AVATAR_BYTES = 12 * 1024 * 1024;
const MAX_IMAGE_SIDE_PX = 1600;
const JPEG_QUALITY = 0.88;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const BLOCKED_MIME = new Set(["image/heic", "image/heif"]);

const isInitialLoading = ref(true);
const isSaving = ref(false);
const avatarUploading = ref(false);
const isPreparingImage = ref(false);
const uploadProgress = ref(0);
const isDragOver = ref(false);
let avatarDragDepth = 0;

const selectedFile = ref<File | null>(null);
const avatarPreview = ref("");
const avatarFileError = ref("");
const profileImageInput = ref<HTMLInputElement>();

const maxAvatarMb = Math.round(MAX_AVATAR_BYTES / (1024 * 1024));

const avatarBusy = computed(
    () => avatarUploading.value || isPreparingImage.value,
);

const pendingFileLabel = computed(() => {
  if (!selectedFile.value) return "";
  return `${formatBytes(selectedFile.value.size)} - ${mimeShortLabel(selectedFile.value)}`;
});

const BASE_URL = import.meta.env.VITE_BASE_API as string;

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(n < 10_240 ? 1 : 0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function mimeShortLabel(file: File): string {
  if (file.type === "image/jpeg") return "JPEG";
  if (file.type === "image/png") return "PNG";
  if (file.type === "image/webp") return "WebP";
  if (file.type === "image/gif") return "GIF";
  return file.type.replace("image/", "").toUpperCase() || "Rasm";
}

function validateAvatarFile(file: File): "size" | "type" | "heic" | null {
  if (BLOCKED_MIME.has(file.type)) return "heic";
  const okMime = ALLOWED_MIME.has(file.type);
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const okExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext);
  if (!okMime && !okExt) return "type";
  if (file.size > MAX_AVATAR_BYTES) return "size";
  return null;
}

const avatarErrorText: Record<"size" | "type" | "heic", string> = {
  size: `Fayl juda katta (max ~${maxAvatarMb} MB).`,
  type: "Faqat JPG, PNG, WebP yoki GIF yuklang.",
  heic: "HEIC/HEIF qo'llab-quvvatlanmaydi - JPG yoki PNG eksport qiling.",
};

async function prepareAvatarImage(file: File): Promise<File> {
  if (file.type === "image/gif") return file;

  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    const loaded = new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("decode"));
      img.src = url;
    });
    const image = await loaded;

    const w0 = image.naturalWidth || image.width;
    const h0 = image.naturalHeight || image.height;
    if (!w0 || !h0) return file;

    const maxSide = Math.max(w0, h0);
    const needsResize = maxSide > MAX_IMAGE_SIDE_PX;
    const needsShrinkBytes =
        file.size > 450 * 1024 && file.type !== "image/gif";

    if (!needsResize && !needsShrinkBytes) return file;

    let w = w0;
    let h = h0;
    if (needsResize) {
      const scale = MAX_IMAGE_SIDE_PX / maxSide;
      w = Math.max(1, Math.round(w0 * scale));
      h = Math.max(1, Math.round(h0 * scale));
    }

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    if (file.type === "image/jpeg" || file.type === "image/webp") {
      ctx.drawImage(image, 0, 0, w, h);
      const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), "image/jpeg", JPEG_QUALITY),
      );
      if (blob && blob.size < file.size * 0.97) {
        const base = file.name.replace(/\.[^.]+$/, "") || "avatar";
        return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
      }
      return file;
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(image, 0, 0, w, h);

    const pngBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png"),
    );
    if (pngBlob && pngBlob.size < file.size * 0.97) {
      const base = file.name.replace(/\.[^.]+$/, "") || "avatar";
      return new File([pngBlob], `${base}.png`, { type: "image/png" });
    }

    const jpegBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/jpeg", JPEG_QUALITY),
    );
    if (jpegBlob) {
      const base = file.name.replace(/\.[^.]+$/, "") || "avatar";
      return new File([jpegBlob], `${base}.jpg`, { type: "image/jpeg" });
    }
    return file;
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function applyAvatarFile(file: File) {
  avatarFileError.value = "";
  const code = validateAvatarFile(file);
  if (code) {
    avatarFileError.value = avatarErrorText[code];
    Toast.error(avatarFileError.value);
    return;
  }

  isPreparingImage.value = true;
  try {
    const prepared = await prepareAvatarImage(file);
    revokeAvatarPreview();
    selectedFile.value = prepared;
    avatarPreview.value = URL.createObjectURL(prepared);
  } catch {
    Toast.error("Rasmni tayyorlashda xatolik");
  } finally {
    isPreparingImage.value = false;
  }
  if (profileImageInput.value) profileImageInput.value.value = "";
}

function onAvatarDragEnter() {
  avatarDragDepth += 1;
  isDragOver.value = true;
}

function onAvatarDragLeave() {
  avatarDragDepth -= 1;
  if (avatarDragDepth <= 0) {
    avatarDragDepth = 0;
    isDragOver.value = false;
  }
}

function onAvatarDragOver(e: DragEvent) {
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
}

async function onAvatarDrop(e: DragEvent) {
  e.preventDefault();
  avatarDragDepth = 0;
  isDragOver.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (file) await applyAvatarFile(file);
}

async function onFileInputChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) await applyAvatarFile(file);
}

async function onWindowPaste(e: ClipboardEvent) {
  const el = e.target as HTMLElement | null;
  if (el?.closest("input, textarea, select, [contenteditable=true]")) return;
  const items = e.clipboardData?.items;
  if (!items?.length) return;
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (it.kind !== "file") continue;
    const f = it.getAsFile();
    if (f && f.type.startsWith("image/")) {
      e.preventDefault();
      await applyAvatarFile(f);
      break;
    }
  }
}

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

const profileSaveBaseline = ref("");

function refreshProfileSaveBaseline() {
  profileSaveBaseline.value = snapshotProfileMePatch(
    {
      firstName: form.firstName,
      lastName: form.lastName,
      profession: form.profession,
      phone: form.phone ?? "",
      bio: form.bio,
      avatarUrl: form.avatarUrl,
      uploadId: form.uploadId,
    },
    !!selectedFile.value,
  );
}

const profileSaveDisabled = computed(() => {
  if (isSaving.value || avatarBusy.value) return true;
  const cur = snapshotProfileMePatch(
    {
      firstName: form.firstName,
      lastName: form.lastName,
      profession: form.profession,
      phone: form.phone ?? "",
      bio: form.bio,
      avatarUrl: form.avatarUrl,
      uploadId: form.uploadId,
    },
    !!selectedFile.value,
  );
  return cur === profileSaveBaseline.value;
});

const profileTitle = computed(() => {
  const fullName = `${form.lastName || ""} ${form.firstName || ""}`.trim();
  return fullName || form.username || "Profil";
});

const roleLabel = computed(() => {
  const roles = auth.state.roles || [];
  if (roles.includes("ROLE_ADMIN")) return "Administrator";
  if (roles.includes("ROLE_MANAGER")) return "Menejer";
  if (roles.includes("ROLE_OPERATOR")) return "Operator";
  return "";
});

const isOperator = computed(() => auth.state.roles.includes("ROLE_OPERATOR"));
const isAdminOrManager = computed(() =>
  auth.state.roles.includes("ROLE_ADMIN") || auth.state.roles.includes("ROLE_MANAGER")
);

// ─── Stats state ───
const statsLoaded = ref(false);
const myMonthly = ref(0);
const myLastMonthly = ref(0);
const activeTasks = ref<UserTask[]>([]);
const leaderboard = ref<MonthlyWorkReport[]>([]);

const now = new Date();
const currentMonthParam = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
const prevMonthParam = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, "0")}`;

const uzMonths = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
const currentMonthLabel = `${uzMonths[now.getMonth()]} ${now.getFullYear()}`;

const monthGrowth = computed(() => {
  if (!myLastMonthly.value) return myMonthly.value > 0 ? 100 : 0;
  return Math.round(((myMonthly.value - myLastMonthly.value) / myLastMonthly.value) * 100);
});

const totalTeamWork = computed(() => leaderboard.value.reduce((s, e) => s + e.totalDelta, 0));
const avgTeamWork = computed(() =>
  leaderboard.value.length ? Math.round(totalTeamWork.value / leaderboard.value.length) : 0
);

const kindLabel: Record<string, string> = { ALBUM: "Albom", VIGNETTE: "Vinetka", PICTURE: "Fotokitob" };

const taskPercent = (task: UserTask) => {
  const done = task.processedCount ?? 0;
  const total = task.availableToProcess ?? 0;
  return total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
};

const todayStr = new Date().toISOString().slice(0, 10);
const isOverdue = (deadline: string) => deadline && deadline.slice(0, 10) < todayStr;
const isDueToday = (deadline: string) => deadline && deadline.slice(0, 10) === todayStr;

const overdueCount = computed(() => activeTasks.value.filter(t => t.deadline && isOverdue(t.deadline)).length);
const dueTodayCount = computed(() => activeTasks.value.filter(t => t.deadline && isDueToday(t.deadline)).length);

const formatDeadline = (deadline: string) => {
  if (!deadline) return "";
  const d = new Date(deadline);
  return `${d.getDate()} ${uzMonths[d.getMonth()]}`;
};

const loadStats = async () => {
  try {
    if (isOperator.value) {
      const [cur, prev, tasks] = await Promise.allSettled([
        axiosInstance.get<number>("/api/v1/work-logs/my-monthly", { params: { month: currentMonthParam } }),
        axiosInstance.get<number>("/api/v1/work-logs/my-monthly", { params: { month: prevMonthParam } }),
        axiosInstance.post("/api/v1/user-tasks/me/paging", { statuses: ["IN_PROGRESS", "PENDING"] }, { params: { page: 0, size: 20 } }),
      ]);
      if (cur.status === "fulfilled") myMonthly.value = Number(cur.value.data) || 0;
      if (prev.status === "fulfilled") myLastMonthly.value = Number(prev.value.data) || 0;
      if (tasks.status === "fulfilled") activeTasks.value = tasks.value.data?.content || [];
    } else if (isAdminOrManager.value) {
      const { data } = await axiosInstance.get<MonthlyWorkReport[]>("/api/v1/work-logs/monthly", {
        params: { month: currentMonthParam },
      });
      leaderboard.value = (data || []).sort((a, b) => b.totalDelta - a.totalDelta);
    }
  } catch (e) {
    console.error("Stats yuklanmadi:", e);
  } finally {
    statsLoaded.value = true;
  }
};

const initials = computed(() => {
  const source = profileTitle.value.trim();
  return (
      source
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part.charAt(0).toUpperCase())
          .join("") || "U"
  );
});

const getAvatarUrl = (url: string | undefined): string => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url}`;
};

const revokeAvatarPreview = () => {
  if (avatarPreview.value.startsWith("blob:")) {
    URL.revokeObjectURL(avatarPreview.value);
  }
  avatarPreview.value = "";
};

const onImgError = (e: Event) => {
  (e.target as HTMLImageElement).src = "";
};

const uploadAvatar = async (): Promise<{ url: string; id: string } | null> => {
  if (!selectedFile.value) return null;
  uploadProgress.value = 0;
  try {
    const formData = new FormData();
    formData.append("file", selectedFile.value);

    const { data } = await axiosInstance.post("/api/v1/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (ev) => {
        if (ev.total) {
          uploadProgress.value = Math.min(99, Math.round((100 * ev.loaded) / ev.total));
        }
      },
    });

    uploadProgress.value = 100;
    return {
      url: data.url,
      id: data.id,
    };
  } catch (e: unknown) {
    console.error("UPLOAD ERROR:", e);
    let msg = "Rasm yuklashda xatolik";
    if (axios.isAxiosError(e)) {
      const d = e.response?.data as { message?: string; error?: string } | undefined;
      const m = d?.message || d?.error;
      if (typeof m === "string" && m.trim()) msg = m.trim();
    }
    Toast.error(msg);
    return null;
  } finally {
    uploadProgress.value = 0;
  }
};

const removeAvatar = async () => {
  avatarUploading.value = true;
  try {
    if (form.uploadId) {
      await deleteUpload(form.uploadId);
    }
    selectedFile.value = null;
    avatarFileError.value = "";
    revokeAvatarPreview();
    form.avatarUrl = "";
    form.uploadId = "";
  } finally {
    avatarUploading.value = false;
  }
};

const deleteUpload = async (id: string) => {
  if (!id) return;

  try {
    await axiosInstance.delete(`/api/v1/uploads/${id}`);
  } catch (error) {
    console.error("DELETE ERROR:", error);
  }
};

const profileSubmit = async () => {
  isSaving.value = true;
  try {
    if (selectedFile.value) {
      avatarUploading.value = true;
      const uploaded = await uploadAvatar();
      avatarUploading.value = false;

      if (!uploaded) return;

      form.avatarUrl = uploaded.url;
      form.uploadId = uploaded.id;
    }
    await axiosInstance.put("/api/v1/users/me", {
      id: form.id,
      firstName: form.firstName,
      lastName: form.lastName,
      profession: form.profession,
      phone: form.phone,
      bio: form.bio,
      avatarUrl: form.avatarUrl,
      uploadId: form.uploadId || "",
    });

    selectedFile.value = null;
    revokeAvatarPreview();

    await loadProfile();
    Toast.success("Profil yangilandi");
  } catch (error) {
    Toast.error("Saqlashda xatolik");
    console.error(error);
  } finally {
    avatarUploading.value = false;
    isSaving.value = false;
  }
};

const loadProfile = async () => {
  try {
    const { data } = await axiosInstance.get("/api/v1/users/me");

    form.id = data.id || "";
    form.firstName = data.firstName || "";
    form.lastName = data.lastName || "";
    form.profession = data.profession || "";
    form.avatarUrl = data.avatarUrl || "";
    form.phone = data.phone || "";
    form.bio = data.bio || "";
    form.username = data.username || "";
    form.uploadId = data.uploadId || "";

    auth.setUser(data);
    refreshProfileSaveBaseline();
    return data;
  } catch (e) {
    console.error("Profil yuklashda xatolik:", e);
    return null;
  }
};

const discardChanges = async () => {
  selectedFile.value = null;
  avatarFileError.value = "";
  revokeAvatarPreview();
  await loadProfile();
};

onMounted(async () => {
  window.addEventListener("paste", onWindowPaste);
  isInitialLoading.value = true;
  await loadProfile();
  isInitialLoading.value = false;
  loadStats();
});

onUnmounted(() => {
  window.removeEventListener("paste", onWindowPaste);
});
</script>

<style scoped>
.profile-page {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  background-color: var(--color-pb-app, #f8fafc);
  background-image:
      linear-gradient(
          165deg,
          rgb(250 250 252 / 0.95) 0%,
          rgb(238 242 255 / 0.65) 38%,
          rgb(240 253 250 / 0.55) 72%,
          rgb(248 250 252 / 0.92) 100%
      ),
      radial-gradient(ellipse 95% 72% at 50% 40%, rgb(79 70 229 / 0.26), transparent 52%),
      radial-gradient(ellipse 92% 70% at 50% 60%, rgb(13 148 136 / 0.22), transparent 50%),
      radial-gradient(ellipse 55% 45% at 70% 30%, rgb(244 114 182 / 0.12), transparent 50%);
  background-size:
      100% 100%,
      280% 280%,
      280% 280%,
      260% 260%;
  background-position:
      0% 0%,
      48% 42%,
      52% 58%,
      62% 38%;
  animation: profile-bg-pan 11s ease-in-out infinite;
}

/* Mobil: ota layout skrolli ishlashi uchun; desktopda overflow:hidden + blur fon */
@media (max-width: 1023px) {
  .profile-page {
    overflow-x: hidden;
    overflow-y: visible;
  }
}

.profile-page__inner {
  position: relative;
  z-index: 2;
}

.profile-bg-sheen {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  width: 200vmax;
  height: 200vmax;
  margin-left: -100vmax;
  margin-top: -100vmax;
  pointer-events: none;
  background: conic-gradient(
      from 0deg at 50% 50%,
      transparent 0deg,
      rgb(99 102 241 / 0.2) 48deg,
      transparent 100deg,
      rgb(20 184 166 / 0.18) 175deg,
      rgb(244 63 94 / 0.12) 248deg,
      rgb(234 179 8 / 0.1) 300deg,
      transparent 340deg
  );
  opacity: 0.92;
  animation:
      profile-bg-spin 18s linear infinite,
      profile-bg-hue-shift 8s ease-in-out infinite alternate;
}

.profile-page::before,
.profile-page::after {
  content: "";
  position: absolute;
  inset: auto;
  width: min(58rem, 150vw);
  height: min(58rem, 150vh);
  border-radius: 50%;
  filter: blur(78px);
  pointer-events: none;
  z-index: 0;
  will-change: transform, opacity;
}

.profile-page::before {
  left: 14%;
  top: 16%;
  background: radial-gradient(
      circle at 35% 40%,
      rgb(99 102 241 / 0.72),
      rgb(56 189 248 / 0.38) 48%,
      transparent 70%
  );
  opacity: 0.58;
  animation:
      profile-bg-drift-a 11s ease-in-out infinite,
      profile-bg-breathe-a 5.5s ease-in-out infinite;
}

.profile-page::after {
  right: 12%;
  bottom: 18%;
  background: radial-gradient(
      circle at 60% 55%,
      rgb(45 212 191 / 0.62),
      rgb(167 139 250 / 0.36) 46%,
      transparent 68%
  );
  opacity: 0.54;
  animation:
      profile-bg-drift-b 13s ease-in-out infinite,
      profile-bg-breathe-b 6.5s ease-in-out infinite;
  animation-delay: -3s, -1.5s;
}

@keyframes profile-bg-pan {
  0%,
  100% {
    background-position:
        0% 0%,
        18% 28%,
        82% 72%,
        75% 22%;
  }
  25% {
    background-position:
        0% 0%,
        78% 22%,
        24% 78%,
        28% 68%;
  }
  50% {
    background-position:
        0% 0%,
        32% 72%,
        68% 28%,
        82% 48%;
  }
  75% {
    background-position:
        0% 0%,
        65% 55%,
        38% 42%,
        40% 30%;
  }
}

@keyframes profile-bg-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes profile-bg-hue-shift {
  0% {
    filter: hue-rotate(-18deg) saturate(1.2);
  }
  100% {
    filter: hue-rotate(28deg) saturate(1.45);
  }
}

@keyframes profile-bg-drift-a {
  0%,
  100% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  20% {
    transform: translate(16%, 10%) scale(1.16) rotate(10deg);
  }
  45% {
    transform: translate(-12%, 18%) scale(0.88) rotate(-8deg);
  }
  70% {
    transform: translate(14%, -14%) scale(1.1) rotate(6deg);
  }
}

@keyframes profile-bg-drift-b {
  0%,
  100% {
    transform: translate(0, 0) scale(1.05) rotate(0deg);
  }
  25% {
    transform: translate(-20%, -12%) scale(1.18) rotate(-12deg);
  }
  55% {
    transform: translate(12%, 16%) scale(0.84) rotate(9deg);
  }
  80% {
    transform: translate(-10%, -22%) scale(1.04) rotate(-5deg);
  }
}

@keyframes profile-bg-breathe-a {
  0%,
  100% {
    opacity: 0.45;
  }
  50% {
    opacity: 0.78;
  }
}

@keyframes profile-bg-breathe-b {
  0%,
  100% {
    opacity: 0.42;
  }
  50% {
    opacity: 0.74;
  }
}

@media (prefers-reduced-motion: reduce) {
  .profile-page {
    animation: none;
    background-size: 100% 100%, 100% 100%, 100% 100%, 100% 100%;
    background-position: 0% 0%, 50% 45%, 50% 55%, 50% 50%;
  }

  .profile-bg-sheen {
    animation: none;
    transform: rotate(25deg);
    filter: none;
    opacity: 0.48;
  }

  .profile-page::before,
  .profile-page::after {
    animation: none;
    opacity: 0.35;
  }
}

.stat-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--color-pb-border);
  background: var(--color-pb-surface);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.06);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  font-size: 15px;
  flex-shrink: 0;
}

.stat-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-pb-muted);
}

.stat-value {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-pb-text);
  line-height: 1.1;
  margin-top: 2px;
}

.stat-unit {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-pb-muted);
}

.stat-sub {
  font-size: 11px;
  margin-top: 3px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.task-progress-item {
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--color-pb-elevated);
  border: 1px solid var(--color-pb-border);
}

.profile-cover {
  background: linear-gradient(120deg, rgb(15 23 42 / 0.92), rgb(37 99 235 / 0.85) 55%, rgb(20 184 166 / 0.75));
}

.avatar-initials {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: linear-gradient(135deg, #2563eb, #0f766e);
  color: white;
  font-weight: 800;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: rgb(15 23 42 / 0);
  color: white;
  opacity: 0;
  transition: opacity 0.18s ease, background-color 0.18s ease;
}

.group:hover .avatar-overlay {
  background: rgb(15 23 42 / 0.42);
  opacity: 1;
}

.avatar-busy {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: rgb(15 23 42 / 0.58);
}

@keyframes profile-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton-shimmer {
  background: linear-gradient(
      90deg,
      rgb(226 232 240 / 0.65) 0%,
      rgb(248 250 252 / 0.95) 50%,
      rgb(226 232 240 / 0.65) 100%
  );
  background-size: 200% 100%;
  animation: profile-shimmer 1.35s ease-in-out infinite;
}
</style>
