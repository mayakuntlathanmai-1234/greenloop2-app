import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const startUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { coins: true }
    });

    return NextResponse.json({ coins: startUser?.coins || 0 });
  } catch (error) {
    console.error("Error fetching coins:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
