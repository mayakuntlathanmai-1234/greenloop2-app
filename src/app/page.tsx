import Link from "next/link";
import { ArrowRight, Recycle, AlertTriangle, BookOpen, Calendar, Award } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center bg-green-50 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center mix-blend-multiply" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
          <div className="max-w-3xl">
            <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-800 text-sm font-semibold mb-6 animate-fade-in-up">
              “Turning Waste into Opportunity”
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
              Building a <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-700">Sustainable Future</span>
            </h1>
            <p className="text-xl text-gray-700 mb-10 max-w-2xl leading-relaxed">
              We are a group of passionate students striving to create awareness about responsible waste management. Through education, innovation, and community action, we aim to make small steps that lead to a cleaner, greener tomorrow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/courses" className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                Get Started
                <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
              </Link>
              <Link href="/about" className="inline-flex justify-center items-center px-8 py-4 border-2 border-green-600 text-lg font-medium rounded-full text-green-700 bg-white hover:bg-green-50 transition-all">
                Learn More
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-green-300 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-400 opacity-20 blur-3xl"></div>
      </section>

      {/* Feature Section 1 */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-12 lg:mb-0 relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl opacity-30 group-hover:opacity-50 blur-lg transition duration-500"></div>
              <img 
                src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                alt="Waste reporting" 
                className="relative rounded-2xl shadow-2xl w-full object-cover h-[400px]"
              />
            </div>
            <div>
              <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-6">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Did you witness illegal littering?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Help us keep our environment clean by reporting any cases of improper waste disposal. Your anonymous reports help local authorities take swift action.
              </p>
              <Link href="/reports/new" className="inline-flex items-center text-green-600 font-semibold text-lg hover:text-green-700">
                Report Here <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Why it matters */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1613&q=80')] bg-cover bg-center" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl font-bold mb-16">Why Waste Management is Important</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="text-green-400 font-bold text-4xl mb-2">50%</div>
              <p className="text-gray-300">Reduces pollution and environmental damage</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="text-emerald-400 font-bold text-4xl mb-2">♻️</div>
              <p className="text-gray-300">Conserves natural resources through recycling</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="text-green-400 font-bold text-4xl mb-2">❤️</div>
              <p className="text-gray-300">Promotes public health and hygiene</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="text-emerald-400 font-bold text-4xl mb-2">🌱</div>
              <p className="text-gray-300">Encourages sustainable community development</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 p-8 border border-gray-100">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <BookOpen className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Do Your Part</h3>
              <p className="text-gray-600 mb-6">
                Learn simple and effective ways to manage waste efficiently and make a positive impact.
              </p>
              <Link href="/courses" className="text-blue-600 font-semibold flex items-center hover:text-blue-700">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 p-8 border border-gray-100">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <Recycle className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Got Waste?</h3>
              <p className="text-gray-600 mb-6">
                Don’t let waste pile up — book a recycling session with our experts today.
              </p>
              <Link href="/waste-exchange" className="text-green-600 font-semibold flex items-center hover:text-green-700">
                Book Now <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-1 p-8 border border-gray-100">
              <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center mb-6">
                <Award className="h-7 w-7 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Earn Green Coins</h3>
              <p className="text-gray-600 mb-6">
                Participate in events, pass exams, and submit valid reports to earn reward points.
              </p>
              <Link href="/dashboard" className="text-yellow-600 font-semibold flex items-center hover:text-yellow-700">
                View Dashboard <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>Contact Us | Email: greenloop@gmail.com | Twitter: @GreenLoop2025</p>
          <p className="mt-4">© 2026 GreenLoop. All Rights Reserved.</p>
        </div>
      </footer>
    </main>
  );
}
