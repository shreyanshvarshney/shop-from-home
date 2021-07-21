import { ProductDataModels } from './ProductDataModels';

export interface ShoppingCartItem {
    product: ProductDataModels;
    quantity: number;
}