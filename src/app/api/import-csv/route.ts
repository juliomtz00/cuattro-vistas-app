// /api/import-csv/route.ts
import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import prisma from "@/lib/prisma";
import { normalize, capitalizeFirst, formatZip } from "@/app/utils/normalize";

// Utilidades para matching flexible de estados/ciudades
const ALIAS_ESTADOS: Record<string, string> = {
  "cdmx": "Ciudad de México",
  "ciudad de mexico": "Ciudad de México",
  "edomex": "Estado de México",
  "méxico": "Estado de México",
  // agrega más alias si es necesario...
};

function normalizeStateName(name: string) {
  const norm = normalize(name).toLowerCase();
  return ALIAS_ESTADOS[norm] || capitalizeFirst(name);
}
function normalizeCityName(name: string) {
  return capitalizeFirst(normalize(name));
}
function cleanValue(val: string) {
  return (val || "").toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = buffer.toString("utf-8");
    const delimiter = text.split("\n")[0].includes(";") ? ";" : ",";
    const rows = parse(text, { relax_column_count: true, delimiter });

    if (rows.length < 4) {
      return NextResponse.json({ error: "Archivo CSV inválido. No tiene suficientes filas." }, { status: 400 });
    }

    // La fila 2 (índice 2) contiene los tags reales
    const tags: string[] = rows[2].map((tag: string) => tag && tag.trim());
    const dataRows = rows.slice(3); // Los datos empiezan de la fila 4

    const errors: any[] = [];
    const warnings: any[] = [];
    let imported = 0;
    const failedRows: any[] = [];
    const rowsToImport: any[] = [];

    // Mapea todos los registros y detecta problemas para resolver en el frontend
    for (let rowIndex = 0; rowIndex < dataRows.length; rowIndex++) {
      const row = dataRows[rowIndex];
      if (!row || row.every(cell => !cell || cell.trim() === "")) continue;

      // Construir objeto propiedad
      const obj: Record<string, string> = {};
      tags.forEach((tag, idx) => { obj[tag] = (row[idx] || "").trim(); });

      // ---- Normalización de campos críticos (flexible)
      const rawState = cleanValue(obj.state);
      const stateName = normalizeStateName(rawState);
      const rawCity = cleanValue(obj.city);
      const cityName = normalizeCityName(rawCity);
      const propertyTypeName = capitalizeFirst(cleanValue(obj.propertyType));
      const statusName = capitalizeFirst(cleanValue(obj.status));
      const providerName = obj.provider ? capitalizeFirst(cleanValue(obj.provider)) : null;

      // Lookup Estado
      const state = await prisma.state.findFirst({
        where: { name: { equals: stateName } }
      });
      if (!state) {
        // Busca aproximado si no se encuentra exacto
        const similar = await prisma.state.findMany({
          where: { name: { contains: stateName.split(" ")[0] } }
        });
        failedRows.push({
          row: rowIndex + 4,
          field: "state",
          value: rawState,
          suggestions: similar.map(e => e.name),
          message: `No se encontró el estado "${rawState}".`
        });
        continue;
      }

      // Lookup Ciudad (dentro del estado encontrado)
      let city = await prisma.city.findFirst({
        where: {
          name: { equals: cityName },
          stateId: state.id
        }
      });
      if (!city) {
        // Busca ciudades similares en ese estado
        const similar = await prisma.city.findMany({
          where: {
            name: { contains: cityName.slice(0, 4) },
            stateId: state.id
          }
        });
        failedRows.push({
          row: rowIndex + 4,
          field: "city",
          value: rawCity,
          state: state.name,
          suggestions: similar.map(c => c.name),
          message: `No se encontró la ciudad "${rawCity}" en "${state.name}".`
        });
        continue;
      }

      // PropertyType
      const propertyType = await prisma.propertyType.findFirst({
        where: { value: { equals: propertyTypeName } }
      });
      if (!propertyType) {
        failedRows.push({
          row: rowIndex + 4,
          field: "propertyType",
          value: propertyTypeName,
          message: `No se encontró el tipo de propiedad "${propertyTypeName}".`
        });
        continue;
      }

      // Status
      const status = await prisma.propertyStatus.findFirst({
        where: { value: { equals: statusName } }
      });
      if (!status) {
        failedRows.push({
          row: rowIndex + 4,
          field: "status",
          value: statusName,
          message: `No se encontró el estatus "${statusName}".`
        });
        continue;
      }

      // Provider (opcional)
      let provider = null;
      if (providerName) {
        provider = await prisma.provider.findFirst({ where: { value: providerName } });
        if (!provider) {
          provider = await prisma.provider.create({
            data: { value: providerName, id: providerName.replace(/\s/g, "_").toLowerCase() }
          });
          warnings.push({ row: rowIndex + 4, field: "provider", msg: `Proveedor '${providerName}' agregado` });
        }
      }

      // Lookup/crea valores auxiliares (puedes reusar tu función lookupOrCreate aquí)
      // ... (igual que antes)

      // Si todo está bien, agrega a la cola de importación
      rowsToImport.push({
        obj,
        state,
        city,
        propertyType,
        status,
        provider,
        rowIndex
      });
    }

    // Si hay errores de mapeo, detén y retorna los rows problemáticos
    if (failedRows.length > 0) {
      return NextResponse.json({
        error: "Algunas filas tienen campos obligatorios no encontrados o mal escritos.",
        failedRows,
        imported,
        warnings,
      }, { status: 422 });
    }

    // --- Realiza importación a la base de datos ---
    for (const entry of rowsToImport) {
      const { obj, state, city, propertyType, status, provider } = entry;
      try {
        await prisma.property.create({
          data: {
            propertyId: obj.propertyId || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            title: obj.title || "",
            description: obj.description || "",
            price: obj.price ? Number(obj.price?.replace(/[^0-9.]/g, "")) : 0,
            userId: "admin", // TODO: set real user
            availability: ["sí", "si", "yes", "true"].includes((obj.availability || "").toLowerCase()),
            videoUrl: obj.videoUrl || undefined,
            propertyTypeId: propertyType.id,
            statusId: status.id,
            providerId: provider?.id || undefined,
            // ... otros IDs de relaciones auxiliares igual que antes

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
                zipCode: obj.zipCode ? Number(formatZip(obj.zipCode)) : undefined,
                urlGoogleMaps: obj.urlGoogleMaps || undefined,
                city: { connect: { id: city.id } },
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
          },
        });
        imported++;
      } catch (e: any) {
        errors.push({ row: entry.rowIndex + 4, msg: `No se pudo importar: ${e.message}` });
      }
    }

    return NextResponse.json({
      imported,
      errors,
      warnings,
      message: `Se importaron ${imported} propiedades.`
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Error inesperado al cargar el archivo." }, { status: 500 });
  }
}
