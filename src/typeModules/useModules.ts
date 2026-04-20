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
export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED';
export type WorkStatus = 'PENDING' | 'STARTED' | 'COMPLETED';
export type NotificationType = 'ORDER_ASSIGNED' | 'TASK_ACTIVATED' | 'ORDER_UPDATED' | 'ORDER_STATUS_CHANGED';

export interface SocketAuthenticatedPayload {
    userId: string;
    connectedAt: string;
}

export interface SocketNotification {
    id?: string;
    type: NotificationType;
    title: string;
    message: string;
    orderId: string;
    orderName: string;
    orderStatus: OrderStatus;
    employeeId: string;
    employeeName: string;
    stepOrder: number;
    workStatus: WorkStatus;
    actionRequired: boolean;
    createdAt: string;
    isRead?: boolean;
    read?: boolean;
    readAt?: string | null;
}

export interface NotificationItem extends SocketNotification {
    id: string;
    read: boolean;
    readAt?: string | null;
}

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
    workStatus: WorkStatus;
    notes?: string | null;
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
    pageNumber?: number;
    pageSize?: number;
    sort?: string;
    direction?: string;
    search?: string;
    kind?: OrderKind;
    status?: OrderStatus | string;
    customerId?: string;
    employeeId?: string;
    categoryId?: string;
    acceptedDate?: string;
    deadline?: string;
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
    currentStepProcessedCount?: number;
    activeEmployeeId?: string | null;
    activeEmployeeName?: string | null;
    acceptedDate: string;
    deadline: string;
    status: OrderStatus;
    imageUrl: string;
    notes: string;
    uploadId: string;
    statusHistory?: OrderStatusHistory[];
}

export interface OrderStatusHistory {
    id: string;
    orderId: string;
    fromStatus: OrderStatus | null;
    toStatus: OrderStatus;
    changedById: string;
    changedByName: string;
    changedAt: string;
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
    employees: {
        employeeId: string;
        stepOrder: number;
    }[];
    pageCount: number | null;
    amount: number | null;
    acceptedDate: string;
    deadline: string;
    status: string;
    imageUrl?: string;
    notes?: string;
    uploadId: string;
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
    orderProcessedCount: number | null;
    availableToProcess: number | null;
    remainingAvailable: number | null;
    remainingTotal: number | null;
    acceptedDate: string;
    deadline: string;
    status: OrderStatus;
    imageUrl: string;
    stepOrder: number | null;
    workStatus: WorkStatus;
    canWork: boolean;
    notes: string;
    orderNotes?: string | null;
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
