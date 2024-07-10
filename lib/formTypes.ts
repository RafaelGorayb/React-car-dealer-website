import { z } from "zod";

export const filterSchema = z.object({
    marca: z.string().optional(),
    precoMin: z.number().optional(),
    precoMax: z.number().optional(),
    anoMin: z.date().optional(),
    anoMax: z.date().optional(),
    kmMin: z.number().optional(),
    kmMax: z.number().optional(),
    motorizacao: z.string().optional(),
    blindado: z.boolean().optional(),
});
  
export type FilterSchemaType = z.infer<typeof filterSchema>;