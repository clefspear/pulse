import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useState } from "react";

export default function DemoSection() {
  const [activeEffect, setActiveEffect] = useState<string>("blur");

  const effects = [
    { id: "blur", label: "Blur" },
    { id: "remove", label: "Remove" },
    { id: "color", label: "Color Correct" }
  ];

  return (
    <section id="demo" className="py-32 bg-[#252936] relative overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#F5F5F7] mb-4">
            See it in action
          </h2>
          <p className="text-xl text-[#A0A3B1] max-w-2xl mx-auto">
            Real-time effects running entirely in your browser
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Video Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden border-2 border-[#3A3D4A] shadow-2xl mb-8"
          >
            <div className="aspect-video bg-gradient-to-br from-[#1A1D29] to-[#252936] flex items-center justify-center">
              {/* Placeholder for demo video */}
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[#FF6B6B] flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-white ml-1" />
                </div>
                <p className="text-[#A0A3B1] text-lg">Click to see live demo</p>
              </div>
            </div>

            {/* Performance overlay */}
            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-[#3A3D4A]">
              <div className="flex items-center gap-4 text-sm font-mono">
                <span className="text-[#00D9FF]">60 FPS</span>
                <span className="text-[#3A3D4A]">|</span>
                <span className="text-[#00D9FF]">14ms</span>
                <span className="text-[#3A3D4A]">|</span>
                <span className="text-green-400">GPU: 45%</span>
              </div>
            </div>

            {/* Watermark for free tier demo */}
            <div className="absolute bottom-4 left-4 text-xs text-[#A0A3B1] font-mono opacity-60">
              Powered by pulse
            </div>
          </motion.div>

          {/* Effect Toggles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center gap-4 flex-wrap"
          >
            {effects.map((effect) => (
              <Button
                key={effect.id}
                onClick={() => setActiveEffect(effect.id)}
                className={`px-8 py-6 text-lg rounded-lg transition-all duration-200 ${
                  activeEffect === effect.id
                    ? "bg-[#FF6B6B] hover:bg-[#ff5252] text-white border-2 border-[#FF6B6B]"
                    : "bg-[#252936] hover:bg-[#1A1D29] text-[#A0A3B1] border-2 border-[#3A3D4A] hover:border-[#FF6B6B]"
                }`}
              >
                {effect.label}
              </Button>
            ))}
          </motion.div>

          {/* Technical note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center text-sm text-[#A0A3B1] mt-12 font-mono"
          >
            All processing happens on your device using WebGPU compute shaders. 
            <br />
            No frames are sent to any server.
          </motion.p>
        </div>
      </div>

      {/* Background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 217, 255, 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 217, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />
      </div>
    </section>
  );
}
