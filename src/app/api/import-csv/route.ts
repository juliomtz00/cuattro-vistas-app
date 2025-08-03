// app/api/import-csv/route.ts
import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import prisma from "@/lib/prisma";
import {
  matchAndPrepareProperty,
} from "./importHelpers";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;
    const userId = data.get("userId") as string; // recibe el userId del frontend
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = buffer.toString("utf-8");
    const delimiter = text.split("\n")[0].includes(";") ? ";" : ",";
    const rows = parse(text, { relax_column_count: true, delimiter });

    if (rows.length < 4) {
      return NextResponse.json({ error: "Archivo CSV inválido. No tiene suficientes filas." }, { status: 400 });
    }

    // tags en la fila 2 (índice 2)
    const tags: string[] = rows[2].map((tag: string) => tag && tag.trim());
    const dataRows = rows.slice(3);

    const failedRows: any[] = [];
    const rowsToImport: any[] = [];
    let imported = 0;

    for (let rowIndex = 0; rowIndex < dataRows.length; rowIndex++) {
      const row = dataRows[rowIndex];
      if (!row || row.every(cell => !cell || cell.trim() === "")) continue;
      const obj: Record<string, string> = {};
      tags.forEach((tag, idx) => { obj[tag] = (row[idx] || "").trim(); });

      // --- Matching + validaciones ---
      const matchResult = await matchAndPrepareProperty(obj, userId, rowIndex, failedRows);
      if (!matchResult) continue;
      rowsToImport.push(matchResult);
    }

    if (failedRows.length > 0) {
      return NextResponse.json({
        error: "Algunas filas requieren corrección.",
        failedRows,
        imported,
      }, { status: 422 });
    }

    // --- Realiza la importación ---
    for (const entry of rowsToImport) {
      const { obj, state, city, propertyType, status, provider, propertyRange, illumination, propertyCondition, zoneDemand, accesibility, userId } = entry;
      try {
        await prisma.property.create({
          data: {
            propertyId: obj.propertyId || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            title: obj.title || "",
            description: obj.description || "",
            price: obj.price ? Number(obj.price?.replace(/[^0-9.]/g, "")) : 0,
            userId: userId || "admin",
            availability: ["sí", "si", "yes", "true"].includes((obj.availability || "").toLowerCase()),
            videoUrl: obj.videoUrl || undefined,
            propertyTypeId: propertyType?.id,
            statusId: status?.id,
            providerId: provider?.id || undefined,
            propertyRangeId: propertyRange?.id || undefined,
            illuminationId: illumination?.id || undefined,
            propertyConditionId: propertyCondition?.id || undefined,
            zoneDemandId: zoneDemand?.id || undefined,
            accesibilityId: accesibility?.id || undefined,

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
                zipCode: obj.zipCode ? Number(obj.zipCode) : undefined,
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
                    .filter((img: { url: string }) => img.url),
                }
              : undefined,
          },
        });
        imported++;
      } catch (e: any) {
        failedRows.push({ row: 0, msg: `No se pudo importar: ${e.message}` });
      }
    }

    return NextResponse.json({
      imported,
      message: `Se importaron ${imported} propiedades.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Error inesperado al cargar el archivo." }, { status: 500 });
  }
}
