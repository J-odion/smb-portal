import { AsyncLocalStorage } from 'async_hooks';
export declare const tenantContext: AsyncLocalStorage<{
    tenantId: string;
}>;
