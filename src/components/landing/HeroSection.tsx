import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden noise-texture">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1D29] via-[#252936] to-[#1A1D29] animate-gradient" />
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 107, 107, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 107, 107, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Hero Content */}
      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Logo with animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0 }}
            className="mb-8 flex justify-center"
          >
            <img 
              src="/logo.png" 
              alt="pulse" 
              className="h-24 w-24 md:h-32 md:w-32"
            />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#F5F5F7] mb-6 leading-tight"
          >
            Professional live streaming.
            <br />
            <span className="text-[#FF6B6B]">Zero cloud. Zero install.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-[#A0A3B1] max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            GPU-accelerated effects running entirely in your browser. WebGPU. WebCodecs. WASM. The future is here.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              size="lg"
              className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-8 py-6 text-lg rounded-lg animate-pulse-glow border-2 border-[#FF6B6B] transition-all duration-150 hover:scale-105 active:scale-98"
              onClick={() => {
                document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Join the Waitlist
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-[#3A3D4A] bg-transparent text-[#F5F5F7] hover:bg-[#252936] hover:border-[#FF6B6B] px-8 py-6 text-lg rounded-lg transition-all duration-150 hover:scale-105"
              onClick={() => {
                document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Watch Demo →
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-[#3A3D4A] rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}
