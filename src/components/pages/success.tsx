import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Success() {
  const [waitlistNumber] = useState(Math.floor(Math.random() * 1000) + 1000);

  useEffect(() => {
    // Confetti or celebration animation could be added here
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1D29] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        <Card className="bg-[#252936] border-2 border-[#00D9FF] shadow-[0_0_50px_rgba(0,217,255,0.3)] p-12">
          <div className="text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-[#00D9FF] rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle2 className="w-12 h-12 text-[#1A1D29]" />
            </motion.div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl font-bold text-[#F5F5F7] mb-4">
              Welcome to pulse Pro!
            </h1>

            <p className="text-xl text-[#A0A3B1] mb-8">
              Your payment was successful. You're all set!
            </p>

            {/* Waitlist Number */}
            <div className="mb-8 p-6 bg-[#1A1D29] rounded-lg border border-[#3A3D4A]">
              <p className="text-[#A0A3B1] mb-2">Your early access number:</p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-6xl font-bold text-[#FF6B6B] font-mono"
              >
                #{waitlistNumber}
              </motion.div>
            </div>

            {/* Next Steps */}
            <div className="text-left mb-8 p-6 bg-[#1A1D29] rounded-lg border border-[#3A3D4A]">
              <h3 className="text-xl font-bold text-[#F5F5F7] mb-4">
                What's next?
              </h3>
              <ul className="space-y-3 text-[#A0A3B1]">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00D9FF] flex-shrink-0 mt-0.5" />
                  <span>Check your email for your receipt and welcome guide</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00D9FF] flex-shrink-0 mt-0.5" />
                  <span>We'll notify you as soon as pulse launches (estimated Q2 2026)</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Link to="/" className="block">
                <Button
                  className="w-full bg-[#FF6B6B] hover:bg-[#ff5252] text-white py-6 text-lg"
                >
                  Back to Home
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
