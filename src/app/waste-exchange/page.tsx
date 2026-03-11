"use client";

import Link from "next/link";
import { Recycle, ArrowRight, Truck, Clock, MapPin, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function WasteExchangePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [wasteType, setWasteType] = useState("Mixed Recyclables (Paper, Plastics, Glass)");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (status === "unauthenticated") {
        router.push("/login?callbackUrl=/waste-exchange");
        return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/waste-exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wasteType, quantity, date, time, address }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } else {
        setError(data.message || "Failed to submit request");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center border border-green-100">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
          <p className="text-gray-600 mb-6">Our partners will be in touch shortly to confirm your pickup.</p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Recycle className="h-16 w-16 text-green-600 mx-auto mb-6" />
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Waste Exchange</h1>
          <p className="mt-4 text-xl text-gray-600">
            Don't let recyclable waste pile up. Book a waste collection session with our trusted partners right from your doorstep.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
             <div className="bg-green-600 px-6 py-6 text-white">
                <h3 className="text-2xl font-bold">Book a Pickup</h3>
                <p className="text-green-100 mt-1">Fill out the details to schedule a collection.</p>
             </div>
             <form onSubmit={handleSubmit} className="p-8 space-y-6">
               {error && (
                 <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                   {error}
                 </div>
               )}
               {status === "unauthenticated" && (
                 <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md text-sm">
                   You must be logged in to schedule a pickup. 
                 </div>
               )}

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Waste Type</label>
                  <select 
                    value={wasteType}
                    onChange={(e) => setWasteType(e.target.value)}
                    required
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option>Mixed Recyclables (Paper, Plastics, Glass)</option>
                    <option>E-Waste (Electronics, Batteries)</option>
                    <option>Bulky Items (Furniture, Appliances)</option>
                    <option>Organic Compostable</option>
                  </select>
               </div>
               
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Quantity / Weight</label>
                  <input 
                    type="text" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    placeholder="e.g., 2 large bags, ~10kg" 
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                    <input 
                      type="time" 
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
                    />
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
                 <textarea 
                   rows={3} 
                   value={address}
                   onChange={(e) => setAddress(e.target.value)}
                   required
                   placeholder="Full building address and specific instructions" 
                   className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                 ></textarea>
               </div>

               <button 
                 type="submit" 
                 disabled={loading} 
                 className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50"
               >
                  {loading ? "Scheduling..." : "Schedule Free Pickup"}
                  <ArrowRight className="ml-2 h-5 w-5" />
               </button>
             </form>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">How it Works</h2>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-700 font-bold text-xl">1</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">Separate your waste</h4>
                <p className="text-gray-600 mt-1">Ensure your recyclables are clean, dry, and separated from general waste.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-700 font-bold text-xl">2</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">Schedule a pickup</h4>
                <p className="text-gray-600 mt-1">Use the form to choose a convenient time and tell us what you're exchanging.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-700 font-bold text-xl">3</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">We collect</h4>
                <p className="text-gray-600 mt-1">Our certified partners arrive at your location to collect the waste safely.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center border border-yellow-200 shadow-inner">
                <span className="text-yellow-700 font-bold text-xl">4</span>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">Earn Green Coins</h4>
                <p className="text-gray-600 mt-1">Receive Green Coins directly to your account based on the weight and type of recyclables surrendered!</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
