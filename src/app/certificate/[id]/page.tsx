"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { Award, Download, CheckCircle, Share2, Leaf } from "lucide-react";
import Link from "next/link";

export default function CertificatePage() {
  const { id } = useParams();
  const { status } = useSession();
  const router = useRouter();
  
  const [cert, setCert] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && id) {
      fetch(`/api/certificates/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Certificate not found or unauthorized");
          return res.json();
        })
        .then((data) => {
          setCert(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id, status, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Award className="h-8 w-8 text-red-600 opacity-50" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Certificate Unavailable</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link href="/dashboard" className="text-green-600 hover:text-green-700 font-medium">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Actions bar */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900">
            &larr; Back to Dashboard
          </Link>
          <div className="flex gap-4">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Share2 className="-ml-1 mr-2 h-4 w-4 text-gray-500" />
              Share
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
              <Download className="-ml-1 mr-2 h-4 w-4" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Certificate Rendering Box */}
        <div className="relative bg-white shadow-2xl rounded-none border-[12px] border-double border-green-800 p-8 sm:p-16 text-center overflow-hidden h-[600px] flex flex-col justify-center items-center animate-fade-in-up">
          
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
             {/* Decorative background pattern could go here */}
          </div>

          <div className="relative z-10 w-full">
            <div className="flex justify-center mb-6">
              <Leaf className="h-16 w-16 text-green-700" />
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-serif text-green-900 mb-2 uppercase tracking-widest">
              Certificate
            </h1>
            <h2 className="text-xl sm:text-2xl text-green-700 italic font-serif mb-12">
              of Completion
            </h2>

            <p className="text-gray-500 text-lg uppercase tracking-wider mb-4">
              This is presented to
            </p>
            
            <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 border-b border-gray-300 inline-block px-12 pb-2">
              {cert.user.name}
            </h3>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
              For successfully completing the comprehensive examination and demonstrating exceptional understanding in 
              <span className="font-bold text-gray-900"> {cert.title}</span>.
            </p>

            <div className="flex justify-between items-end w-full px-8 mt-auto pt-8">
              <div className="text-center">
                <div className="border-b border-gray-400 w-40 mb-2"></div>
                <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider">Date</p>
                <p className="text-sm text-gray-800">{new Date(cert.issueDate).toLocaleDateString()}</p>
              </div>
              
              <div className="flex flex-col items-center">
                 <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-200">
                    <Award className="h-12 w-12 text-white" />
                 </div>
              </div>

              <div className="text-center">
                <div className="w-40 border-b border-gray-400 mb-2">
                  <span className="font-cursive text-2xl text-green-800 font-bold block -mb-2">GreenLoop Org</span>
                </div>
                <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider">Authorized Signature</p>
              </div>
            </div>

            <div className="absolute top-4 right-4 text-xs text-gray-400 font-mono">
              ID: {cert.id.toUpperCase().substring(0,8)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
