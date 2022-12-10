export interface Orders {
    id: string;
    payment: string;
    transport: string;
    deliveryAddress: string;
    ordersCode: string;
    orderDate: Date;
    note: string;
    total: number;
    status: number;
    paid: number;
    isActive: number;
}