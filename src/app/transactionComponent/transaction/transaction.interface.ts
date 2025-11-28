export interface Transaction {
    id: string;
    productId: string;
    quantity: number;
    supplierId: string;
    description: string;
    transactionType: string;
    status: string;
    totalPrice: number;
    totalProducts: number;
    createdAt: string;
}