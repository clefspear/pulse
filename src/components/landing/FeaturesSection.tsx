import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Shield, Monitor } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-10 h-10" />,
    stat: "<16ms Latency",
    title: "Real-time effects at 60fps",
    description: "WebGPU-powered processing keeps your stream butter-smooth with imperceptible latency."
  },
  {
    icon: <Shield className="w-10 h-10" />,
    stat: "Zero Cloud",
    title: "Your video never leaves your device",
    description: "Complete privacy. All processing happens locally on your GPU. No data ever uploaded."
  },
  {
    icon: <Monitor className="w-10 h-10" />,
    stat: "Any Device",
    title: "Desktop, mobile, Chromebook",
    description: "Just a browser. Works everywhere modern browsers run. No installation required."
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-32 bg-[#1A1D29] relative overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#F5F5F7] mb-4">
            Built on cutting-edge web technology
          </h2>
          <p className="text-xl text-[#A0A3B1] max-w-2xl mx-auto">
            The power of native apps, the convenience of the web
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-[#252936] border-[#3A3D4A] hover:border-[#FF6B6B] transition-all duration-300 h-full group cursor-pointer hover:shadow-[0_0_30px_rgba(255,107,107,0.3)] hover:-translate-y-2">
                <CardHeader>
                  <div className="text-[#00D9FF] mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div className="font-mono text-2xl font-bold text-[#FF6B6B] mb-2">
                    {feature.stat}
                  </div>
                  <CardTitle className="text-xl text-[#F5F5F7]">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#A0A3B1]">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Technical specs ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-8 text-sm font-mono text-[#A0A3B1] border border-[#3A3D4A] rounded-full px-8 py-4 bg-[#252936]/50 backdrop-blur-sm">
            <span className="text-[#00D9FF]">WebGPU</span>
            <span className="text-[#3A3D4A]">•</span>
            <span className="text-[#00D9FF]">WebCodecs</span>
            <span className="text-[#3A3D4A]">•</span>
            <span className="text-[#00D9FF]">WASM</span>
            <span className="text-[#3A3D4A]">•</span>
            <span className="text-[#00D9FF]">TensorFlow Lite</span>
          </div>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B6B] rounded-full blur-[150px] opacity-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00D9FF] rounded-full blur-[150px] opacity-10" />
    </section>
  );
}
