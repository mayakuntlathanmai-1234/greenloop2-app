import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const exams = await prisma.exam.findMany({
      include: {
        questions: true
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(exams);
  } catch (error) {
    console.error("Error fetching exams:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, description, passingScore, questions } = await req.json();

    if (!title || !description || !questions || !questions.length) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newExam = await prisma.exam.create({
      data: {
        title,
        description,
        passingScore: passingScore ? Number(passingScore) : 70,
        questions: {
          create: questions.map((q: any) => ({
            text: q.text,
            options: JSON.stringify(q.options),
            answer: Number(q.answer)
          }))
        }
      }
    });

    return NextResponse.json({ message: "Exam created", exam: newExam }, { status: 201 });
  } catch (error) {
    console.error("Error creating exam:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
