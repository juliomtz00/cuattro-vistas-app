import { z } from "zod";

// Step 1: Basic Info
export const AddPropertyFormSchema = z.object({
  propertyId: z.string().min(1, "Ingresa un ID para la propiedad"),
  title: z.string().min(1, "Ingresa un título"),
  description: z.string().optional(),
  price: z
    .string()
    .min(1, "Ingresa un precio")
    .regex(/^\d+(\.\d{1,2})?$/, "Debe ser un número válido")
    .transform((val) => parseFloat(val)),
  videoUrl: z.string().trim().refine((val) => val === "" || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(val),{ message: "Debe ser una URL válida" }),
  availability: z.boolean(),
  propertyTypeId: z.string().min(1, "Selecciona un tipo de propiedad"),
  statusId: z.string().min(1, "Selecciona un estatus"),

  providerId: z.string().optional(),
  propertyRangeId: z.string().optional(),
  illuminationId: z.string().optional(),
  propertyConditionId: z.string().optional(),
  zoneDemandId: z.string().optional(),
  accesibilityId: z.string().optional(),

  // Step 2: Location
  stateId: z.string().min(1, "Selecciona un estado"),
  cityId: z.string().min(1, "Selecciona una ciudad o municipio"),
  zipCode: z
    .string()
    .length(5, "El código postal debe tener 5 dígitos")
    .regex(/^\d{5}$/, "Debe contener solo números"),
  address: z.string().optional(),
  urlGoogleMaps: z.string().trim().refine((val) => val === "" || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(val),{ message: "URL inválida" }),

  // Step 3: Details / Features
  bedrooms: z.string().optional().transform((val) => (val ? Number(val) : undefined)),
  bathrooms: z.string().optional().transform((val) => (val ? Number(val) : undefined)),
  halfBathrooms: z.string().optional().transform((val) => (val ? Number(val) : undefined)),
  parking: z.string().optional().transform((val) => (val ? Number(val) : undefined)),
  terrainM2: z.string().optional().transform((val) => (val ? Number(val) : undefined)),
  constructionM2: z.string().optional().transform((val) => (val ? Number(val) : undefined)),
  levels: z.string().optional().transform((val) => (val ? Number(val) : undefined)),
  age: z.string().optional().transform((val) => (val ? Number(val) : undefined)),

  balcon: z.boolean(),
  pool: z.boolean(),
  furnished: z.boolean(),
  downtown: z.boolean(),
  acceptsCreditBank: z.boolean(),
  acceptsCreditSocial: z.boolean(),

  connectivity: z.string().optional(),
  greenAreas: z.string().optional(),

  // Step 4: Files
  files: z
    .array(z.instanceof(File))
    .optional()
    .or(z.literal(undefined))
});
