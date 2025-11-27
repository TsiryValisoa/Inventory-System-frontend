export interface Product {
    id: string;
    imageUrl?: string;
    name: string;
    sku: string;
    price: number;
    stockQuantity: number;
    categoryId: string;
    description: string;
    expiryDate?: string;
}
