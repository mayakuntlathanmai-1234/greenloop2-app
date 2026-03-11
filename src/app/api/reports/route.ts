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

    // Admins see all reports, users see only their own
    let reports;
    if (session.user.role === "ADMIN") {
      reports = await prisma.report.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      });
    } else {
      reports = await prisma.report.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { description, location, imageUrl } = await req.json();

    if (!description || !location) {
      return NextResponse.json(
        { message: "Description and location are required" },
        { status: 400 }
      );
    }

    const report = await prisma.report.create({
      data: {
        description,
        location,
        imageUrl: imageUrl || null,
        userId: session.user.id,
        status: "PENDING",
      },
    });
    
    // Award coins for submitted report
    await prisma.user.update({
      where: { id: session.user.id },
      data: { coins: { increment: 10 } }
    });

    return NextResponse.json({ message: "Report submitted successfully", report, coinsEarned: 10 }, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
