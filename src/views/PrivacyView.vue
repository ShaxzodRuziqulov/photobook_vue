<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
    <div class="max-w-4xl w-full bg-white rounded-2xl shadow-xl flex flex-col h-[90vh] overflow-hidden border border-gray-200">

      <div class="p-6 border-b bg-white">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-100">
            <i class="fa-solid fa-user-lock text-xl"></i>
          </div>
          <div>
            <h1 class="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight">
              Maxfiylik siyosati
            </h1>
            <p class="text-xs text-emerald-600 font-bold uppercase tracking-widest">Photobook ERP Data Protection</p>
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar bg-white">

        <section class="space-y-6">
          <div class="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
            <h2 class="text-emerald-800 font-bold mb-2 flex items-center gap-2">
              <i class="fa-solid fa-circle-info"></i> Umumiy qoida
            </h2>
            <p class="text-sm text-emerald-900 leading-relaxed m-0">
              Ushbu maxfiylik siyosati Photobook ERP tizimida foydalanuvchilarning shaxsiy va xizmat ma'lumotlari qanday to'planishi, ishlatilishi va himoyalanishini belgilaydi. Biz sizning maxfiyligingizni qadrlaymiz.
            </p>
          </div>

          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm text-emerald-600">01</span>
              Ma'lumotlarni to'plash
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-10">
              <div class="p-4 rounded-xl border border-gray-100 bg-gray-50">
                <b class="text-gray-800 block mb-1">Shaxsiy ma'lumotlar:</b>
                <p class="text-sm text-gray-600">Ism-sharif, telefon raqami, xodimning lavozimi va kirish huquqlari.</p>
              </div>
              <div class="p-4 rounded-xl border border-gray-100 bg-gray-50">
                <b class="text-gray-800 block mb-1">Tizim ma'lumotlari:</b>
                <p class="text-sm text-gray-600">IP-manzil, kirish vaqti, qurilma turi va bajarilgan amallar tarixi (logs).</p>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm text-emerald-600">02</span>
              Ma'lumotlardan foydalanish maqsadi
            </h3>
            <ul class="ml-10 space-y-3 text-sm text-gray-600">
              <li class="flex items-start gap-3">
                <i class="fa-solid fa-circle-check text-emerald-500 mt-1"></i>
                Ish jarayonlarini avtomatlashtirish va nazorat qilish uchun.
              </li>
              <li class="flex items-start gap-3">
                <i class="fa-solid fa-circle-check text-emerald-500 mt-1"></i>
                Tizim xavfsizligini ta'minlash va shubhali harakatlarni aniqlash uchun.
              </li>
              <li class="flex items-start gap-3">
                <i class="fa-solid fa-circle-check text-emerald-500 mt-1"></i>
                Buyurtmalar tarixini saqlash va hisobotlarni shakllantirish uchun.
              </li>
            </ul>
          </div>

          <div class="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden">
            <i class="fa-solid fa-shield-virus absolute -right-10 -bottom-10 text-9xl opacity-10 rotate-12"></i>
            <h3 class="text-xl font-bold mb-4 relative z-10">Ma'lumotlar xavfsizligi</h3>
            <p class="text-gray-400 text-sm leading-relaxed mb-6 relative z-10">
              Biz ma'lumotlaringizni himoya qilish uchun zamonaviy SSL shifrlash va xavfsiz server infratuzilmasidan foydalanamiz. Ma'lumotlar bazasiga kirish faqat ruxsati bor xodimlar bilan cheklangan.
            </p>
            <div class="flex flex-wrap gap-4 relative z-10">
              <span class="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/20">256-bit Encryption</span>
              <span class="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/20">Regular Audits</span>
              <span class="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/20">Access Control</span>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm text-emerald-600">03</span>
              Uchinchi shaxslarga berilmaslik
            </h3>
            <p class="ml-10 text-sm text-gray-600 leading-relaxed">
              Photobook ERP tizimi sizning shaxsiy ma'lumotlaringizni hech qachon uchinchi shaxslarga sotmaydi, ijaraga bermaydi yoki tijorat maqsadida tarqatmaydi. Ma'lumotlar faqat qonunchilikda belgilangan hollarda davlat organlariga taqdim etilishi mumkin.
            </p>
          </div>

        </section>

      </div>

      <div class="p-6 border-t bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" v-if="loading">
          </div>
          <p class="text-sm text-gray-500 max-w-xs" v-else>
            Tasdiqlash orqali siz maxfiylik siyosatining barcha bandlariga so'zsiz rozilik bildirasiz.
          </p>
        </div>

        <div class="flex gap-3 w-full sm:w-auto">
          <button
              @click="goBack"
              class="flex-1 sm:flex-none px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition"
          >
            Orqaga
          </button>
          <button
              @click="acceptPrivacy"
              class="flex-1 sm:flex-none px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200
                    hover:bg-emerald-700 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Roziman
            <i class="fa-solid fa-check-double text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const loading = ref(false);

const acceptPrivacy = () => {
  loading.value = true;

  setTimeout(() => {
    localStorage.setItem("privacy_accepted", "true");
    router.push("/");
    loading.value = false;
  }, 800);
};

const goBack = () => {
  router.back();
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #10b981;
}

.min-h-screen {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>