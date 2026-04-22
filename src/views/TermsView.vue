<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
    <div class="max-w-4xl w-full bg-white rounded-2xl shadow-xl flex flex-col h-[90vh] overflow-hidden border border-gray-200">

      <div class="p-6 border-b bg-white">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <i class="fa-solid fa-shield-halved text-xl"></i>
          </div>
          <div>
            <h1 class="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight">
              Foydalanish shartlari
            </h1>
            <p class="text-xs text-gray-500 font-medium">Oxirgi yangilanish: 2026-yil, 22-aprel</p>
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar bg-white">

        <section class="prose prose-sm max-w-none text-gray-600 leading-relaxed">
          <div class="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg mb-6">
            <p class="text-blue-800 font-medium m-0">
              Ushbu tizim (Photobook ERP) korxona ichki jarayonlarini boshqarish uchun mo‘ljallangan.
              Administrator tizimdan foydalanishda to‘liq mas’ul hisoblanadi.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div>
                <h2 class="flex items-center gap-2 font-bold text-gray-800 mb-2">
                  <span class="text-blue-600">1.</span> Administrator vakolatlari
                </h2>
                <ul class="space-y-1 list-none pl-0">
                  <li class="flex gap-2"><i class="fa-solid fa-check text-blue-500 mt-1"></i> Foydalanuvchilarni boshqarish</li>
                  <li class="flex gap-2"><i class="fa-solid fa-check text-blue-500 mt-1"></i> Ma’lumotlarni tahrirlash</li>
                  <li class="flex gap-2"><i class="fa-solid fa-check text-blue-500 mt-1"></i> Jarayonlar nazorati</li>
                </ul>
              </div>

              <div>
                <h2 class="flex items-center gap-2 font-bold text-gray-800 mb-2">
                  <span class="text-blue-600">2.</span> Mas’uliyat
                </h2>
                <p>Ma’lumotlarning to‘g‘riligiga javobgarlik. Soxta ma’lumot kiritish qat'iyan taqiqlanadi.</p>
              </div>

              <div>
                <h2 class="flex items-center gap-2 font-bold text-gray-800 mb-2">
                  <span class="text-blue-600">3.</span> Xavfsizlik
                </h2>
                <p>Login va parolni uchinchi shaxslarga berish, sessiyalarni himoyasiz qoldirish taqiqlanadi.</p>
              </div>
            </div>

            <div class="space-y-6">
              <div class="p-4 bg-red-50 rounded-xl border border-red-100">
                <h2 class="flex items-center gap-2 font-bold text-red-800 mb-2">
                  <i class="fa-solid fa-triangle-exclamation"></i> 4. Taqiqlangan harakatlar
                </h2>
                <ul class="text-red-700 text-xs space-y-2">
                  <li>• Tizimni buzishga urinish</li>
                  <li>• Loglarni o‘chirish yoki o‘zgartirish</li>
                  <li>• Ruxsatsiz ma'lumot eksporti</li>
                </ul>
              </div>

              <div>
                <h2 class="flex items-center gap-2 font-bold text-gray-800 mb-2">
                  <span class="text-blue-600">5.</span> Audit va monitoring
                </h2>
                <p>Barcha amallar tizim tomonidan log qilinadi va nazorat qilinadi.</p>
              </div>
            </div>
          </div>

          <hr class="my-8 border-gray-100" />

          <div class="bg-gray-50 p-6 rounded-2xl space-y-4 border border-gray-100">
            <h3 class="font-bold text-gray-800 flex items-center gap-2">
              <i class="fa-solid fa-circle-info text-blue-600"></i> Maxfiylik va Ma'lumotlar
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div class="p-3 bg-white rounded-lg shadow-sm">
                <b class="block mb-1 text-gray-800">Ma'lumotlardan foydalanish:</b>
                Faqat ichki ish jarayonlarini boshqarish uchun.
              </div>
              <div class="p-3 bg-white rounded-lg shadow-sm">
                <b class="block mb-1 text-gray-800">Cheklov:</b>
                Nusxalash yoki tashqariga chiqarish taqiqlanadi.
              </div>
            </div>
          </div>
        </section>

      </div>

      <div class="p-6 border-t bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <label class="flex items-center gap-3 cursor-pointer group">
          <div class="relative flex items-center">
            <input
                type="checkbox"
                v-model="accepted"
                class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition cursor-pointer"
            />
          </div>
          <span class="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition">
            Men barcha shartlar va qoidalar bilan tanishdim
          </span>
        </label>

        <button
            :disabled="!accepted"
            @click="acceptTerms"
            class="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200
                   hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:shadow-none
                   disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          Tasdiqlash va davom etish
          <i class="fa-solid fa-arrow-right text-xs"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const accepted = ref(false);
const router = useRouter();

const acceptTerms = () => {
  localStorage.setItem("terms_accepted", "true");
  router.push("/");
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

/* Animatsiya */
.min-h-screen {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
</style>