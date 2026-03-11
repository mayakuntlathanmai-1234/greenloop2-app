"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react";

type Report = {
  id: string;
  description: string;
  location: string;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
};

export default function AdminReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (session?.user?.role !== "ADMIN" && status === "authenticated") {
      router.push("/dashboard");
    } else if (status === "authenticated") {
      fetchReports();
    }
  }, [status, session, router]);

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/reports");
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setReports(reports.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
      }
    } catch (error) {
      console.error("Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="mr-1 h-3 w-3" /> Pending</span>;
      case "IN_PROGRESS":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Progress</span>;
      case "RESOLVED":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle className="mr-1 h-3 w-3" /> Resolved</span>;
      case "REJECTED":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="mr-1 h-3 w-3" /> Rejected</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              Manage User Reports
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Review and update the status of illegal littering reports submitted by users.
            </p>
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg border border-slate-200 mt-6 shadow-sm">
            <CheckCircle className="mx-auto h-12 w-12 text-emerald-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">All clear!</h3>
            <p className="mt-1 text-sm text-slate-500">There are currently no reports to manage.</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md border border-slate-200">
            <ul role="list" className="divide-y divide-slate-200">
              {reports.map((report) => (
                <li key={report.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {report.location}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex gap-2 items-center">
                        {getStatusBadge(report.status)}
                        <select
                          value={report.status}
                          onChange={(e) => handleStatusChange(report.id, e.target.value)}
                          className="ml-3 block pl-3 pr-10 py-1 text-xs border-slate-300 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm rounded-md shadow-sm border"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="RESOLVED">Resolved</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex flex-col">
                        <p className="flex items-center text-sm text-slate-600 font-medium">
                          Reported by: {report.user.name} ({report.user.email})
                        </p>
                        <p className="flex items-center text-sm text-slate-500 mt-1">
                          {report.description}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-slate-500 sm:mt-0">
                        <p>
                          <time dateTime={report.createdAt}>{new Date(report.createdAt).toLocaleString()}</time>
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
