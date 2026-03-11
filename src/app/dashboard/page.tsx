"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Shield, BookOpen, AlertTriangle, Calendar, Award, FileCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function UserDashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const [coins, setCoins] = useState(0);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/coins").then(res => res.json()).then(data => setCoins(data.coins)).catch(console.error);
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Prevent admins from seeing user dashboard by default
  if (session?.user?.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:text-4xl sm:truncate">
              Welcome back, {session?.user?.name || "User"}!
            </h2>
            <p className="mt-2 text-lg text-gray-500">
              Manage your reports, events, and education progress here.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <div className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
              <Award className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Green Coins: <span className="font-bold ml-1">{coins}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card: Reports */}
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">My Reports</h3>
              <p className="mt-1 text-gray-500">Track your submitted illegal littering reports.</p>
              <div className="mt-6">
                <a href="/reports" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100">
                  View Reports
                </a>
              </div>
            </div>
          </div>

          {/* Card: Events */}
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Upcoming Events</h3>
              <p className="mt-1 text-gray-500">Join local waste management and recycling drives.</p>
              <div className="mt-6">
                <a href="/events" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100">
                  Browse Events
                </a>
              </div>
            </div>
          </div>

          {/* Card: Courses & Exams */}
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Education Hub</h3>
              <p className="mt-1 text-gray-500">Learn, take exams, and earn your certificate.</p>
              <div className="mt-6">
                <a href="/courses" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100">
                  Start Learning
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
