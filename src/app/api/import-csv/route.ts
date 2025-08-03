import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { matchAndPrepareProperty, createPropertyInDB } from "./importHelpers";

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

    const tags: string[] = rows[2].map((tag: string) => tag && tag.trim());
    const dataRows = rows.slice(3);

    let imported = 0;
    const failedRows: any[] = [];
    const rowsToImport: any[] = [];

    for (let rowIndex = 0; rowIndex < dataRows.length; rowIndex++) {
      const row = dataRows[rowIndex];
      if (!row || row.every(cell => !cell || cell.trim() === "")) continue;
      const obj: Record<string, string> = {};
      tags.forEach((tag, idx) => { obj[tag] = (row[idx] || "").trim(); });

      // DRY: Use helper
      const result = await matchAndPrepareProperty(obj, rowIndex + 4);

      if (result.failedRow) {
        failedRows.push(result.failedRow);
      } else if (result.match) {
        rowsToImport.push(result.match);
      }
    }

    // Stop for user correction if any errors
    if (failedRows.length > 0) {
      return NextResponse.json({
        error: "Algunas filas tienen campos obligatorios no encontrados o mal escritos.",
        failedRows,
        imported,
      }, { status: 422 });
    }

    // Bulk import
    for (const entry of rowsToImport) {
      try {
        await createPropertyInDB(entry);
        imported++;
      } catch (e: any) {
        // Optionally collect DB errors for user
      }
    }

    return NextResponse.json({
      imported,
      message: `Se importaron ${imported} propiedades.`
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Error inesperado al cargar el archivo." }, { status: 500 });
  }
}
