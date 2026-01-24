import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FooterSection() {
  return (
    <footer className="bg-[#1A1D29] border-t border-[#3A3D4A] py-12">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center space-y-6"
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="pulse" className="h-12 w-12" />
            <span className="text-2xl font-bold text-[#F5F5F7]">pulse</span>
          </div>

          {/* Tagline */}
          <p className="text-[#A0A3B1] max-w-md">
            Professional live streaming. Zero cloud. Zero install.
          </p>



          {/* Footer text */}
          <div className="pt-8 border-t border-[#3A3D4A] w-full">
            <p className="text-sm text-[#A0A3B1]">
              © {new Date().getFullYear()} pulse. Built with WebGPU, WebCodecs, and WASM.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <p className="text-sm text-[#A0A3B1]">Created by Peter Azmy</p>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-[#3A3D4A] hover:border-[#FF6B6B] hover:text-[#FF6B6B] text-[#A0A3B1]"
              >
                <a 
                  href="https://github.com/clefspear" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
