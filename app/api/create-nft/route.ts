import { createNFT } from "@/app/lib/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const data = await createNFT();
    return NextResponse.json({ data });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}
