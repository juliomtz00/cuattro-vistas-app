import { NextRequest, NextResponse } from "next/server";
import { matchAndPrepareProperty, createPropertyInDB } from "../importHelpers";

export async function POST(req: NextRequest) {
  try {
    const { row, field, value, original } = await req.json();
    const fixedObj = { ...original, [field]: value };
    const result = await matchAndPrepareProperty(fixedObj, row);

    if (result.failedRow) {
      return NextResponse.json({ failedRow: result.failedRow }, { status: 422 });
    }

    await createPropertyInDB(result.match);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ failedRow: { message: error.message } }, { status: 400 });
  }
}
