declare class TransactionItemDto {
    product_id?: string;
    description: string;
    quantity: number;
    unit_price: number;
}
export declare class CreateTransactionDto {
    customer_id?: string;
    branch_id?: string;
    type?: string;
    subtotal: number;
    vat: number;
    total: number;
    items?: TransactionItemDto[];
}
export {};
