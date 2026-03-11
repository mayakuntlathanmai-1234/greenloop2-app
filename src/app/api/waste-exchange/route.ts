import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let requests;
    if (session.user.role === "ADMIN") {
      requests = await prisma.pickupRequest.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      });
    } else {
      requests = await prisma.pickupRequest.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching pickup requests:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { wasteType, quantity, date, time, address } = await req.json();

    if (!wasteType || !quantity || !date || !time || !address) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const request = await prisma.pickupRequest.create({
      data: {
        wasteType,
        quantity,
        date,
        time,
        address,
        userId: session.user.id,
        status: "PENDING",
      },
    });

    return NextResponse.json({ message: "Pickup scheduled successfully", request }, { status: 201 });
  } catch (error) {
    console.error("Error creating pickup request:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
