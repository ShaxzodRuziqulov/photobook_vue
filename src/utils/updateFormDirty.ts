/** Tahrir rejimida "boshlang'ich" va hozirgi holatni solishtirish uchun yagona serializatsiya. */

export function normStr(v: unknown): string {
  return String(v ?? "").trim();
}

export type OrderFormSnapshotFields = {
  categoryId: string;
  orderName: string;
  itemType: string;
  customerId: string;
  customerName: string;
  receiverName: string;
  employees: string[];
  pageCount: number | null;
  amount: number | null;
  acceptedDate: string;
  deadline: string;
  status: string;
  imageUrl: string;
  notes: string;
  uploadId: string;
};

export function snapshotOrderForm(
  f: OrderFormSnapshotFields,
  hasPendingImageFile: boolean,
  removedOldImage: boolean,
): string {
  const emp = [...(f.employees || [])].map(String).sort().join("\u0001");
  const pageCount =
    f.pageCount === null || f.pageCount === undefined || Number.isNaN(Number(f.pageCount))
      ? null
      : Number(f.pageCount);
  const amount =
    f.amount === null || f.amount === undefined || Number.isNaN(Number(f.amount))
      ? null
      : Number(f.amount);
  return JSON.stringify({
    categoryId: normStr(f.categoryId),
    orderName: normStr(f.orderName),
    itemType: normStr(f.itemType),
    customerId: normStr(f.customerId),
    customerName: normStr(f.customerName),
    receiverName: normStr(f.receiverName),
    employees: emp,
    pageCount,
    amount,
    acceptedDate: normStr(f.acceptedDate),
    deadline: normStr(f.deadline),
    status: normStr(f.status),
    imageUrl: normStr(f.imageUrl),
    notes: normStr(f.notes),
    uploadId: normStr(f.uploadId),
    hasPendingImageFile,
    removedOldImage,
  });
}

export function snapshotMaterialFields(f: {
  itemName: string;
  itemType: string;
  unitName: string;
  quantity: number | null;
}): string {
  const q =
    f.quantity === null || f.quantity === undefined || Number.isNaN(Number(f.quantity))
      ? null
      : Number(f.quantity);
  return JSON.stringify({
    itemName: normStr(f.itemName),
    itemType: normStr(f.itemType),
    unitName: normStr(f.unitName),
    quantity: q,
  });
}

export function snapshotUserEmployeeEdit(
  f: {
    firstName: string;
    lastName: string;
    username: string;
    profession: string;
    phone: string | null;
    bio: string;
    avatarUrl: string;
    uploadId: string;
    isActive: boolean;
    roles: { id: string }[];
  },
  passwordSet: boolean,
  hasPendingAvatarFile: boolean,
): string {
  const roleIds = (f.roles || []).map((r) => String(r.id)).sort().join("\u0001");
  return JSON.stringify({
    firstName: normStr(f.firstName),
    lastName: normStr(f.lastName),
    username: normStr(f.username),
    profession: normStr(f.profession),
    phone: normStr(f.phone),
    bio: normStr(f.bio),
    avatarUrl: normStr(f.avatarUrl),
    uploadId: normStr(f.uploadId),
    isActive: !!f.isActive,
    roles: roleIds,
    passwordSet,
    hasPendingAvatarFile,
  });
}

export function snapshotSortedRoleIds(ids: string[]): string {
  return JSON.stringify([...(ids || [])].map(String).sort());
}

export function snapshotProfileMePatch(
  f: {
    firstName: string;
    lastName: string;
    profession: string;
    phone: string;
    bio: string;
    avatarUrl: string;
    uploadId: string;
  },
  hasPendingAvatarFile: boolean,
): string {
  return JSON.stringify({
    firstName: normStr(f.firstName),
    lastName: normStr(f.lastName),
    profession: normStr(f.profession),
    phone: normStr(f.phone),
    bio: normStr(f.bio),
    avatarUrl: normStr(f.avatarUrl),
    uploadId: normStr(f.uploadId),
    hasPendingAvatarFile,
  });
}

export function snapshotProductCategory(c: {
  name: string;
  defaultPages: string | number | null;
  size: string | null;
  kind: string;
}): string {
  return JSON.stringify({
    name: normStr(c.name),
    defaultPages:
      c.defaultPages === null || c.defaultPages === undefined
        ? ""
        : normStr(c.defaultPages),
    size: c.size === null || c.size === undefined ? "" : normStr(c.size),
    kind: normStr(c.kind),
  });
}

export function snapshotTaskProgressDialog(notes: string, processedCount: number): string {
  return JSON.stringify({
    notes: normStr(notes),
    processedCount: Number(processedCount) || 0,
  });
}
