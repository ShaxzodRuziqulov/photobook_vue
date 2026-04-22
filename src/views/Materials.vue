<template>
  <div class="app-page flex w-full min-w-0 flex-col gap-5 px-4 py-6 text-pb-text sm:px-6 lg:mx-auto lg:max-w-7xl">
    <div class="flex w-full flex-col gap-3 rounded-xl border border-pb-border bg-pb-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div class="flex flex-wrap items-center gap-3 sm:gap-5">
        <CButton
            type="button"
            text="Orqaga"
            is-has-fa-icon
            variant="ghost-accent"
            fa-class="fa-solid fa-arrow-left"
            @click="router.back()"
        />
        <div>
          <p class="text-xs font-bold uppercase tracking-wide text-pb-accent">Ombor</p>
          <h1 class="text-xl font-bold text-pb-text">Xom ashyolar</h1>
        </div>
      </div>
      <CButton
          type="button"
          text="Yangi qo'shish"
          @click="addTodoItem"
      />
    </div>
    <CDialog
        :show="visibleTodo"
        has-close-icon
        no-header
        custom-class="w-full max-w-md"
        @close="visibleTodo = false"
        body-class="flex max-h-[min(88vh,640px)] flex-col overflow-hidden rounded-xl border border-pb-border !bg-pb-surface p-0 shadow-lg"
    >
      <form
          class="flex min-h-0 flex-1 flex-col"
          @submit.prevent="createMaterial"
      >
        <div class="shrink-0 border-b border-pb-border px-4 pb-2 pt-11 sm:pt-4">
          <h2 class="text-base font-semibold text-pb-text">
            {{ editId ? "Tovarni o'zgartirish" : "Tovar qo'shish" }}
          </h2>
        </div>
        <div class="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
          <div>
            <AppInput
                label="Tovar nomi *"
                type="text"
                placeholder="Tovar nomini kiriting"
                v-model="form.itemName"
                :maxlength="MATERIAL_LIMITS.itemNameMax"
            />
            <p v-if="errors.itemName" class="mt-1 text-xs text-pb-error">{{ errors.itemName }}</p>
          </div>
          <div>
            <AppInput
                label="Tovar turi"
                type="text"
                placeholder="Ixtiyoriy"
                v-model="form.itemType"
                :maxlength="MATERIAL_LIMITS.itemTypeMax"
            />
            <p v-if="errors.itemType" class="mt-1 text-xs text-pb-error">{{ errors.itemType }}</p>
          </div>
          <div>
            <AppInput
                label="Miqdori *"
                type="number"
                min="0"
                step="0.001"
                placeholder="0 yoki 12.345"
                v-model="form.quantity"
            />
            <p v-if="errors.quantity" class="mt-1 text-xs text-pb-error">{{ errors.quantity }}</p>
          </div>
          <div>
            <AppInput
                label="Birligi"
                type="text"
                placeholder="dona, kg, m …"
                v-model="form.unitName"
                :maxlength="MATERIAL_LIMITS.unitNameMax"
            />
            <p v-if="errors.unitName" class="mt-1 text-xs text-pb-error">{{ errors.unitName }}</p>
          </div>
        </div>
        <div
            class="flex shrink-0 flex-col gap-2 border-t border-pb-border bg-pb-elevated px-4 py-2.5 sm:flex-row sm:justify-end"
        >
          <CButton
              type="button"
              text="Bekor qilish"
              variant="ghost-accent"
              @click="closeForm"
          />
          <CButton
              type="submit"
              text="Saqlash"
              variant="primary"
              :disabled="isLoading || materialSaveDisabled"
          />
        </div>
      </form>
    </CDialog>
    <CDialog
        :show="showForm"
        custom-class="w-full max-w-sm"
        @close="showForm = false"
        body-class="rounded-xl border border-pb-border !bg-pb-surface p-5 text-center shadow-lg"
    >
      <DeleteConfirm
          v-model:show="showForm"
          title="Ushbu xomashyoni o'chirmoqchimisiz?"
          @confirm="confirmDelete"
      />
    </CDialog>
    <div
        class="animate-fade-in flex w-full min-w-0 flex-col gap-4 rounded-xl border border-pb-border bg-pb-surface p-4 shadow-sm sm:p-6"
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
          <div class="h-3 w-2/3 rounded bg-pb-app"></div>
        </div>
      </div>
      <div
          v-else-if="materialItems.length"
          class="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <div
            class="flex h-full w-full flex-col gap-2 rounded-xl border border-pb-border bg-pb-surface px-3 py-4 shadow-sm"
            v-for="(item, index) in materialItems"
            :key="index"
        >
          <div
              class="flex items-start justify-between gap-2"
          >
            <div class="min-w-0">
              <p class="break-words text-xl font-semibold text-pb-text">{{item.itemName}}</p>
              <p class="break-words text-sm text-pb-muted">{{item.itemType}}</p>
            </div>
            <div class="flex shrink-0 items-center justify-end gap-2.5">
              <CButton
                  type="button"
                  size="sm"
                  is-has-fa-icon
                  faClass="fa-solid fa-pencil"
                  variant="outline-edit"
                  title="Tahrirlash"
                  class="!min-w-9 !px-2"
                  @click="editItem(item)"
              />
              <CButton
                  type="button"
                  size="sm"
                  is-has-fa-icon
                  faClass="fa-solid fa-trash-can"
                  variant="danger"
                  title="O'chirish"
                  class="!min-w-9 !px-2"
                  @click="deleteItem(item.id)"
              />
            </div>
          </div>
          <div
              class="flex flex-wrap items-center justify-between gap-2"
          >
            <div
                class="flex items-center gap-2 text-xl font-semibold text-pb-accent"
            >
              <span class="break-all">{{item.quantity}}</span>
              <span class="break-all text-lg text-pb-text">{{item.unitName}}</span>
            </div>
            <div v-if="item.updatedAt" class="shrink-0 text-right">
              <p class="text-xs text-pb-muted sm:text-sm">Yangilandi: {{dataItem(item.updatedAt)}}</p>
            </div>
          </div>
        </div>
      </div>
      <div
          v-else
          class="flex w-full items-center justify-center rounded-lg border border-dashed border-pb-border bg-pb-elevated/50 py-12 text-pb-muted"
      >
        Tovar topilmadi!
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useStore } from '@/stores/store'
import {IItems} from "@/typeModules/useModules";
import CButton from "@/components/CButton.vue";
import CDialog from "@/components/CDialog.vue";
import AppInput from "@/components/ui/AppInput.vue";
import DeleteConfirm from "@/components/DeleteConfirm.vue";
import { useRouter } from "vue-router";
import { MATERIAL_LIMITS } from "@/constants/backendEntityLimits";
import {
  normalizeMaterialPayload,
  validateMaterialForm,
  type MaterialFieldErrors,
} from "@/validation/materialAndCategoryForms";
import { snapshotMaterialFields } from "@/utils/updateFormDirty";

const router = useRouter();
const store = useStore();

const visibleTodo = ref(false);
const selectedId = ref<string | null>(null);
const showForm = ref(false);
const editId = ref(false);
const materialEditBaseline = ref("");
const isLoading = ref(false);
const errors = ref<MaterialFieldErrors>({});

const addTodoItem = () => {
  resetForm()
  visibleTodo.value = true;
  editId.value = false;
}

const materialItems = computed(() => store.state.items);

const form = ref<IItems>({
  id: null,
  itemName: '',
  itemType: '',
  unitName: '',
  quantity: null,
  createdAt: null,
  updatedAt: null,
});

const materialSaveDisabled = computed(
  () =>
    editId.value &&
    materialEditBaseline.value !== "" &&
    snapshotMaterialFields({
      itemName: form.value.itemName,
      itemType: form.value.itemType,
      unitName: form.value.unitName,
      quantity: form.value.quantity,
    }) === materialEditBaseline.value,
);

watch(
    () => form.value.itemName,
    () => {
      if (errors.value.itemName) delete errors.value.itemName;
    },
);
watch(
    () => form.value.itemType,
    () => {
      if (errors.value.itemType) delete errors.value.itemType;
    },
);
watch(
    () => form.value.unitName,
    () => {
      if (errors.value.unitName) delete errors.value.unitName;
    },
);
watch(
    () => form.value.quantity,
    () => {
      if (errors.value.quantity) delete errors.value.quantity;
    },
);

const resetForm = () => {
  errors.value = {};
  materialEditBaseline.value = "";
  form.value = {
    id: null,
    itemName: '',
    itemType: '',
    unitName: '',
    quantity: null,
    createdAt: null,
    updatedAt: null,
  };
};

const createMaterial = async () => {
  const fieldErrors = validateMaterialForm(form.value);
  if (Object.keys(fieldErrors).length) {
    errors.value = fieldErrors;
    return;
  }
  errors.value = {};
  const normalized = normalizeMaterialPayload(form.value);
  const merged: IItems = {
    ...form.value,
    itemName: normalized.itemName,
    itemType: normalized.itemType,
    unitName: normalized.unitName,
    quantity: normalized.quantity,
  };

  isLoading.value = true;
  try {
    if (merged.id) {
      await store.updateMaterial(merged.id, merged);
    } else {
      await store.addMaterial({
        itemName: merged.itemName,
        itemType: merged.itemType,
        unitName: merged.unitName,
        quantity: merged.quantity,
        createdAt: merged.createdAt,
        updatedAt: merged.updatedAt,
      });
    }
    await store.loadMaterials();
    visibleTodo.value = false;
    closeForm();
    editId.value = false;
  } catch {
  } finally {
    isLoading.value = false;
  }
};

const editItem = (item: IItems) => {
  errors.value = {};
  const q = item.quantity;
  const parsed =
      q === null || q === undefined
          ? null
          : typeof q === "number"
              ? q
              : Number(String(q).replace(",", ".").trim());
  form.value = {
    ...item,
    quantity: parsed !== null && Number.isFinite(parsed) ? parsed : null,
  };
  visibleTodo.value = true;
  editId.value = true;
  void nextTick(() => {
    materialEditBaseline.value = snapshotMaterialFields({
      itemName: form.value.itemName,
      itemType: form.value.itemType,
      unitName: form.value.unitName,
      quantity: form.value.quantity,
    });
  });
};

const confirmDelete = async () => {
  try {
    await store.deleteMaterial(selectedId.value);
    await store.loadMaterials()
  }
  catch {
  }
}

const deleteItem = async (id: string | null) => {
  selectedId.value = id
  showForm.value = true
}

const closeForm = () => {
  visibleTodo.value = false;
  resetForm()
}

const dataItem = (inputDate: string | number | Date | undefined | null) => {
  if (!inputDate) return '';

  const data = new Date(inputDate);
  if (Number.isNaN(data.getTime())) return String(inputDate);

  const monthName = [
    "Yan", "Fev", "Mar", "Apr", "May", "Iyn",
    "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"
  ];

  const minutes = data.getMinutes();
  const hours = data.getHours();
  const day = data.getDate().toString().padStart(2, "0");
  const month = monthName[data.getMonth()];
  const year = data.getFullYear();

  return `${day} ${month} ${year} ${hours}:${minutes}`;
};

onMounted(async () => {
  isLoading.value = true;
  try {
    await store.loadMaterials();
  } catch {
  } finally {
    isLoading.value = false;
  }
});

</script>

<style scoped>
.app-page {
  background:
      linear-gradient(180deg, rgb(248 250 252 / 0.9) 0%, var(--color-pb-app) 36%, var(--color-pb-app) 100%),
      radial-gradient(ellipse 65% 40% at 50% -8%, rgb(37 99 235 / 0.07), transparent 52%);
}

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