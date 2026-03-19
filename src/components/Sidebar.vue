<template>
  <div
      class="w-full invisible h-full mt-20 pt-40 min-h-screen bg-black/30 transition-all ease-in-out duration-300 fixed inset-0 z-999 left-0"
      @click="toggleMenu"
      :class="isMenuVisible ? 'visible' : 'invisible'"
  >
    <div
        @click.stop
        :class="isMenuVisible ? 'translate-x-0' : '-translate-x-full'"
        v-if="mainMenuItems.length"
        class="pt-10 w-full md:w-3/4 sm:1/2 lg:w-1/4 gap-3 pl-4 pr-20 h-dvh flex flex-col md:pt-16 bg-gray-700 absolute top-0 left-0 text-white z-20 transition-all ease-in-out duration-300 overflow-hidden"

    >
      <router-link
          v-for="(item, index) in mainMenuItems"
          :key="index"
          :to="item.path"
          @click="toggleMenu"
          active-class="bg-gray-600 text-white font-semibold"
          class="rounded-sm p-2 cursor-pointer hover:bg-gray-600 transition-colors duration-300 flex items-center gap-1"
          :class="!isDesktop && index === mainMenuItems.length -1 ? 'hidden' : 'of-hidden'"
      >
        <i :class="item.meta.icon"></i>
        {{item.name}}
      </router-link>
      <div>
        <div
            v-if="!isDesktop"
            @click="backToLogin"
            class="flex items-center w-full rounded-sm hover:bg-gray-600 cursor-pointer p-2 gap-2"
        >
          <i class="fa-solid fa-arrow-right-from-bracket"/>
          <span class="flex items-start">Chiqish</span>
        </div>
        <CButton
            v-if="!isDesktop && userName"
            type="button"
            :text="userName"
            is-has-fa-icon
            faClass="fa-solid fa-arrow-right"
            variant="ghost-accent"
            @click="openToProfile"
        />
        <CDialog
            :show="isExit"
            @close="isExit = false"
            body-class="justify-center bg-blue-800 text-center px-4 pb-8"
        >
          <div
              class="flex flex-col gap-4 w-full items-center justify-center bg-white rounded-2xl"
          >
            <h2 class="text-lg font-semibold">Rostdan ham chiqmoqchimisiz ?</h2>
            <div class="flex items-center justify-center gap-2 w-full">
              <CButton
                  type="button"
                  text="Ha, Chiqish"
                  class="px-6 py-5"
                  variant="danger"
                  @click="confirmBack"
              />
              <CButton
                  type="button"
                  text="Bekor qilish"
                  class="px-6 py-5"
                  variant="ghost-accent"
                  @click="isExit = false"
              />
            </div>
          </div>
        </CDialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ComputedRef, ref} from "vue";
import { authService } from "@/service/authService";
import { useStore } from "@/stores/store";
import {watch} from "vue";
import { useRouter } from "vue-router";
import CButton from "@/components/CButton.vue";
import CDialog from "@/components/CDialog.vue";

const router = useRouter();
const authStore = authService();
const dataStore = useStore();

const isExit = ref(false);

const emits = defineEmits(['toggleMenu']);

interface IProps {
  menuItems: Array<{
    name: string;
    path: string;
  }>;
  isMenuVisible: boolean;
}

const props = defineProps<IProps>()

const toggleMenu = () => {
  emits("toggleMenu" );
}

const mainMenuItems: ComputedRef = computed(() => {
    return props.menuItems;
})

const isDesktop = computed(() => window.innerWidth > 768);

const backToLogin = () => {
  isExit.value = true;
  emits("toggleMenu");
}

const confirmBack = () => {
  authStore.logout();
  isExit.value = false;
}

const openToProfile = () => {
  router.push("/profile");
}

const userName = computed(() => {
  try {
    const users = dataStore.state.user.items;
    const user = users.find(u => (u.lastName && u.firstName))
    return user ? `${user.lastName} ${user.firstName}` : 'Foydalanuvchi';
  }
  catch (error) {
    console.log(error);
  }
})

watch(
    () => props.isMenuVisible,
    (val) => {
      if (val) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
)
</script>