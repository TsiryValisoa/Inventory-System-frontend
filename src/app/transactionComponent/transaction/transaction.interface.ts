import { Product } from "../../productComponent/product/product.interface";
import { User } from "../../profileComponent/profile/user.interface";
import { Supplier } from "../../supplierComponent/supplier/supplier.interface";

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
    updatedAt: string;
    product: Product;
    user: User
    supplier: Supplier;
}