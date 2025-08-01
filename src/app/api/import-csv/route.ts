import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import prisma from "@/lib/prisma";
import { normalize, capitalizeFirst, formatZip } from "@/app/utils/normalize";

// Corrige CDMX → Ciudad de México
function normalizeStateName(name: string) {
  const n = normalize(name);
  if (n === "cdmx" || n === "ciudad de mexico") return "Ciudad de México";
  return capitalizeFirst(name);
}

// General-purpose lookup/create for value-based tables (e.g., propertyRange, illumination, etc)
async function lookupOrCreate(
  modelName: string,
  value: string | undefined,
  tag: string,
  rowIndex?: number,
  errors?: any[],
  warnings?: any[]
) {
  if (!value) return null;
  const normValue = capitalizeFirst(value.trim());
  // FIX: Cast prisma as any for dynamic access
  const model =
    (prisma as any)[modelName] ||
    (prisma as any)[modelName.toLowerCase()] ||
    (prisma as any)[modelName.charAt(0).toLowerCase() + modelName.slice(1)];
  if (!model) {
    if (errors) errors.push({ row: rowIndex, field: tag, msg: `Modelo Prisma '${modelName}' no encontrado.` });
    return null;
  }
  let rec = await model.findFirst({
    where: { value: { equals: normValue, mode: "insensitive" } },
  });
  if (!rec) {
    rec = await model.create({ data: { value: normValue } });
    if (warnings) warnings.push({ row: rowIndex, field: tag, msg: `${tag} '${normValue}' agregado` });
  }
  return rec;
}


export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = buffer.toString("utf-8");
    const delimiter = text.split("\n")[0].includes(";") ? ";" : ",";
    const rows = parse(text, { relax_column_count: true, delimiter });
    if (rows.length < 3) {
      return NextResponse.json({ error: "Archivo CSV inválido." }, { status: 400 });
    }
    const tags = rows[1].map((tag: string) => tag.trim());
    const dataRows = rows.slice(2);

    const errors: any[] = [];
    const warnings: any[] = [];
    let imported = 0;

    for (let rowIndex = 0; rowIndex < dataRows.length; rowIndex++) {
      const row = dataRows[rowIndex];
      if (!row.length || row.every(cell => !cell || cell.trim() === "")) continue;
      const obj: Record<string, string> = {};
      tags.forEach((tag: string, idx: number) => (obj[tag] = (row[idx] || "").trim()));

      // --- Normalize and lookup foreign keys
      const stateName = normalizeStateName(obj.state);
      const cityName = capitalizeFirst(obj.city);
      const propertyTypeName = capitalizeFirst(obj.propertyType);
      const statusName = capitalizeFirst(obj.status);
      const providerName = obj.provider ? capitalizeFirst(obj.provider) : null;

      // Lookup/crea Estado
      let state = await prisma.state.findFirst({ where: { name: { equals: stateName } } });
      if (!state) {
        state = await prisma.state.create({ data: { name: stateName } });
        warnings.push({ row: rowIndex + 3, field: "state", msg: `Estado '${stateName}' agregado` });
      }

      // Lookup/crea Ciudad
      let city = await prisma.city.findFirst({ where: { name: cityName.toLowerCase(), stateId: state.id } });
      if (!city) {
        city = await prisma.city.create({ data: { name: cityName, state: { connect: { id: state.id } } } });
        warnings.push({ row: rowIndex + 3, field: "city", msg: `Ciudad '${cityName}' agregada a '${stateName}'` });
      }

      // Lookup/crea PropertyType
      let propertyType = await prisma.propertyType.findFirst({ where: { value: propertyTypeName } });
      if (!propertyType) {
        propertyType = await prisma.propertyType.create({ data: { value: propertyTypeName } });
        warnings.push({ row: rowIndex + 3, field: "propertyType", msg: `Tipo '${propertyTypeName}' agregado` });
      }

      // Lookup/crea Status
      let status = await prisma.propertyStatus.findFirst({ where: { value: statusName.toLowerCase() } });
      if (!status) {
        status = await prisma.propertyStatus.create({ data: { value: statusName } });
        warnings.push({ row: rowIndex + 3, field: "status", msg: `Estatus '${statusName}' agregado` });
      }

      // Lookup/crea Provider
      let provider = null;
      if (providerName) {
        provider = await prisma.provider.findFirst({ where: { value: providerName } });
        if (!provider) {
          provider = await prisma.provider.create({ data: { value: providerName, id: providerName.replace(/\s/g, "_").toLowerCase() } });
          warnings.push({ row: rowIndex + 3, field: "provider", msg: `Proveedor '${providerName}' agregado` });
        }
      }

      // Lookup/crea valores de tablas auxiliares (puedes cambiar nombres si tu schema usa otros)
      const propertyRange = await lookupOrCreate("propertyRange", obj.propertyRange, "propertyRange", rowIndex + 3, errors, warnings);
      const illumination = await lookupOrCreate("illumination", obj.illumination, "illumination", rowIndex + 3, errors, warnings);
      const propertyCondition = await lookupOrCreate("propertyCondition", obj.propertyCondition, "propertyCondition", rowIndex + 3, errors, warnings);
      const zoneDemand = await lookupOrCreate("zoneDemand", obj.zoneDemand, "zoneDemand", rowIndex + 3, errors, warnings);

      // Soporta typo: 'accesibility' o 'accessibility'
      const accesibility = await lookupOrCreate(
        prisma["accesibility"] ? "accessibility" : "accesibility",
        obj.accessibility,
        "accesibility",
        rowIndex + 3,
        errors,
        warnings
      );

      // --- Crea propiedad principal
      try {
        await prisma.property.create({
          data: {
            propertyId: obj.propertyId || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            title: obj.title || "",
            description: obj.description || "",
            price: obj.price ? Number(obj.price?.replace(/[^0-9.]/g, "")) : 0,
            userId: "admin", // Hardcode or use actual user if available
            availability: ["sí", "si", "yes", "true"].includes((obj.availability || "").toLowerCase()),
            videoUrl: obj.videoUrl || null,

            propertyTypeId: propertyType?.id || null,
            statusId: status?.id || null,
            providerId: provider?.id || null,
            propertyRangeId: propertyRange?.id || null,
            illuminationId: illumination?.id || null,
            propertyConditionId: propertyCondition?.id || null,
            zoneDemandId: zoneDemand?.id || null,
            accesibilityId: accesibility?.id || null,

            features: {
              create: {
                bedrooms: Number(obj.bedrooms) || 0,
                bathrooms: Number(obj.bathrooms) || 0,
                halfBathrooms: Number(obj.halfBathrooms) || 0,
                balcon: (obj.balcon || "").toLowerCase().startsWith("s"),
                pool: (obj.pool || "").toLowerCase().startsWith("s"),
                furnished: (obj.furnished || "").toLowerCase().startsWith("s"),
                downtown: (obj.downtown || "").toLowerCase().startsWith("s"),
                terrainM2: Number(obj.terrainM2) || 0,
                constructionM2: Number(obj.constructionM2) || 0,
                levels: Number(obj.levels) || 0,
                parking: Number(obj.parking) || 0,
                acceptsCreditBank: (obj.acceptsCreditBank || "").toLowerCase().startsWith("s"),
                acceptsCreditSocial: (obj.acceptsCreditSocial || "").toLowerCase().startsWith("s"),
                age: Number(obj.age) || 0,
                connectivity: obj.connectivity || "",
                greenAreas: obj.greenAreas || "",
                value: "auto",
              },
            },

            location: {
              create: {
                address: obj.address || "",
                zipCode: obj.zipCode ? Number(formatZip(obj.zipCode)) : null,
                urlGoogleMaps: obj.urlGoogleMaps || "",
                cityId: city?.id || null,
                value: "auto",
              },
            },

            images: obj.images
              ? {
                  create: obj.images
                    .split(";")
                    .map((url: string) => ({ url: url.trim() }))
                    .filter(img => img.url),
                }
              : undefined,
          }
        });
        imported++;
      } catch (e: any) {
        errors.push({ row: rowIndex + 3, msg: `No se pudo importar: ${e.message}` });
        continue;
      }
    }

    return NextResponse.json({ imported, errors, warnings });
  } catch (error: any) {
    return NextResponse.json({ error: "Error inesperado al cargar el archivo." }, { status: 500 });
  }
}
