import { z } from 'zod';
export declare const createShiftSchema: z.ZodObject<{
    organizationId: z.ZodString;
    name: z.ZodString;
    status: z.ZodOptional<z.ZodEnum<["active", "inactive", "archived", "draft"]>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    organizationId: string;
    name: string;
    status?: "active" | "inactive" | "archived" | "draft" | undefined;
    metadata?: Record<string, unknown> | undefined;
}, {
    organizationId: string;
    name: string;
    status?: "active" | "inactive" | "archived" | "draft" | undefined;
    metadata?: Record<string, unknown> | undefined;
}>;
export declare const updateShiftSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["active", "inactive", "archived", "draft"]>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    status?: "active" | "inactive" | "archived" | "draft" | undefined;
    name?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
}, {
    status?: "active" | "inactive" | "archived" | "draft" | undefined;
    name?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
}>;
export declare const shiftsFilterSchema: z.ZodObject<{
    organizationId: z.ZodString;
    status: z.ZodOptional<z.ZodEnum<["active", "inactive", "archived", "draft"]>>;
    query: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodNumber>;
    offset: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    organizationId: string;
    status?: "active" | "inactive" | "archived" | "draft" | undefined;
    limit?: number | undefined;
    query?: string | undefined;
    offset?: number | undefined;
}, {
    organizationId: string;
    status?: "active" | "inactive" | "archived" | "draft" | undefined;
    limit?: number | undefined;
    query?: string | undefined;
    offset?: number | undefined;
}>;
//# sourceMappingURL=schema.d.ts.map