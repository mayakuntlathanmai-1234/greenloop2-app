"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Calendar, Loader2, PlusCircle, Trash2 } from "lucide-react";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
};

export default function AdminEventsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (session?.user?.role !== "ADMIN" && status === "authenticated") {
      router.push("/dashboard");
    } else if (status === "authenticated") {
      fetchEvents();
    }
  }, [status, session, router]);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, date, location }),
      });

      if (res.ok) {
        // Reset form and refetch
        setTitle("");
        setDescription("");
        setDate("");
        setLocation("");
        fetchEvents();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to create event");
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
              <Calendar className="h-8 w-8 text-blue-500" />
              Manage Events
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Create and organize community cleanups and educational workshops.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Event Form */}
          <div className="lg:col-span-1 border border-slate-200 bg-white rounded-xl shadow-sm h-fit">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-100 rounded-t-xl">
              <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-slate-700" />
                Add New Event
              </h3>
            </div>
            <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
              {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">{error}</div>}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Beach Cleanup 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Central Park West Side"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Details about the event tasks and requirements."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50"
                >
                  {formLoading ? "Creating..." : "Create Event"}
                </button>
              </div>
            </form>
          </div>

          {/* Events List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200 bg-white">
                <h3 className="text-lg font-medium text-slate-900">Upcoming & Past Events</h3>
              </div>
              
              {events.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                  <p>No events found. Create one to get started.</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-200">
                  {events.map((event) => (
                    <li key={event.id} className="p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 mb-1">{event.title}</h4>
                          <p className="text-slate-600 text-sm mb-3 max-w-xl">{event.description}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                            <span className="flex items-center">
                              <Calendar className="mr-1.5 h-4 w-4 text-slate-400" />
                              {new Date(event.date).toLocaleString()}
                            </span>
                            <span className="flex items-center">
                              • {event.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
