import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// This file simply mocks/seeds 1 exam for the demo since the requirement is only to *have* an exam system, not an elaborate admin exam builder.
export async function GET() {
  try {
    // Basic seed check
    const examCheck = await prisma.exam.findFirst();
    let examId = examCheck?.id;

    if (!examCheck) {
      const newExam = await prisma.exam.create({
        data: {
          title: "Waste Management Fundamentals",
          description: "Test your knowledge on recycling and general waste categorization.",
          passingScore: 70,
        }
      });
      examId = newExam.id;
      
      // Add questions
      await prisma.question.createMany({
        data: [
          {
            examId,
            text: "Which of these is considered hazardous waste?",
            options: JSON.stringify(["Food scraps", "Used batteries", "Paper", "Glass bottles"]),
            answer: 1 // index 1: Used batteries
          },
          {
            examId,
            text: "What does the 'Reduce' in the 3 R's mean?",
            options: JSON.stringify(["Using less resources", "Throwing away less often", "Buying more items", "Creating smaller garbage bags"]),
            answer: 0
          },
          {
            examId,
            text: "How long does it take for a plastic bottle to decompose approximately?",
            options: JSON.stringify(["10 years", "50 years", "450 years", "Never"]),
            answer: 2
          }
        ]
      });
    }

    const exam = await prisma.exam.findFirst({
      include: {
        questions: true
      }
    });

    // Strip answers before sending to client
    const safeExam = {
      ...exam,
      questions: exam?.questions.map(q => ({
        id: q.id,
        text: q.text,
        options: q.options // sending options but NOT the `answer` index
      }))
    };

    return NextResponse.json(safeExam);
  } catch (error) {
    console.error("Error fetching exam:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { examId, answers } = await req.json();

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: { questions: true }
    });

    if (!exam) return NextResponse.json({ message: "Exam not found" }, { status: 404 });

    let correctCount = 0;
    
    // Evaluate answers
    // answers should be record of questionId -> selectedIndex
    exam.questions.forEach(q => {
       if (answers[q.id] === q.answer) {
         correctCount++;
       }
    });

    const scorePercentage = Math.round((correctCount / exam.questions.length) * 100);
    const passed = scorePercentage >= exam.passingScore;
    
    // Save Result
    const result = await prisma.examResult.create({
      data: {
        userId: session.user.id,
        examId: exam.id,
        score: scorePercentage,
        passed,
      }
    });

    // If passed, award 50 coins and generate a certificate entry
    let awardedCoins = 0;
    let certificate = null;

    if (passed) {
      awardedCoins = 50;
      await prisma.user.update({
        where: { id: session.user.id },
        data: { coins: { increment: 50 } }
      });

      // Check if certificate already exists to prevent duplicates
      const existingCert = await prisma.certificate.findFirst({
         where: { userId: session.user.id, title: exam.title }
      });

      if (!existingCert) {
        certificate = await prisma.certificate.create({
          data: {
            userId: session.user.id,
            title: exam.title,
          }
        });
      } else {
        certificate = existingCert;
      }
    }

    return NextResponse.json({ 
      score: scorePercentage, 
      passed,
      awardedCoins,
      certificateId: certificate?.id
    });
  } catch (error) {
    console.error("Error submitting exam:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
