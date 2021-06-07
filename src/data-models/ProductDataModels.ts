// Extracting an interface that determines the shape of my Product Objects.
// Benefits of doing this:
// With this interface I have no longer have to go Database to figure out what my product object looks like in db.
// Helps in documenting my code and compile time checking (intellisense).
// I can replace products: any = []; with
// products: ProductDataModels[];
export interface ProductDataModels {
    title: string;
    price: number;
    currency: string;
    category: string;
    image_url: string;
    upload_type: string;
    date_created: string;
    date_updated: string;

    // Not in db
    key: string;
    quantity: number;
}
