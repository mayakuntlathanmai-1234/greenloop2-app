"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Shield, Users, AlertTriangle, Calendar, FileText, Recycle } from "lucide-react";

export default function AdminDashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/admin/login");
    },
  });

  if (status === "loading") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen border-l border-slate-200 bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0 flex items-center gap-4">
            <div className="p-3 bg-slate-800 rounded-lg shadow-sm">
                <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold leading-7 text-slate-900 sm:text-4xl sm:truncate">
                Admin Control Center
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage reports, events, users, and educational content.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card: Manage Reports */}
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">Pending Reports</dt>
                    <dd className="text-2xl font-semibold text-slate-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100">
              <div className="text-sm">
                <a href="/admin/reports" className="font-medium text-slate-700 hover:text-slate-900 flex items-center justify-between">
                  View all reports
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Card: Manage Events */}
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">Upcoming Events</dt>
                    <dd className="text-2xl font-semibold text-slate-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100">
              <div className="text-sm">
                <a href="/admin/events" className="font-medium text-slate-700 hover:text-slate-900 flex items-center justify-between">
                  Manage events
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Card: Manage Exams */}
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-emerald-100 rounded-md p-3">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">Exams Database</dt>
                    <dd className="text-2xl font-semibold text-slate-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100">
              <div className="text-sm">
                <a href="/admin/exams" className="font-medium text-slate-700 hover:text-slate-900 flex items-center justify-between">
                  Manage exams
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Card: Users */}
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">Registered Users</dt>
                    <dd className="text-2xl font-semibold text-slate-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100">
              <div className="text-sm">
                <a href="/admin/users" className="font-medium text-slate-700 hover:text-slate-900 flex items-center justify-between">
                  View all users
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Card: Manage Waste Exchange */}
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <Recycle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">Waste Exchanges</dt>
                    <dd className="text-2xl font-semibold text-slate-900">0</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100">
              <div className="text-sm">
                <a href="/admin/waste-exchange" className="font-medium text-slate-700 hover:text-slate-900 flex items-center justify-between">
                  Manage pickups
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
