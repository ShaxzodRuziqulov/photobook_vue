export interface Register {
    name: string;
    email: string;
    password: string;
}

export interface UserLogin {
    userName: string;
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

export interface AllCategory {
    id: string;
    name: string;
    pageNumber: string | null;
    itemSize: string | null;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface AllOrders {
    id: string;
    categoryName: string | null; // buyurtma turi nomi
    orderName: string; // buyurtma nomi { tuy, maktab ...,}
    itemType: string;
    pageNumber: number | null; // betlar soni
    amountNumber: number | null; //buyurtma soni
    customerName: string; // mijoz nomi
    receiverName: string; // qabul qiluvchi
    employeeName: string; // xodim
    processNumber: number | null; // jarayonda bajarilgan holati soni
    termData: string | null; // muddat tugash sanasi
    status: string; // holat
    imageUrl: string;
    // doneData: number | null; // bajarildi
    createdData: string;
    createdAt: string | null; // yaratilgan kun
    updatedAt: string | null; // yangilangan kun
}

export interface Order {
    id: string;
    categoryName: string | null;
    orderName: string;
    pageNumber: number | null;
    amountNumber: number | null;
    customerName: string;
    receiverName: string;
    employeeName: string;
    processNumber: number | null;
    termData: string | null;
    status: string;
    imageUrl: string;
    //doneData: number | null;
    createdData: string;
    createdAt: string | null;
    updatedAt: string | null;
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
    employeeName: string;
    processNumber: number | null;
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
    fullName: string;
    profession: string;
    isLogin: string;
    isPassword: string;
    roles: string;
    phoneNumber: number | null;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface Role {
    id: number
    name: string
    description: string
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