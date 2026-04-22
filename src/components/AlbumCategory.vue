<template>
  <div class="space-y-4">
    <div class="flex w-full items-center justify-between rounded-xl border border-pb-border bg-pb-surface p-4 shadow-sm">
      <div class="flex items-center gap-3">
        <h2 class="flex items-center gap-3 text-xl font-semibold text-pb-text">
          <i class="fa-solid fa-book text-pb-accent" aria-hidden="true"></i>
          Albomlar
        </h2>
      </div>
      <CButton
          text="Yangi qo'shish"
          type="button"
          @click="openModal()"
      />
    </div>
    <CDialog
        :show="showConfirmItem"
        custom-class="w-full max-w-sm"
        @close="showConfirmItem = false"
        body-class="rounded-xl border border-pb-border !bg-pb-surface p-5 text-center shadow-lg"
    >
      <DeleteConfirm
          v-model:show="showConfirmItem"
          @confirm="deleteConfirmItem"
          title="Ushbu kategoriyani o'chirmoqchimisiz?"
      />
    </CDialog>

    <div
        class="animate-fade-in flex w-full min-w-0 flex-col gap-4 rounded-xl border border-pb-border bg-pb-surface p-4 shadow-sm"
    >
      <div
          v-if="isLoading"
          class="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <div
            v-for="i in 8"
            :key="i"
            class="animate-pulse rounded-xl border border-pb-border bg-pb-elevated p-4 shadow-sm"
        >
          <div class="mb-2 h-5 w-3/4 rounded bg-pb-app"></div>
          <div class="mb-4 h-4 w-1/2 rounded bg-pb-app"></div>
          <div class="mb-4 h-6 w-1/3 rounded bg-pb-app"></div>
        </div>
      </div>
      <div
          v-else-if="alCategories.length > 0"
          class="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <div
            v-for="(vin, index) in alCategories"
            :key="vin.id ?? `cat-${index}`"
            class="flex h-full w-full flex-col gap-2 rounded-xl border border-pb-border bg-pb-surface px-3 py-4 shadow-sm"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="break-words text-xl font-semibold text-pb-text">{{ vin.name }}</p>
              <p class="break-words text-sm text-pb-muted">
                {{ vin.size || "—" }}
              </p>
            </div>
            <div class="flex shrink-0 items-center justify-end gap-2.5">
              <CButton
                  type="button"
                  size="sm"
                  variant="outline-edit"
                  is-has-fa-icon
                  faClass="fa-solid fa-pencil"
                  title="Tahrirlash"
                  class="!min-w-9 !px-2"
                  @click="editItem(vin)"
              />
              <CButton
                  type="button"
                  size="sm"
                  variant="danger"
                  is-has-fa-icon
                  faClass="fa-solid fa-trash-can"
                  title="O'chirish"
                  class="!min-w-9 !px-2"
                  @click="deleteItem(vin)"
              />
            </div>
          </div>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div
                class="flex min-w-0 flex-wrap items-center gap-2 text-xl font-semibold text-pb-accent"
            >
              <span class="break-all">{{ vin.defaultPages ?? "—" }}</span>
              <span class="break-all text-lg text-pb-text">betlar</span>
            </div>
          </div>
        </div>
      </div>
      <div
          v-else
          class="flex w-full items-center justify-center rounded-lg border border-dashed border-pb-border bg-pb-elevated/50 py-12 text-pb-muted"
      >
        Kategoriya topilmadi
      </div>
    </div>

    <CDialog
        :show="showModal"
        has-close-icon
        no-header
        custom-class="w-full max-w-md"
        @close="closeModal"
        body-class="flex max-h-[min(88vh,640px)] flex-col overflow-hidden rounded-xl border border-pb-border !bg-pb-surface p-0 shadow-lg"
    >
      <form
          class="flex min-h-0 flex-1 flex-col"
          @submit.prevent="saveForm"
      >
        <div class="shrink-0 border-b border-pb-border px-4 pb-2 pt-11 sm:pt-4">
          <h2 class="text-base font-semibold leading-snug text-pb-text">
            {{ isEditing ? "Kategoriyani tahrirlash" : "Yangi kategoriya" }}
          </h2>
        </div>
        <div class="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
          <div>
            <AppInput
                label="Nomi *"
                type="text"
                placeholder="Kiriting"
                v-model="form.name"
                :maxlength="PRODUCT_CATEGORY_LIMITS.nameMax"
            />
            <p v-if="categoryErrors.name" class="mt-1 text-xs text-pb-error">{{ categoryErrors.name }}</p>
          </div>
          <div>
            <AppInput
                label="Betlar turi *"
                type="text"
                placeholder="2, 4, 6 …"
                v-model="defaultPagesModel"
                :maxlength="PRODUCT_CATEGORY_LIMITS.defaultPagesMax"
            />
            <p v-if="categoryErrors.defaultPages" class="mt-1 text-xs text-pb-error">{{ categoryErrors.defaultPages }}</p>
          </div>
          <div>
            <AppInput
                label="Ulchami"
                type="text"
                placeholder="20x30"
                v-model="sizeModel"
                :maxlength="PRODUCT_CATEGORY_LIMITS.sizeMax"
            />
            <p v-if="categoryErrors.size" class="mt-1 text-xs text-pb-error">{{ categoryErrors.size }}</p>
          </div>
        </div>
        <div
            class="flex shrink-0 flex-col gap-2 border-t border-pb-border bg-pb-elevated px-4 py-2.5 sm:flex-row sm:justify-end"
        >
          <CButton
              type="button"
              text="Bekor qilish"
              variant="ghost-accent"
              :disabled="isSaving"
              @click="closeModal"
          />
          <CButton
              type="submit"
              :text="isEditing ? 'Yangilash' : 'Saqlash'"
              variant="primary"
              :loading="isSaving"
              :disabled="categorySaveDisabled"
          />
        </div>
      </form>
    </CDialog>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, watch, nextTick} from 'vue';
import CButton from "@/components/CButton.vue";
import { useStore } from "@/stores/store";
import AppInput from "@/components/ui/AppInput.vue";
import { AllCategory } from "@/typeModules/useModules";
import DeleteConfirm from "@/components/DeleteConfirm.vue";
import CDialog from "@/components/CDialog.vue";
import { PRODUCT_CATEGORY_LIMITS } from "@/constants/backendEntityLimits";
import {
  validateProductCategoryForm,
  type ProductCategoryFieldErrors,
} from "@/validation/materialAndCategoryForms";
import { snapshotProductCategory } from "@/utils/updateFormDirty";


const dataStore = useStore();
const alCategories = computed(() => dataStore.state.alCategory);

const showModal = ref(false);
const isEditing = ref(false);
const categoryEditBaseline = ref("");
const showConfirmItem = ref(false);
const isLoading = ref(false);
const isSaving = ref(false);
const categoryErrors = ref<ProductCategoryFieldErrors>({});

const form = ref<AllCategory>({
  id: null,
  kind: 'ALBUM',
  name: '',
  defaultPages: null,
  size: null,
});

watch(
    () => form.value.name,
    () => {
      if (categoryErrors.value.name) delete categoryErrors.value.name;
    },
);
watch(
    () => form.value.defaultPages,
    () => {
      if (categoryErrors.value.defaultPages) delete categoryErrors.value.defaultPages;
    },
);
watch(
    () => form.value.size,
    () => {
      if (categoryErrors.value.size) delete categoryErrors.value.size;
    },
);

const defaultPagesModel = computed({
  get: () => form.value.defaultPages ?? "",
  set: (v: string) => {
    form.value.defaultPages = v.trim() === "" ? null : v;
  },
});

const sizeModel = computed({
  get: () => form.value.size ?? "",
  set: (v: string) => {
    form.value.size = v.trim() === "" ? null : v;
  },
});

const categorySnapshotNow = computed(() =>
  snapshotProductCategory({
    name: form.value.name,
    defaultPages: form.value.defaultPages,
    size: form.value.size,
    kind: form.value.kind,
  }),
);

const categorySaveDisabled = computed(
  () =>
    isSaving.value ||
    (isEditing.value &&
      categoryEditBaseline.value !== "" &&
      categorySnapshotNow.value === categoryEditBaseline.value),
);

const openModal = () => {
  categoryErrors.value = {};
  categoryEditBaseline.value = "";
  isEditing.value = false;
  form.value = {
    id: null,
    kind: "ALBUM",
    name: "",
    defaultPages: null,
    size: null,
  };
  showModal.value = true;
};

const closeModal = () => {
  categoryErrors.value = {};
  categoryEditBaseline.value = "";
  form.value = {
    id: null,
    kind: 'ALBUM',
    name: '',
    defaultPages: null,
    size: null,
  }
  showModal.value = false;
  isEditing.value = false;
};

const saveForm = async () => {
  const fieldErrors = validateProductCategoryForm({
    name: form.value.name,
    defaultPages: form.value.defaultPages,
    size: form.value.size,
  });
  if (Object.keys(fieldErrors).length) {
    categoryErrors.value = fieldErrors;
    return;
  }
  categoryErrors.value = {};
  isSaving.value = true;
  try {
    if (form.value.id) {
      await dataStore.updateCategory(form.value.id, form.value);
    } else {
      await dataStore.addCategory(form.value);
    }
    await dataStore.loadCategory(form.value.kind);
    closeModal();
  } catch {
  } finally {
    isSaving.value = false;
  }
};

const editItem = (item: AllCategory) => {
  categoryErrors.value = {};
  isEditing.value = true;
  showModal.value = true;
  form.value = { ...item };
  void nextTick(() => {
    categoryEditBaseline.value = categorySnapshotNow.value;
  });
}

const deleteConfirmItem = async () => {
  try {
    await dataStore.deleteCategory(form.value.id, form.value.kind);
    showConfirmItem.value = false;
    await dataStore.loadCategory(form.value.kind);
  }
  catch {
  }
}

const deleteItem = async (item: AllCategory) => {
  form.value = { ...item };
  showConfirmItem.value = true;
};

onMounted(async () => {
  isLoading.value = true;
  try {
    await dataStore.loadCategory('ALBUM');
  } catch {
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>