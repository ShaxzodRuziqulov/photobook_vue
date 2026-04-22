import {
  MATERIAL_LIMITS,
  PRODUCT_CATEGORY_LIMITS,
} from "@/constants/backendEntityLimits";

export type MaterialFieldErrors = Partial<
  Record<"itemName" | "itemType" | "unitName" | "quantity", string>
>;

export type ProductCategoryFieldErrors = Partial<
  Record<"name" | "defaultPages" | "size", string>
>;

/** DECIMAL(p,s): butun qismi va kasr raqamlari */
function fitsDecimalPrecision(
  value: number,
  maxIntegerDigits: number,
  maxFractionDigits: number,
): boolean {
  if (!Number.isFinite(value)) return false;
  if (value < 0) return false;
  const raw = value.toString();
  if (/e/i.test(raw)) return false;
  const [whole, frac = ""] = raw.split(".");
  const intPart = whole.replace(/^\+/, "");
  if (intPart.length > maxIntegerDigits) return false;
  if (frac.length > maxFractionDigits) return false;
  return true;
}

export function validateMaterialForm(input: {
  itemName: string;
  itemType: string;
  unitName: string;
  quantity: number | string | null | undefined;
}): MaterialFieldErrors {
  const err: MaterialFieldErrors = {};
  const itemName = input.itemName.trim();
  if (!itemName) {
    err.itemName = "Tovar nomi majburiy";
  } else if (itemName.length > MATERIAL_LIMITS.itemNameMax) {
    err.itemName = `Eng ko‘pi bilan ${MATERIAL_LIMITS.itemNameMax} belgi`;
  }

  const itemType = input.itemType.trim();
  if (itemType.length > MATERIAL_LIMITS.itemTypeMax) {
    err.itemType = `Eng ko‘pi bilan ${MATERIAL_LIMITS.itemTypeMax} belgi`;
  }

  const unitName = input.unitName.trim();
  if (unitName.length > MATERIAL_LIMITS.unitNameMax) {
    err.unitName = `Eng ko‘pi bilan ${MATERIAL_LIMITS.unitNameMax} belgi`;
  }

  const q = input.quantity;
  if (q === "" || q === null || q === undefined) {
    err.quantity = "Miqdor majburiy";
  } else {
    const n = typeof q === "number" ? q : Number(String(q).replace(",", "."));
    if (!Number.isFinite(n)) {
      err.quantity = "Miqdor raqam bo‘lishi kerak";
    } else if (
      !fitsDecimalPrecision(
        n,
        MATERIAL_LIMITS.quantityMaxIntegerDigits,
        MATERIAL_LIMITS.quantityScale,
      )
    ) {
      err.quantity = `0 dan katta, butun qismi ${MATERIAL_LIMITS.quantityMaxIntegerDigits} raqamgacha, kasr qismi ${MATERIAL_LIMITS.quantityScale} raqamgacha`;
    }
  }

  return err;
}

export function validateProductCategoryForm(input: {
  name: string;
  defaultPages: string | null;
  size: string | null;
}): ProductCategoryFieldErrors {
  const err: ProductCategoryFieldErrors = {};
  const name = input.name.trim();
  if (!name) {
    err.name = "Kategoriya nomi majburiy";
  } else if (name.length > PRODUCT_CATEGORY_LIMITS.nameMax) {
    err.name = `Eng ko‘pi bilan ${PRODUCT_CATEGORY_LIMITS.nameMax} belgi`;
  }

  const dp = (input.defaultPages ?? "").trim();
  if (!dp) {
    err.defaultPages = "Betlar turi majburiy";
  } else if (dp.length > PRODUCT_CATEGORY_LIMITS.defaultPagesMax) {
    err.defaultPages = `Eng ko‘pi bilan ${PRODUCT_CATEGORY_LIMITS.defaultPagesMax} belgi`;
  }

  const size = (input.size ?? "").trim();
  if (size.length > PRODUCT_CATEGORY_LIMITS.sizeMax) {
    err.size = `Eng ko‘pi bilan ${PRODUCT_CATEGORY_LIMITS.sizeMax} belgi`;
  }

  return err;
}

export function normalizeMaterialPayload(input: {
  itemName: string;
  itemType: string;
  unitName: string;
  quantity: number | string | null | undefined;
}) {
  const q = input.quantity;
  const quantity =
    q === "" || q === null || q === undefined
      ? 0
      : typeof q === "number"
        ? q
        : Number(String(q).replace(",", "."));

  return {
    itemName: input.itemName.trim(),
    itemType: input.itemType.trim(),
    unitName: input.unitName.trim(),
    quantity: Math.round(quantity * 1000) / 1000,
  };
}
