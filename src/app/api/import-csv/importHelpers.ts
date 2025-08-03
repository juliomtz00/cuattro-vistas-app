// app/api/import-csv/importHelpers.ts
import prisma from "@/lib/prisma";
import { normalize, capitalizeFirst, formatZip } from "@/app/utils/normalize";

// Alias para estados y ejemplo de normalización para otros catálogos si necesitas
const ALIAS_ESTADOS: Record<string, string> = {
  "cdmx": "Ciudad de México",
  "ciudad de mexico": "Ciudad de México",
  "edomex": "Estado de México",
  "méxico": "Estado de México",
};

export function normalizeStateName(name: string) {
  const norm = normalize(name).toLowerCase();
  return ALIAS_ESTADOS[norm] || capitalizeFirst(name);
}
export function normalizeCityName(name: string) {
  return capitalizeFirst(normalize(name));
}
export function cleanValue(val: string) {
  return (val || "").toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

const CATALOGS = [
  { key: "propertyType", prisma: "propertyType", field: "Tipo de Propiedad" },
  { key: "status", prisma: "propertyStatus", field: "Estatus" },
  { key: "provider", prisma: "provider", field: "Proveedor" },
  { key: "propertyRange", prisma: "propertyRange", field: "Rango de Propiedad" },
  { key: "illumination", prisma: "illumination", field: "Iluminación" },
  { key: "propertyCondition", prisma: "propertyCondition", field: "Condición" },
  { key: "zoneDemand", prisma: "zoneDemand", field: "Demanda Zona" },
  { key: "accesibility", prisma: "accesibility", field: "Accesibilidad" },
];

export async function matchCatalog(
  key: string,
  rawValue: string,
  errors: any[],
  rowIndex: number
) {
  if (!rawValue) return { record: null, value: "" };
  const value = capitalizeFirst(cleanValue(rawValue));
  const cat = CATALOGS.find((c) => c.key === key);
  if (!cat) return { record: null, value };
  const record = await (prisma as any)[cat.prisma].findFirst({
    where: { value: { equals: value, mode: "insensitive" } },
  });
  if (!record) {
    // Busca sugerencias similares
    const similar = await (prisma as any)[cat.prisma].findMany({
      where: { value: { contains: value.slice(0, 4), mode: "insensitive" } },
    });
    errors.push({
      row: rowIndex + 4,
      field: key,
      value,
      message: `No se encontró '${cat.field}' "${value}".`,
      suggestions: similar.map((e: any) => e.value),
    });
    return { record: null, value };
  }
  return { record, value };
}

export async function matchAndPrepareProperty(obj: Record<string, string>, userId: string, rowIndex: number, errors: any[]) {
  // propertyId UNIQUE CHECK
  if (obj.propertyId) {
    const exists = await prisma.property.findUnique({ where: { propertyId: obj.propertyId } });
    if (exists) {
      errors.push({
        row: rowIndex + 4,
        field: "propertyId",
        value: obj.propertyId,
        message: `La propiedad con ID '${obj.propertyId}' ya existe.`,
        suggestions: [],
      });
      return null;
    }
  }

  // ---- Normalización
  const rawState = cleanValue(obj.state);
  const stateName = normalizeStateName(rawState);
  const rawCity = cleanValue(obj.city);
  const cityName = normalizeCityName(rawCity);

  // 1. ESTADO
  const state = await prisma.state.findFirst({ where: { name: { equals: stateName } } });
  if (!state) {
    const similar = await prisma.state.findMany({ where: { name: { contains: stateName.split(" ")[0] } } });
    errors.push({
      row: rowIndex + 4,
      field: "state",
      value: rawState,
      message: `No se encontró el estado "${rawState}".`,
      suggestions: similar.map((e) => e.name),
    });
    return null;
  }

  // 2. CIUDAD
  const city = await prisma.city.findFirst({
    where: {
      name: { equals: cityName },
      stateId: state.id,
    },
  });
  if (!city) {
    const similar = await prisma.city.findMany({
      where: {
        name: { contains: cityName.slice(0, 4) },
        stateId: state.id,
      },
    });
    errors.push({
      row: rowIndex + 4,
      field: "city",
      value: rawCity,
      state: state.name,
      message: `No se encontró la ciudad "${rawCity}" en "${state.name}".`,
      suggestions: similar.map((c) => c.name),
    });
    return null;
  }

  // 3. Resto de catálogos (se valida TODO aquí DRY)
  const catalogValues: any = {};
  for (const cat of CATALOGS) {
    const { record } = await matchCatalog(cat.key, obj[cat.key], errors, rowIndex);
    if (cat.key !== "provider" && !record) return null; // Solo provider es opcional
    catalogValues[cat.key] = record;
  }

  return {
    obj,
    state,
    city,
    ...catalogValues,
    userId,
  };
}

export async function fixAndMatch(field: string, value: string, context: any) {
  if (field === "state") {
    let state = await prisma.state.findFirst({ where: { name: { equals: value } } });
    if (!state) {
      state = await prisma.state.create({ data: { name: capitalizeFirst(value) } });
    }
    return state;
  }
  if (field === "city") {
    let city = await prisma.city.findFirst({
      where: { name: { equals: value }, stateId: context.stateId },
    });
    if (!city) {
      city = await prisma.city.create({
        data: { name: capitalizeFirst(value), state: { connect: { id: context.stateId } } },
      });
    }
    return city;
  }
  // genérico para catálogos: (puedes extender para evitar duplicados si quieres)
  const cat = CATALOGS.find((c) => c.key === field);
  if (cat) {
    let record = await (prisma as any)[cat.prisma].findFirst({
      where: { value: { equals: value, mode: "insensitive" } },
    });
    if (!record) {
      record = await (prisma as any)[cat.prisma].create({
        data: { value: capitalizeFirst(value) },
      });
    }
    return record;
  }
  return null;
}
