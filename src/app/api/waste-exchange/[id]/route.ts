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

    const { status, coinsRewarded } = await req.json();

    if (!status) {
      return NextResponse.json(
        { message: "Status is required" },
        { status: 400 }
      );
    }

    const { id } = await params;
    
    // Get the current request to check old status
    const currentRequest = await prisma.pickupRequest.findUnique({
      where: { id: id },
    });

    if (!currentRequest) {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const updatedRequest = await prisma.pickupRequest.update({
      where: { id: id },
      data: {
        status,
        coinsRewarded: coinsRewarded !== undefined ? Number(coinsRewarded) : undefined,
      },
    });

    // If changing to COMPLETED for the first time, award coins
    if (status === "COMPLETED" && currentRequest.status !== "COMPLETED" && coinsRewarded) {
        await prisma.user.update({
            where: { id: updatedRequest.userId },
            data: { coins: { increment: Number(coinsRewarded) } }
        });
    }

    return NextResponse.json({ message: "Pickup request updated successfully", request: updatedRequest });
  } catch (error) {
    console.error("Error updating pickup request:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
