<template>
  <div class="max-w-4xl mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-bold">
      Administrator uchun foydalanish shartlari
    </h1>

    <div class="space-y-4 text-sm text-gray-600 leading-relaxed">

      <p>
        Ushbu tizim (Photobook ERP) korxona ichki jarayonlarini boshqarish uchun mo‘ljallangan.
        Administrator tizimdan foydalanishda to‘liq mas’ul hisoblanadi.
      </p>

      <h2 class="font-semibold text-gray-800">1. Administrator vakolatlari</h2>
      <ul class="list-disc pl-5">
        <li>Foydalanuvchilarni boshqarish (yaratish, o‘chirish, bloklash)</li>
        <li>Tizim ma’lumotlarini ko‘rish va tahrirlash</li>
        <li>Buyurtmalar va jarayonlarni nazorat qilish</li>
      </ul>

      <h2 class="font-semibold text-gray-800">2. Mas’uliyat</h2>
      <p>
        Administrator tizimga kiritilgan barcha ma’lumotlarning to‘g‘riligiga javobgar hisoblanadi.
        Noto‘g‘ri yoki soxta ma’lumot kiritish taqiqlanadi.
      </p>

      <h2 class="font-semibold text-gray-800">3. Xavfsizlik</h2>
      <ul class="list-disc pl-5">
        <li>Login va parolni uchinchi shaxslarga bermaslik</li>
        <li>Tizimdan ruxsatsiz foydalanishga yo‘l qo‘ymaslik</li>
        <li>Session va tokenlarni himoya qilish</li>
      </ul>

      <h2 class="font-semibold text-gray-800">4. Taqiqlangan harakatlar</h2>
      <ul class="list-disc pl-5">
        <li>Tizimga zarar yetkazish yoki buzishga urinish</li>
        <li>Ma’lumotlarni noqonuniy o‘zgartirish</li>
        <li>Ruxsatsiz foydalanuvchilarga kirish berish</li>
        <li>Audit va loglarni o‘chirish yoki o‘zgartirish</li>
      </ul>

      <h2 class="font-semibold text-gray-800">5. Audit va monitoring</h2>
      <p>
        Administrator tomonidan bajarilgan barcha amallar tizim tomonidan log qilinadi
        va nazorat qilinadi.
      </p>

      <h2 class="font-semibold text-gray-800">6. Tizimni bloklash</h2>
      <p>
        Quyidagi holatlarda administrator akkaunti bloklanishi mumkin:
      </p>
      <ul class="list-disc pl-5">
        <li>Xavfsizlik qoidalarini buzish</li>
        <li>Noqonuniy faoliyat aniqlansa</li>
        <li>Tizimga zarar yetkazishga urinish</li>
      </ul>

      <h2 class="font-semibold text-gray-800">7. Huquqiy asos</h2>
      <p>
        Ushbu tizimdan foydalanish amaldagi qonunchilikka muvofiq amalga oshiriladi.
        Qoidabuzarliklar uchun javobgarlik tegishli qonunlar asosida belgilanadi.
      </p>

      <h2 class="font-semibold text-gray-800">8. Rozilik</h2>
      <p>
        Administrator tizimdan foydalanishni davom ettirish orqali ushbu shartlarga to‘liq rozilik bildiradi.
      </p>

    </div>
    <div>
      Ushbu tizim (Photobook ERP) faqat korxona ichki foydalanishi uchun mo‘ljallangan bo‘lib,
      undan administrator va xodimlar xizmat vazifalari doirasida foydalanadi. <br>

      1. Yig‘iladigan ma’lumotlar: <br>
      - Xodim va administrator ma’lumotlari
      - Buyurtmalar va ishlab chiqarish jarayonlari
      - Tizimdagi harakatlar (loglar)
      <br>
      2. Ma’lumotlardan foydalanish:
      Ma’lumotlar faqat ichki ish jarayonlarini boshqarish va nazorat qilish uchun ishlatiladi.
      <br>
      3. Maxfiylik:
      Administrator va xodimlar tizimdagi ma’lumotlarni uchinchi shaxslarga bermasligi shart.
      <br>
      4. Monitoring:
      Tizimdagi barcha harakatlar audit log orqali kuzatiladi.
      <br>
      5. Xavfsizlik:
      Har bir foydalanuvchi o‘z akkaunti xavfsizligi uchun javobgar.
      <br>
      6. Cheklov:
      Ma’lumotlarni nusxalash, eksport qilish yoki tashqariga chiqarish ruxsatsiz taqiqlanadi.
      <br>
      7. Javobgarlik:
      Qoidabuzarlik aniqlansa akkaunt bloklanadi va ichki tartib asosida choralar ko‘riladi.
    </div>
    <!-- ACCEPT -->
    <div class="border-t pt-4 flex items-center justify-between">
      <label class="flex items-center gap-2">
        <input type="checkbox" v-model="accepted" />
        <span>Men ushbu shartlarga roziman</span>
      </label>

      <button
          :disabled="!accepted"
          @click="acceptTerms"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        Tasdiqlash
      </button>
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