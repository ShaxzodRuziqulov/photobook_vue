/** Backend JPA cheklovlari bilan mos (Material, ProductCategory). */

export const MATERIAL_LIMITS = {
  itemNameMax: 180,
  itemTypeMax: 120,
  unitNameMax: 60,
  /** DECIMAL(19,3) — jami 19 raqam, shundan 3 ta kasr */
  quantityScale: 3,
  quantityMaxIntegerDigits: 16,
} as const;

export const PRODUCT_CATEGORY_LIMITS = {
  nameMax: 120,
  /** @Enumerated STRING @Column(length = 20) */
  kindMaxLength: 20,
  /** Uzunlik JPA da berilmagan — UI himoyasi */
  defaultPagesMax: 500,
  sizeMax: 255,
} as const;
