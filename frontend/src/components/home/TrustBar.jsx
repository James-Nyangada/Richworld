import { ShieldCheck, Star, CreditCard } from "lucide-react";

export default function TrustBar() {
  return (
    <section className="bg-gray-50 py-16 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          {/* KATO Placeholder */}
          <div className="flex items-center gap-2 group cursor-default">
            <ShieldCheck className="w-8 h-8 text-gray-600 group-hover:text-blue-600 transition-colors" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-800 leading-none">
                KATO
              </span>
              <span className="text-[0.6rem] font-semibold text-gray-500 tracking-wider">
                BONDED MEMBER
              </span>
            </div>
          </div>

          {/* TripAdvisor Placeholder */}
          <div className="flex items-center gap-2 group cursor-default">
            <div className="bg-gray-800 rounded-full p-1 group-hover:bg-[#00AA6C] transition-colors">
              <Star className="w-6 h-6 text-white fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-800 leading-none">
                Tripadvisor
              </span>
              <span className="text-[0.6rem] font-semibold text-gray-500 tracking-wider">
                TRAVELERS' CHOICE
              </span>
            </div>
          </div>

          {/* Payment Partners */}
          <div className="flex items-center gap-4 border-l border-gray-300 pl-8 md:ml-4">
            <span className="text-sm font-medium text-gray-400 mr-2 hidden md:inline-block">
              Secured by:
            </span>

            {/* Visa */}
            <div className="font-bold text-2xl text-gray-600 italic tracking-tighter hover:text-[#1434CB] transition-colors cursor-default">
              VISA
            </div>

            {/* Mastercard */}
            <div className="flex items-center justify-center hover:opacity-100 transition-opacity cursor-default">
              <div className="w-8 h-5 bg-gray-600 rounded relative overflow-hidden group-hover:bg-[#EB001B]">
                <div className="absolute top-0 left-0 w-1/2 h-full bg-gray-500 rounded-l group-hover:bg-[#F79E1B]"></div>
              </div>
              <span className="ml-1 font-bold text-gray-600 text-sm group-hover:text-black">
                Mastercard
              </span>
            </div>

            {/* Pesapal */}
            <div className="font-bold text-xl text-gray-600 hover:text-[#2d9cdb] transition-colors cursor-default">
              pesapal
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
