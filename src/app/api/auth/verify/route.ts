import { NextResponse } from "next/server";
import { currentRecoveryCode } from "../recover/route";

export async function POST(req: Request) {
  const { code } = await req.json();

  if (code === currentRecoveryCode && code !== null) {
    // Grant temporary session access
    return NextResponse.json({ 
      ok: true, 
      adminKey: process.env.NEXT_PUBLIC_ADMIN_KEY 
    });
  }

  return NextResponse.json({ ok: false, message: "Invalid Code" }, { status: 401 });
}