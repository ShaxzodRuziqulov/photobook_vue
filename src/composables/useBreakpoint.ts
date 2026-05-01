import { ref, onMounted, onUnmounted } from "vue";

export function useIsDesktop(breakpoint = 768) {
  const isDesktop = ref(window.innerWidth > breakpoint);

  const onResize = () => {
    isDesktop.value = window.innerWidth > breakpoint;
  };

  onMounted(() => window.addEventListener("resize", onResize));
  onUnmounted(() => window.removeEventListener("resize", onResize));

  return isDesktop;
}
