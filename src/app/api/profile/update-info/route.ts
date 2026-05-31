import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { 
      userId, 
      addressLine1, 
      city, 
      state, 
      postalCode, 
      phone 
    } = await req.json();

    if (!userId) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    // Update the User record in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        addressLine1,
        city,
        state,
        postalCode,
        phone,
      },
    });

    // Return the updated user (excluding sensitive fields like password)
    const { password: _, ...safeUser } = updatedUser;
    
    return NextResponse.json({ 
      ok: true, 
      message: "profile updated.", 
      user: safeUser 
    });
    
  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ ok: false, error: "Failed to update profile." }, { status: 500 });
  }
}