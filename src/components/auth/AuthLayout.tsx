import { ReactNode } from "react";
import { Link } from "react-router-dom";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0F1A] relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,107,107,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(99,102,241,0.1),transparent_50%)]" />
      
      <div className="max-w-md w-full px-4 relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <img src="/logo.png" alt="Pulse" className="h-12 w-12" />
            <span className="text-3xl font-bold text-[#F5F5F7]">pulse</span>
          </Link>
          <p className="text-[#A0A3B1] mt-2">
            Professional live streaming. Zero cloud. Zero install.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
