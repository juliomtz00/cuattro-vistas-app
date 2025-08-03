// app/api/import-csv/fix-row/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { fixAndMatch } from "../importHelpers";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { field, value, context } = body;

  try {
    const result = await fixAndMatch(field, value, context);

    if (!result) {
      return NextResponse.json({ error: "No se pudo corregir el campo. Intenta con otro valor." }, { status: 422 });
    }

    return NextResponse.json({ ok: true, data: result });
  } catch (e) {
    return NextResponse.json({ error: "Error inesperado al corregir el campo." }, { status: 500 });
  }
}
