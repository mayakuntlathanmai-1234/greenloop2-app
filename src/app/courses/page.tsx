"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Award, BookOpen, CheckCircle, Clock, Save, FileCheck, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function CoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("learn"); // 'learn' or 'exam'
  
  // Exam states
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/exams")
      .then((res) => res.json())
      .then((data) => {
        setExam(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex
    });
  };

  const handleSubmitExam = async () => {
    if (!session) {
      router.push("/login?callbackUrl=/courses");
      return;
    }

    if (Object.keys(answers).length !== exam?.questions?.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: exam.id,
          answers,
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.message || "Failed to submit exam");
      }
    } catch (err) {
      setError("An error occurred during submission");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl border-b pb-6 border-green-200">
            Education Hub
          </h1>
          
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => setActiveTab("learn")}
              className={`px-4 py-2 rounded-t-lg font-medium text-lg transition-colors ${activeTab === "learn" ? "bg-white text-green-700 border-t-2 border-x-2 border-green-200" : "bg-green-100 text-gray-600 hover:bg-green-200"}`}
            >
              Study Materials
            </button>
            <button
              onClick={() => setActiveTab("exam")}
              className={`px-4 py-2 rounded-t-lg font-medium text-lg transition-colors ${activeTab === "exam" ? "bg-white text-green-700 border-t-2 border-x-2 border-green-200" : "bg-green-100 text-gray-600 hover:bg-green-200"}`}
            >
              Certification Exam
            </button>
          </div>
        </div>

        <div className="bg-white rounded-b-2xl rounded-tr-2xl shadow-sm border border-green-200 min-h-[50vh]">
          {activeTab === "learn" && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen className="h-6 w-6 text-green-600" />
                      Fundamentals of Waste Management
                    </h2>
                    <p className="text-lg text-gray-700 mb-4">
                      Effective waste management is critical for the environment. It involves the collection, transportation, processing, and disposal of waste materials. Let's explore the core concepts.
                    </p>
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mb-6">
                      <h4 className="font-bold text-green-800">The 3 R's Hierarchy</h4>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-green-900">
                        <li><strong>Reduce:</strong> Using fewer resources and creating less waste in the first place.</li>
                        <li><strong>Reuse:</strong> Finding new ways to use items instead of throwing them away.</li>
                        <li><strong>Recycle:</strong> Turning materials that would otherwise become waste into valuable resources.</li>
                      </ul>
                    </div>
                  </section>
                  
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Waste Categorization</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 border-b pb-2 mb-2">Organic Waste</h4>
                        <p className="text-gray-600 text-sm">Food scraps, yard waste. Should be composted.</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 border-b pb-2 mb-2">Recyclables</h4>
                        <p className="text-gray-600 text-sm">Paper, cardboard, glass, certain plastics, metals.</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4 bg-red-50">
                        <h4 className="font-bold text-gray-900 border-b pb-2 mb-2 text-red-800">Hazardous Waste</h4>
                        <p className="text-gray-600 text-sm">Batteries, electronics, paints, chemicals. Requires special disposal.</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 border-b pb-2 mb-2">General Waste</h4>
                        <p className="text-gray-600 text-sm">Non-recyclable plastics, wrappers. Sent to landfills.</p>
                      </div>
                    </div>
                  </section>
                </div>
                
                <div className="md:col-span-1">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sticky top-8">
                    <h3 className="font-bold text-lg text-slate-900 mb-4">Ready to test your knowledge?</h3>
                    <p className="text-sm text-slate-600 mb-6">
                      Take our Certification Exam to prove your understanding and earn Green Coins!
                    </p>
                    <ul className="text-sm text-slate-600 space-y-3 mb-6">
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> Passing score: 70%</li>
                      <li className="flex items-center gap-2"><Award className="h-4 w-4 text-yellow-500" /> Reward: 50 Coins</li>
                      <li className="flex items-center gap-2"><FileCheck className="h-4 w-4 text-blue-500" /> Official digital certificate</li>
                    </ul>
                    <button 
                      onClick={() => setActiveTab("exam")}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors"
                    >
                      Start Exam
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "exam" && (
            <div className="p-8 max-w-3xl mx-auto">
              {result ? (
                <div className="text-center py-8">
                  {result.passed ? (
                    <div className="animate-fade-in-up">
                      <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <Award className="h-12 w-12 text-yellow-500" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">Congratulations!</h2>
                      <p className="text-xl text-green-700 font-medium mb-6">You passed with a score of {result.score}%</p>
                      
                      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 p-6 rounded-xl inline-block text-left mb-8">
                        <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          Rewards Earned:
                        </h4>
                        <ul className="text-yellow-700 space-y-1 ml-7">
                          <li>• +50 Green Coins added to your account</li>
                          <li>• GreenLoop Official Certificate</li>
                        </ul>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={`/certificate/${result.certificateId}`} className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 shadow-sm">
                          View Certificate
                        </Link>
                        <Link href="/dashboard" className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm">
                          Return to Dashboard
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                        <AlertTriangle className="h-12 w-12 text-red-600" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">Exam Failed</h2>
                      <p className="text-xl text-red-700 font-medium mb-6">You scored {result.score}%. (Passing is {exam.passingScore}%)</p>
                      <p className="text-gray-600 mb-8">Please review the study materials and try again.</p>
                      <button 
                        onClick={() => { setResult(null); setAnswers({}); setActiveTab("learn"); }}
                        className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 shadow-sm"
                      >
                        Review Materials
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="mb-8 border-b border-gray-200 pb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{exam?.title}</h2>
                    <p className="text-gray-600 mt-2">{exam?.description}</p>
                    {!session && (
                      <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
                        <p className="font-medium">You must be logged in to submit this exam and earn rewards.</p>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                      {error}
                    </div>
                  )}

                  <div className="space-y-12">
                    {exam?.questions?.map((q: any, index: number) => {
                      const options = JSON.parse(q.options);
                      return (
                        <div key={q.id} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">
                            <span className="text-green-600 font-bold mr-2">{index + 1}.</span>
                            {q.text}
                          </h3>
                          <div className="space-y-3 pl-6">
                            {options.map((opt: string, optIndex: number) => (
                              <label key={optIndex} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${answers[q.id] === optIndex ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                                <input
                                  type="radio"
                                  name={`question-${q.id}`}
                                  checked={answers[q.id] === optIndex}
                                  onChange={() => handleOptionSelect(q.id, optIndex)}
                                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                />
                                <span className="ml-3 text-gray-700">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-10 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleSubmitExam}
                      disabled={submitting}
                      className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      {submitting ? "Grading..." : "Submit Exam"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
