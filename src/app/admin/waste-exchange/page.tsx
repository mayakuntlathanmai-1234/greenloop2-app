"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Recycle, CheckCircle, Clock, XCircle, Award } from "lucide-react";

type PickupRequest = {
  id: string;
  wasteType: string;
  quantity: string;
  date: string;
  time: string;
  address: string;
  status: string;
  coinsRewarded: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
};

export default function AdminWasteExchangePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (session?.user?.role !== "ADMIN" && status === "authenticated") {
      router.push("/dashboard");
    } else if (status === "authenticated") {
      fetchRequests();
    }
  }, [status, session, router]);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/waste-exchange");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Failed to load pickup requests");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: string, coinsRewarded?: number) => {
    try {
      const payload: any = { status: newStatus };
      if (coinsRewarded !== undefined) {
        payload.coinsRewarded = coinsRewarded;
      }

      const res = await fetch(`/api/waste-exchange/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setRequests(requests.map(r => 
          r.id === requestId 
            ? { ...r, status: newStatus, coinsRewarded: coinsRewarded !== undefined ? coinsRewarded : r.coinsRewarded } 
            : r
        ));
      } else {
         alert("Failed to update status");
      }
    } catch (error) {
      console.error("Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="mr-1 h-3 w-3" /> Pending</span>;
      case "COMPLETED":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle className="mr-1 h-3 w-3" /> Completed</span>;
      case "CANCELLED":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="mr-1 h-3 w-3" /> Cancelled</span>;
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
              <Recycle className="h-8 w-8 text-green-600" />
              Manage Waste Exchange
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Review pickup requests, manage status, and reward users with Green Coins.
            </p>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg border border-slate-200 mt-6 shadow-sm">
            <Recycle className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">No requests yet</h3>
            <p className="mt-1 text-sm text-slate-500">Users haven't requested any waste pickups yet.</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md border border-slate-200">
            <ul role="list" className="divide-y divide-slate-200">
              {requests.map((request) => (
                <li key={request.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {request.wasteType} ({request.quantity})
                      </p>
                      <div className="ml-2 flex-shrink-0 flex gap-4 items-center">
                        {getStatusBadge(request.status)}
                        
                        {request.status === "PENDING" && (
                          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-md border border-slate-200">
                            <span className="text-xs font-medium text-slate-600 flex items-center gap-1"><Award className="w-3 h-3 text-yellow-500" /> Reward:</span>
                            <button onClick={() => handleStatusChange(request.id, "COMPLETED", 20)} className="text-xs bg-white border border-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 px-2 py-1 rounded">20</button>
                            <button onClick={() => handleStatusChange(request.id, "COMPLETED", 50)} className="text-xs bg-white border border-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 px-2 py-1 rounded">50</button>
                            <button onClick={() => handleStatusChange(request.id, "COMPLETED", 100)} className="text-xs bg-white border border-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 px-2 py-1 rounded">100</button>
                            <span className="text-slate-300 mx-1">|</span>
                            <button onClick={() => handleStatusChange(request.id, "CANCELLED")} className="text-xs text-slate-500 hover:text-red-600 px-2 py-1">Cancel</button>
                          </div>
                        )}
                        {request.status === "COMPLETED" && (
                           <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                             <Award className="w-3 h-3" /> {request.coinsRewarded} Coins Rewarded
                           </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex flex-col">
                         <p className="flex items-center text-sm text-slate-600 font-medium">
                          Requested by: {request.user.name} ({request.user.email})
                        </p>
                        <p className="flex items-center text-sm text-slate-500 mt-1">
                          📅 {request.date} at {request.time}
                        </p>
                        <p className="flex items-center text-sm text-slate-500 mt-1">
                          📍 {request.address}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-slate-500 sm:mt-0">
                        <p>
                          Created: <time dateTime={request.createdAt}>{new Date(request.createdAt).toLocaleDateString()}</time>
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
