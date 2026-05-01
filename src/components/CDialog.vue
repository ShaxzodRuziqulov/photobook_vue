<template>
  <Teleport to="body">
    <div
        :class="[wrapperClass, { '!opacity-100 !visible': show }]"
        data-modal="wrapper"
        class="items-end sm:items-center p-0 sm:p-3 fixed w-full h-full bg-slate-900/65 backdrop-blur-[2px] flex justify-center z-40 top-0 left-0 invisible opacity-0 transition-all duration-300"
        @mousedown="handleOuterClick($event)"
    >
      <Transition name="modal" mode="out-in">
        <div
            v-if="show"
            class="w-full flex justify-center sm:px-0 px-0"
            :class="customClass ? customClass : 'lg:max-w-xl'"
        >
          <div
              class="bg-pb-surface w-full shadow-xl shadow-slate-900/15 border border-pb-border relative max-h-[92dvh] sm:max-h-[90vh] sm:my-4 rounded-t-2xl sm:rounded-xl pb-[env(safe-area-inset-bottom,0px)]"
              :class="[
              bodyClass,
              { animated: animationIn },
              { 'overflow-y-auto': !isFlow },
            ]"
          >
            <div
                v-if="!noHeader"
                class="flex items-center px-4 sm:px-6 pb-3.5 pt-4 bg-pb-surface rounded-t-2xl sm:rounded-t-xl border-b border-pb-border"
                :class="[headerStyle]"
            >
              <slot name="header">
                <h3
                    class="w-full text-lg sm:text-xl text-pb-text font-semibold"
                    :class="titleStyle"
                >
                  {{ title }}
                </h3>
                <button
                    type="button"
                    class="group w-11 h-11 sm:w-8 sm:h-8 border cursor-pointer border-pb-border bg-pb-elevated flex items-center justify-center absolute top-2 right-3 sm:top-4 sm:right-5 rounded-full shrink-0 flex-center transition-colors hover:bg-pb-app hover:border-slate-300 active:scale-95 z-40"
                    :class="closeIconClass"
                    @click="$emit('close')"
                >
                  <Icon
                      class="text-slate-600 group-hover:text-pb-accent"
                      icon-name="close"
                  />
                </button>
              </slot>
            </div>
            <button
                v-if="noHeader && hasCloseIcon"
                type="button"
                class="group w-11 h-11 sm:w-8 sm:h-8 border border-pb-border bg-pb-elevated cursor-pointer flex items-center justify-center absolute top-2 right-3 sm:top-3 sm:right-4 rounded-full shrink-0 flex-center transition-colors hover:bg-pb-app hover:border-slate-300 active:scale-95 z-40"
                :class="closeIconClass"
                @click="$emit('close')"
            >
              <Icon
                  class="text-slate-600 group-hover:text-pb-accent"
                  icon-name="close"
              />
            </button>
            <slot />
            <slot name="footer" />
          </div>
          <slot name="afterBody" />
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import Icon from "@/components/Icon.vue";

interface Props {
  show?: boolean;
  isFlow?: boolean;
  title?: string;
  wrapperClass?: string | string[];
  modalClass?: string | string[];
  noHeader?: boolean;
  disableOuterClose?: boolean;
  bodyClass?: string | string[];
  hasCloseIcon?: boolean;
  titleStyle?: string;
  headerStyle?: string;
  customClass?: string;
  closeIconClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  titleStyle: "",
  headerStyle: "",
  wrapperClass: "",
  bodyClass: "",
  modalClass: "",
});

interface Emits {
  (e: "close"): void;

  (e: "outer-click"): void;
}

const emit = defineEmits<Emits>();
const animationIn = ref(false);

function handleOuterClick(e: Event) {
  const target = e.target as HTMLElement;
  if (target.dataset?.modal == "wrapper") {
    emit("outer-click");
    if (!props.disableOuterClose) {
      emit("close");
    } else {
      animationIn.value = true;
      setTimeout(() => {
        animationIn.value = false;
      }, 500);
    }
  }
}

watch(
    () => props.show,
    (val) => {
      if (val) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }
);
onMounted(() => {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !props.disableOuterClose) {
      emit("close");
    }
  });
});
</script>

<style scoped>
@keyframes modal {
  from {
    opacity: 0;
    transform: translateY(-40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-enter-active {
  animation: modal 0.3s ease-in-out;
}

.modal-leave-active {
  animation: modal 0.3s ease-in-out reverse;
}

@keyframes mobile-modal {
  from {
    opacity: 0;
    transform: translateY(50%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mobile-modal-enter-active {
  animation: mobile-modal 0.5s ease-in-out;
}

.mobile-modal-leave-active {
  animation: mobile-modal 0.5s ease-in-out reverse;
}

.animated {
  animation: horizontal-shaking 0.4s ease-in-out;
}
</style>
