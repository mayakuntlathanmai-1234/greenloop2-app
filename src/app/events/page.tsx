"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Loader2, Info } from "lucide-react";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
};

export default function EventsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Calendar className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Upcoming Events</h1>
          <p className="mt-4 text-xl text-gray-500">
            Join hands with the community. Participate in local cleanups, workshops, and recycling drives.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center bg-white p-16 rounded-2xl border border-gray-200 shadow-sm max-w-3xl mx-auto">
            <Info className="mx-auto h-16 w-16 text-blue-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900">No events scheduled right now</h3>
            <p className="mt-2 text-gray-500 text-lg">Check back later for new community initiatives.</p>
            {status === "authenticated" && (
               <div className="mt-8">
                 <button onClick={() => router.push('/dashboard')} className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                   Return to Dashboard
                 </button>
               </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              const eventDate = new Date(event.date);
              const isPast = eventDate < new Date();
              return (
                <div key={event.id} className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 ${isPast ? 'opacity-70' : ''}`}>
                  <div className={`p-1 flex items-center justify-center ${isPast ? 'bg-gray-400' : 'bg-blue-600'}`}></div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                      {isPast && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Past
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 flex-1 mb-6">
                      {event.description}
                    </p>
                    
                    <div className="mt-auto space-y-3 pt-6 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                        <span className="font-medium text-gray-700">{eventDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                        <span className="font-medium text-gray-700">{event.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  {status === "authenticated" && !isPast && (
                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                       <button className="w-full bg-blue-50 text-blue-700 font-medium py-2 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
                         Register Interest
                       </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
