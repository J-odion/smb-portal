import { AsyncLocalStorage } from 'async_hooks';
export declare const tenantContext: AsyncLocalStorage<{
    tenantId: string;
}>;
export declare function getTenantId(): string | undefined;
