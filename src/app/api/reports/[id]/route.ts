import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { status } = await req.json();

    if (!status) {
      return NextResponse.json(
        { message: "Status is required" },
        { status: 400 }
      );
    }

    const { id } = await params;

    const report = await prisma.report.update({
      where: { id: id },
      data: { status },
    });

    return NextResponse.json({ message: "Status updated successfully", report });
  } catch (error) {
    console.error("Error updating report status:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
