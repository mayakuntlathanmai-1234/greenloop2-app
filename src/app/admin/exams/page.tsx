"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FileText, PlusCircle, Loader2, Save, Trash2 } from "lucide-react";

type Question = {
  text: string;
  options: string; // JSON
  answer: number;
};

type Exam = {
  id: string;
  title: string;
  description: string;
  passingScore: number;
  createdAt: string;
  questions: any[];
};

export default function AdminExamsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [passingScore, setPassingScore] = useState(70);
  
  const [questions, setQuestions] = useState<Question[]>([
    { text: "", options: '["Option A", "Option B", "Option C", "Option D"]', answer: 0 }
  ]);
  
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (session?.user?.role !== "ADMIN" && status === "authenticated") {
      router.push("/dashboard");
    } else if (status === "authenticated") {
      fetchExams();
    }
  }, [status, session, router]);

  const fetchExams = async () => {
    try {
      const res = await fetch("/api/admin/exams");
      const data = await res.json();
      setExams(data || []);
    } catch (err) {
      console.error("Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions, 
       { text: "", options: '["Option A", "Option B", "Option C", "Option D"]', answer: 0 }
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const newQuestions: any = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate structure (must have parsed options array)
    try {
        for (const q of questions) {
            const parsed = JSON.parse(q.options);
            if (!Array.isArray(parsed) || parsed.length < 2) {
                setError("Options must be a valid JSON array of strings with at least 2 items.");
                return;
            }
        }
    } catch (err) {
        setError("Invalid JSON format in options.");
        return;
    }

    setFormLoading(true);

    try {
      const payload = {
        title,
        description,
        passingScore,
        questions: questions.map(q => ({
            text: q.text,
            options: JSON.parse(q.options),
            answer: q.answer
        }))
      };

      const res = await fetch("/api/admin/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsCreating(false);
        setTitle("");
        setDescription("");
        setPassingScore(70);
        setQuestions([{ text: "", options: '["Option A", "Option B", "Option C", "Option D"]', answer: 0 }]);
        fetchExams();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to create exam");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <Loader2 className="h-12 w-12 text-slate-800 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <FileText className="h-8 w-8 text-emerald-600" />
              Manage Educational Exams
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Create and organize certification exams for users.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0">
             {!isCreating && (
                 <button onClick={() => setIsCreating(true)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 transition-colors">
                 <PlusCircle className="mr-2 h-4 w-4" /> Add New Exam
               </button>
             )}
          </div>
        </div>

        {isCreating && (
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
             <div className="px-6 py-5 border-b border-slate-200 bg-slate-100 flex justify-between items-center">
               <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
                 <PlusCircle className="h-5 w-5 text-slate-700" />
                 Create New Exam
               </h3>
               <button onClick={() => setIsCreating(false)} className="text-sm font-medium text-slate-500 hover:text-slate-700">Cancel</button>
             </div>
             
             <form onSubmit={handleCreateExam} className="p-6 space-y-6">
                {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">{error}</div>}
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="md:col-span-2">
                   <label className="block text-sm font-medium text-slate-700 mb-1">Exam Title</label>
                   <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="e.g. Advanced Recycling" />
                 </div>
                 
                 <div className="md:col-span-2">
                   <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                   <textarea required rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="What is this exam about?" />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Passing Score (%)</label>
                   <input type="number" required min="1" max="100" value={passingScore} onChange={(e) => setPassingScore(Number(e.target.value))} className="w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500" />
                 </div>
               </div>

               <div className="pt-6 border-t border-slate-200">
                 <h4 className="text-lg font-medium text-slate-900 mb-4">Questions</h4>
                 
                 <div className="space-y-6">
                   {questions.map((q, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-lg relative">
                        <button type="button" onClick={() => handleRemoveQuestion(idx)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <h5 className="font-medium text-slate-800 mb-4 text-sm">Question {idx + 1}</h5>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Question Text</label>
                            <input required value={q.text} onChange={(e) => handleQuestionChange(idx, "text", e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-emerald-500 focus:border-emerald-500" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Options (Valid JSON Array)</label>
                                <textarea required rows={2} value={q.options} onChange={(e) => handleQuestionChange(idx, "options", e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:ring-emerald-500 focus:border-emerald-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Correct Answer Index (0-based)</label>
                                <input type="number" required min="0" value={q.answer} onChange={(e) => handleQuestionChange(idx, "answer", Number(e.target.value))} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-emerald-500 focus:border-emerald-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                   ))}
                 </div>

                 <button type="button" onClick={handleAddQuestion} className="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                   <PlusCircle className="h-4 w-4" /> Add Another Question
                 </button>
               </div>

               <div className="pt-4 border-t border-slate-200 flex justify-end">
                 <button type="submit" disabled={formLoading} className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50">
                    {formLoading ? "Saving..." : <><Save className="h-4 w-4 mr-2" /> Save Exam</>}
                 </button>
               </div>
             </form>
           </div>
        )}

        {/* Exams List */}
        {!isCreating && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md border border-slate-200">
               {exams.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <FileText className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                        <p>No exams found. Create one to get started.</p>
                    </div>
                ) : (
                    <ul role="list" className="divide-y divide-slate-200">
                    {exams.map((exam) => (
                        <li key={exam.id}>
                        <div className="px-6 py-5 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-1">{exam.title}</h4>
                                    <p className="text-slate-600 text-sm mb-3 max-w-2xl">{exam.description}</p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                        Passing Score: {exam.passingScore}%
                                    </span>
                                    <p className="text-xs text-slate-500 mt-2">
                                        {exam.questions.length} Questions
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-slate-400">
                                Created: {new Date(exam.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        </li>
                    ))}
                    </ul>
                )}
            </div>
        )}
      </div>
    </div>
  );
}
