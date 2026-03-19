export interface Register {
    name: string;
    email: string;
    password: string;
}

export interface UserLogin {
    username: string;
    password: string;
}

export interface IItems {
    id: string | null;
    itemName: string;
    itemType: string;
    unitName: string;
    quantity: number | null;
    createdAt: string | null;
    updatedAt: string | null;
}

export type OrderKind = "ALBUM" | "VIGNETTE" | "PICTURE";
export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface AllCategory {
    id: string | null;
    kind: OrderKind;
    name: string;
    defaultPages: string | null;
    size: string | null;
}

export interface EmployeeStatus {
    employeeId: string
    employeeName: string
    processedCount: number | null;
    stepOrder: number | null;
    workStatus: OrderStatus;
}

export interface AllOrders {
    id: string;
    kind: OrderKind;
    categoryId: string | null;
    categoryName: string | null; // buyurtma turi nomi
    orderName: string; // buyurtma nomi { tuy, maktab ...,}
    itemType: string;
    pageCount: number | null; // betlar soni
    amount: number | null; //buyurtma soni
    customerId: string;
    customerName: string; // mijoz nomi
    receiverName: string; // qabul qiluvchi
    employeeIds: string[]; // xodim
    employeeNames: string[];
    processedCount: number | null; // jarayonda bajarilgan holati soni
    termData: string | null; // muddat tugash sanasi
    status: OrderStatus; // holat
    imageUrl: string;
    // doneData: number | null; // bajarildi
    acceptedDate: string;
    deadline: string;
    notes: string | null;
}

export interface PagingRequest {
    page: number;
    size: number;
    sort?: string;
    direction?: string;
    search?: string;
    kind?: OrderKind;
    status?: OrderStatus | string;
    customerId?: string;
    employeeId?: string;
    categoryId?: string;
    from?: string;
    to?: string;
    deadlineFrom?: string;
    deadlineTo?: string;
}

export interface PagingResponse<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface Order {
    id: string;
    kind: OrderKind;
    categoryId: string;
    categoryName: string;
    orderName: string;
    itemType: string;
    customerId: string;
    customerName: string;
    receiverName: string;
    employees: EmployeeStatus[];
    pageCount: number;
    amount: number;
    processedCount: number;
    acceptedDate: string;
    deadline: string;
    status: OrderStatus;
    imageUrl: string;
    notes: string;
    uploadId: string;
}
export interface OrderCreateDto {
    kind: OrderKind;
    categoryId: string;
    categoryName: string;
    orderName: string;
    itemType?: string;
    customerId?: string;
    customerName: string;
    receiverName: string;
    employees: EmployeeStatus[];
    pageCount: number | null;
    amount: number | null;
    acceptedDate: string;
    deadline: string;
    status: string;
    imageUrl?: string;
    notes?: string;
    uploadId: string;
}

export interface IPicture {
    id: string;
    categoryName: string | null;
    orderName: string;
    itemType: string;
    pageNumber: number | null;
    amountNumber: number | null;
    customerName: string;
    receiverName: string;
    employeeId: number[]; // xodim
    employees: EmployeeStatus[];
    processedCount: number | null;
    termData: string | null;
    status: string;
    imageUrl: string;
    //doneData: number | null;
    createdData: string;
    createdAt: string | null;
    updatedAt: string | null;
}
export interface UserForm {
    id: string;
    firstName: string;
    lastName: string;
    profession: string;
    username: string;
    password: string;
    avatarUrl: string;
    phone: string | null;
    bio: string;
    isActive: boolean;
    uploadId: string;
    roles: Role[];
}

export interface UserTask {
    orderId: string;
    kind: OrderKind;
    categoryId: string;
    categoryName: string;
    orderName: string;
    itemType: string;
    customerId: string;
    customerName: string;
    receiverName: string;
    pageCount: number | null;
    amount: number | null;
    processedCount: number | null;
    acceptedDate: string;
    deadline: string;
    status: OrderStatus;
    imageUrl: string;
    stepOrder: number | null;
    canWork: boolean;
    notes: string;
}

export interface Role {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    description: string
}


export interface IPaging {
    page: number;
    size: number;
    sort?: string[];
    search: string;
    statuses: OrderStatus[];
    from: string;
    to: string;
    deadlineFrom: string;
    deadlineTo: string;
}

export interface UserPagingRequest {
    page: number
    size: number
    sort?: string[]
    search?: string
    isActive?: boolean
    role?: string
}

export interface ExpensesForm {
    id: number | string | null;
    name: string;
    price: number | null;
    description: string;
    itemId: string;
    date: string;
    paymentMethod: string;
    receipt_image: string;
}

export interface IForm {
    name: string;
    pageNumber: null;
}

export interface IFormData {
    id: string | null;
    name: string;
    pageNumber: string | null;
    createdAt: number | null;
    updatedAt: number | null;
}